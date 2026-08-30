"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = seedDatabase;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function seedDatabase() {
    console.log('--- Initializing VMC Database Seed ---');
    // 1. Initialize Machine Record
    await prisma.machine.upsert({
        where: { id: 'VMC-01' },
        update: {
            name: 'VMC-01',
            type: '3-Axis Vertical Machining Center',
            status: 'ONLINE',
            powerStatus: 'ON',
            operationName: 'Pocket Milling',
            material: 'Aluminium 6061-T6',
            quantity: 1,
            drawingNumber: 'PRF-VMC-001',
            drawingRevision: 'REV-B',
            cncProgram: 'PRF_VMC_POCKET_001',
            programRevision: 'REV-B',
            fixture: 'Precision Vice Fixture – FV-100',
            workOffset: 'G54',
            dimensions: '100 mm × 80 mm × 25 mm',
            orientation: 'Datum A facing upward, X0/Y0 at lower-left corner of the workpiece.'
        },
        create: {
            id: 'VMC-01',
            name: 'VMC-01',
            type: '3-Axis Vertical Machining Center',
            status: 'ONLINE',
            powerStatus: 'ON',
            operationName: 'Pocket Milling',
            material: 'Aluminium 6061-T6',
            quantity: 1,
            drawingNumber: 'PRF-VMC-001',
            drawingRevision: 'REV-B',
            cncProgram: 'PRF_VMC_POCKET_001',
            programRevision: 'REV-B',
            fixture: 'Precision Vice Fixture – FV-100',
            workOffset: 'G54',
            dimensions: '100 mm × 80 mm × 25 mm',
            orientation: 'Datum A facing upward, X0/Y0 at lower-left corner of the workpiece.'
        }
    });
    // 2. Initialize Workflow State
    await prisma.workflowState.upsert({
        where: { id: 'CURRENT' },
        update: {
            currentStage: 'STAGE_1_CHECKS',
            activeItemIndex: 0,
            isReady: false,
            operationStatus: 'READY',
            operationStartedAt: null,
            operationStoppedAt: null,
            elapsedSeconds: 0,
            feedRateOverride: 100,
            spindleRpm: 4500,
            coolantActive: true
        },
        create: {
            id: 'CURRENT',
            currentStage: 'STAGE_1_CHECKS',
            activeItemIndex: 0,
            isReady: false,
            operationStatus: 'READY',
            operationStartedAt: null,
            operationStoppedAt: null,
            elapsedSeconds: 0,
            feedRateOverride: 100,
            spindleRpm: 4500,
            coolantActive: true
        }
    });
    // 3. Initialize 6 Machine Checks
    const machineChecks = [
        {
            id: 1,
            orderIndex: 1,
            title: 'Power / Control Available',
            description: 'Verify that machine power and CNC control are available.'
        },
        {
            id: 2,
            orderIndex: 2,
            title: 'Emergency Stop Released',
            description: 'Verify that the emergency stop button is released.'
        },
        {
            id: 3,
            orderIndex: 3,
            title: 'Guard / Door Closed',
            description: 'Verify that machine guards and doors are securely closed.'
        },
        {
            id: 4,
            orderIndex: 4,
            title: 'No Active Alarm',
            description: 'Verify that there are no active machine alarms.'
        },
        {
            id: 5,
            orderIndex: 5,
            title: 'Lubrication / Coolant Ready',
            description: 'Verify that lubrication and coolant systems are ready.'
        },
        {
            id: 6,
            orderIndex: 6,
            title: 'Reference Return Complete',
            description: 'Verify that all required machine axes have completed reference return.'
        }
    ];
    for (const check of machineChecks) {
        await prisma.machineCheck.upsert({
            where: { id: check.id },
            update: {
                orderIndex: check.orderIndex,
                title: check.title,
                description: check.description,
                status: 'PENDING',
                confirmedAt: null
            },
            create: {
                id: check.id,
                orderIndex: check.orderIndex,
                title: check.title,
                description: check.description,
                status: 'PENDING',
                confirmedAt: null
            }
        });
    }
    // 4. Initialize 4 Required Tools
    const tools = [
        {
            id: 1,
            toolNumber: 'T01',
            type: 'Face Mill',
            description: '50 mm Face Mill',
            purpose: 'Facing',
            instruction: 'Insert T01 into the tool holder and confirm correct tool installation.',
            required: true
        },
        {
            id: 2,
            toolNumber: 'T02',
            type: 'End Mill',
            description: '10 mm Carbide End Mill',
            purpose: 'Pocket Milling',
            instruction: 'Insert T02 into the tool holder and confirm correct tool installation.',
            required: true
        },
        {
            id: 3,
            toolNumber: 'T03',
            type: 'Drill',
            description: '6 mm Carbide Drill',
            purpose: 'Drilling',
            instruction: 'Insert T03 into the tool holder and confirm correct tool installation.',
            required: true
        },
        {
            id: 4,
            toolNumber: 'T04',
            type: 'Ball Nose End Mill',
            description: '8 mm Ball Nose End Mill',
            purpose: 'Finishing',
            instruction: 'Insert T04 into the tool holder and confirm correct tool installation.',
            required: true
        }
    ];
    for (const tool of tools) {
        await prisma.tool.upsert({
            where: { id: tool.id },
            update: {
                toolNumber: tool.toolNumber,
                type: tool.type,
                description: tool.description,
                purpose: tool.purpose,
                instruction: tool.instruction,
                required: tool.required,
                status: 'PENDING',
                confirmedAt: null
            },
            create: {
                id: tool.id,
                toolNumber: tool.toolNumber,
                type: tool.type,
                description: tool.description,
                purpose: tool.purpose,
                instruction: tool.instruction,
                required: tool.required,
                status: 'PENDING',
                confirmedAt: null
            }
        });
    }
    // 5. Initialize 6 Workpiece Setup Items
    const workpieceItems = [
        {
            id: 1,
            orderIndex: 1,
            title: 'Clean Surfaces',
            instruction: 'Clean fixture and workpiece contact surfaces.',
            detail: 'Ensure parallel bars and vice jaws are free of swarf, debris, and oil film.'
        },
        {
            id: 2,
            orderIndex: 2,
            title: 'Place Workpiece',
            instruction: 'Place workpiece against the fixed jaw.',
            detail: 'Position the Aluminium 6061-T6 block flush against the fixed jaw on parallels.'
        },
        {
            id: 3,
            orderIndex: 3,
            title: 'Verify Orientation',
            instruction: 'Verify workpiece orientation: Datum A facing upward, X0/Y0 at lower-left corner.',
            detail: 'Check block alignment with drawing PRF-VMC-001 REV-B orientation specs.'
        },
        {
            id: 4,
            orderIndex: 4,
            title: 'Clamp Securely',
            instruction: 'Clamp securely using vice handle.',
            detail: 'Apply standard clamping torque to FV-100 precision vice and tap with dead blow mallet.'
        },
        {
            id: 5,
            orderIndex: 5,
            title: 'Verify Stability',
            instruction: 'Verify the workpiece is stable.',
            detail: 'Check that parallels do not slide and workpiece seating is rigid with 0.00 mm lift.'
        },
        {
            id: 6,
            orderIndex: 6,
            title: 'Confirm Work Offset',
            instruction: 'Confirm work offset G54 is prepared.',
            detail: 'Verify G54 X0 Y0 Z0 coordinates match probed datum values in CNC controller.'
        }
    ];
    for (const item of workpieceItems) {
        await prisma.workpieceSetup.upsert({
            where: { id: item.id },
            update: {
                orderIndex: item.orderIndex,
                title: item.title,
                instruction: item.instruction,
                detail: item.detail,
                status: 'PENDING',
                confirmedAt: null
            },
            create: {
                id: item.id,
                orderIndex: item.orderIndex,
                title: item.title,
                instruction: item.instruction,
                detail: item.detail,
                status: 'PENDING',
                confirmedAt: null
            }
        });
    }
    // 6. Seed initial audit log
    await prisma.operationLog.create({
        data: {
            level: 'INFO',
            stage: 'POWER_ON',
            message: 'VMC-01 System Initialized. HMI Startup Sequence initiated by operator.'
        }
    });
    console.log('✓ VMC Database Seed Completed Successfully.');
}
if (require.main === module) {
    seedDatabase()
        .catch((e) => {
        console.error('Database seed error:', e);
        process.exit(1);
    })
        .finally(async () => {
        await prisma.$disconnect();
    });
}
