import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';
import { ensureDatabaseReady } from '../src/database/prisma';

describe('VMC Operator HMI - Startup Guidance & Safety Validation Suite', () => {
  beforeAll(async () => {
    await ensureDatabaseReady();
    // Reset state to clean baseline
    await request(app).post('/api/workflow/reset');
  });

  it('1. POST /api/auth/login validates credentials and rejects invalid ones', async () => {
    const invalidRes = await request(app).post('/api/auth/login').send({ username: 'operator', password: 'wrongpassword' });
    expect(invalidRes.status).toBe(401);
    expect(invalidRes.body.success).toBe(false);

    const validRes = await request(app).post('/api/auth/login').send({ username: 'operator', password: 'operator123' });
    expect(validRes.status).toBe(200);
    expect(validRes.body.success).toBe(true);
    expect(validRes.body.data.username).toBe('operator');
    expect(validRes.body.data.machineId).toBe('VMC-01');
  });

  it('2. GET /api/dashboard/stats returns OEE, sensors, and tool wear metrics', async () => {
    const res = await request(app).get('/api/dashboard/stats');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.oee.score).toBe(88.5);
    expect(res.body.data.sensors.airPressureBar).toBe(6.0);
    expect(res.body.data.toolLife.length).toBe(4);
  });

  it('3. GET /api/machine returns machine details and machining scenario specs', async () => {
    const res = await request(app).get('/api/machine');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('VMC-01');
    expect(res.body.data.operationName).toBe('Pocket Milling');
    expect(res.body.data.material).toBe('Aluminium 6061-T6');
    expect(res.body.data.drawingRevision).toBe('REV-B');
    expect(res.body.data.cncProgram).toBe('PRF_VMC_POCKET_001');
    expect(res.body.data.workOffset).toBe('G54');
    expect(res.body.data.dimensions).toBe('100 mm × 80 mm × 25 mm');
  });

  it('4. Initial workflow state is STAGE_1_CHECKS with 0 checks confirmed', async () => {
    const res = await request(app).get('/api/workflow');
    expect(res.status).toBe(200);
    expect(res.body.data.currentStage).toBe('STAGE_1_CHECKS');
    expect(res.body.data.summary.machineChecksConfirmed).toBe(0);
    expect(res.body.data.summary.machineChecksTotal).toBe(6);
    expect(res.body.data.summary.canProceedToNextStage).toBe(false);
  });

  it('5. Cannot advance to STAGE_2_TOOLS if machine checks are incomplete', async () => {
    const res = await request(app).post('/api/workflow/next').send({ targetStage: 'STAGE_2_TOOLS' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.message).toMatch(/Complete all 6 machine checks/i);
  });

  it('6. Confirms all 6 machine checks sequentially', async () => {
    for (let id = 1; id <= 6; id++) {
      const confirmRes = await request(app).post(`/api/machine-checks/${id}/confirm`).send({ confirmedBy: 'operator' });
      expect(confirmRes.status).toBe(200);
      expect(confirmRes.body.data.check.status).toBe('CONFIRMED');
    }

    const workflowRes = await request(app).get('/api/workflow');
    expect(workflowRes.body.data.summary.machineChecksConfirmed).toBe(6);
    expect(workflowRes.body.data.summary.allChecksComplete).toBe(true);
    expect(workflowRes.body.data.summary.canProceedToNextStage).toBe(true);
  });

  it('7. Successfully advances to STAGE_2_TOOLS after machine checks completion', async () => {
    const res = await request(app).post('/api/workflow/next');
    expect(res.status).toBe(200);
    expect(res.body.data.currentStage).toBe('STAGE_2_TOOLS');
  });

  it('8. Cannot advance to STAGE_3_WORKPIECE if required tools are unconfirmed', async () => {
    const res = await request(app).post('/api/workflow/next').send({ targetStage: 'STAGE_3_WORKPIECE' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.message).toMatch(/confirm all required tools/i);
  });

  it('9. Confirms all 4 required cutting tools (T01, T02, T03, T04)', async () => {
    for (let id = 1; id <= 4; id++) {
      const confirmRes = await request(app).post(`/api/tools/${id}/confirm`);
      expect(confirmRes.status).toBe(200);
      expect(confirmRes.body.data.tool.status).toBe('CONFIRMED');
    }

    const workflowRes = await request(app).get('/api/workflow');
    expect(workflowRes.body.data.summary.toolsConfirmed).toBe(4);
    expect(workflowRes.body.data.summary.allToolsComplete).toBe(true);
  });

  it('10. Advances to STAGE_3_WORKPIECE and enforces 6-step workpiece setup confirmation', async () => {
    const advanceRes = await request(app).post('/api/workflow/next');
    expect(advanceRes.status).toBe(200);
    expect(advanceRes.body.data.currentStage).toBe('STAGE_3_WORKPIECE');

    // Confirm 6 workpiece items
    for (let id = 1; id <= 6; id++) {
      const confirmRes = await request(app).post(`/api/workpiece/${id}/confirm`);
      expect(confirmRes.status).toBe(200);
      expect(confirmRes.body.data.workpieceItem.status).toBe('CONFIRMED');
    }

    const workflowRes = await request(app).get('/api/workflow');
    expect(workflowRes.body.data.summary.workpieceConfirmed).toBe(6);
    expect(workflowRes.body.data.summary.allWorkpieceComplete).toBe(true);
  });

  it('11. Advances to STAGE_4_READY and verifies Ready Review state', async () => {
    const advanceRes = await request(app).post('/api/workflow/next');
    expect(advanceRes.status).toBe(200);
    expect(advanceRes.body.data.currentStage).toBe('STAGE_4_READY');

    const readyRes = await request(app).get('/api/ready-review');
    expect(readyRes.status).toBe(200);
    expect(readyRes.body.data.isReady).toBe(true);
    expect(readyRes.body.data.canProceedToOperation).toBe(true);
    expect(readyRes.body.data.categories.machineChecks.isComplete).toBe(true);
    expect(readyRes.body.data.categories.requiredTools.isComplete).toBe(true);
    expect(readyRes.body.data.categories.workpieceSetup.isComplete).toBe(true);
  });

  it('12. Advances to STAGE_5_OPERATION, starts spindle/cycle, and stops operation safely', async () => {
    const advanceRes = await request(app).post('/api/workflow/next');
    expect(advanceRes.status).toBe(200);
    expect(advanceRes.body.data.currentStage).toBe('STAGE_5_OPERATION');

    // Start operation
    const startRes = await request(app).post('/api/operation/start');
    expect(startRes.status).toBe(200);
    expect(startRes.body.data.telemetry.status).toBe('RUNNING');
    expect(startRes.body.data.telemetry.spindleRpm).toBeGreaterThan(0);
    expect(startRes.body.data.telemetry.coolantStatus).toBe('ON');

    // Stop operation
    const stopRes = await request(app).post('/api/operation/stop');
    expect(stopRes.status).toBe(200);
    expect(stopRes.body.data.telemetry.status).toBe('STOPPED');
    expect(stopRes.body.data.telemetry.spindleRpm).toBe(0);
    expect(stopRes.body.data.telemetry.coolantStatus).toBe('OFF');
  });

  it('13. Workflow Reset returns machine to Stage 1 and resets all confirmations', async () => {
    const resetRes = await request(app).post('/api/workflow/reset');
    expect(resetRes.status).toBe(200);
    expect(resetRes.body.data.progress.currentStage).toBe('STAGE_1_CHECKS');
    expect(resetRes.body.data.progress.summary.machineChecksConfirmed).toBe(0);
    expect(resetRes.body.data.progress.summary.toolsConfirmed).toBe(0);
    expect(resetRes.body.data.progress.summary.workpieceConfirmed).toBe(0);
    expect(resetRes.body.data.progress.isReady).toBe(false);
  });
});
