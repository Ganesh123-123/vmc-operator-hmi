import React, { useState } from 'react';
import { useWorkflow } from './hooks/useWorkflow';
import { LoginPage } from './components/LoginPage';
import { Header } from './components/Header';
import { ProgressStepper } from './components/ProgressStepper';
import { BottomBar } from './components/BottomBar';
import { DashboardView } from './components/DashboardView';
import { StartupSplash } from './components/StartupSplash';
import { Stage1MachineChecks } from './components/Stage1MachineChecks';
import { Stage2RequiredTools } from './components/Stage2RequiredTools';
import { Stage3WorkpieceSetup } from './components/Stage3WorkpieceSetup';
import { Stage4ReadyReview } from './components/Stage4ReadyReview';
import { Stage5Operation } from './components/Stage5Operation';
import { ConfirmationModal } from './components/ConfirmationModal';
import { Toast } from './components/Toast';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export const App: React.FC = () => {
  const {
    operator,
    activeView,
    setActiveView,
    dashboardStats,
    machine,
    workflow,
    machineChecks,
    tools,
    workpieceItems,
    readyReview,
    telemetry,
    loading,
    actionLoading,
    error,
    toast,
    login,
    logout,
    showToast,
    refreshAll,
    confirmMachineCheck,
    confirmTool,
    confirmWorkpieceItem,
    nextStage,
    startOperation,
    stopOperation,
    resetWorkflow
  } = useWorkflow();

  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);

  const handleConfirmReset = async () => {
    await resetWorkflow();
    setIsResetModalOpen(false);
  };

  // 1. If not logged in, render the Operator Login screen
  if (!operator) {
    return (
      <LoginPage
        onLogin={login}
        loading={actionLoading}
        error={error}
      />
    );
  }

  // 2. Initial loading state
  if (loading && !workflow) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center font-mono">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-4 shadow-glow-cyan/30">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
        <h2 className="text-xl font-bold text-white tracking-wider">INITIALIZING VMC-01 HMI SYSTEM</h2>
        <p className="text-sm text-slate-400 mt-2">Connecting to CNC controller telemetry...</p>
      </div>
    );
  }

  // 3. Fatal Error state with retry
  if (error && !workflow) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center font-mono">
        <div className="w-16 h-16 rounded-2xl bg-red-950 border border-red-500/50 flex items-center justify-center text-red-400 mb-4 shadow-glow-red/30">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white tracking-wider">HMI COMMUNICATION ERROR</h2>
        <p className="text-sm text-red-300 mt-2 max-w-md">{error}</p>
        <button
          onClick={() => refreshAll()}
          className="mt-6 px-6 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white hover:bg-slate-800 font-bold text-sm flex items-center gap-2 btn-tactile cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          RETRY CONNECTION
        </button>
      </div>
    );
  }

  const currentStage = workflow?.currentStage || 'STAGE_1_CHECKS';

  return (
    <div className="min-h-screen bg-[#070A10] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
      
      {/* 1. Industrial Header */}
      <Header
        machine={machine}
        workflow={workflow}
        operator={operator}
        activeView={activeView}
        onChangeView={setActiveView}
        onLogout={logout}
        onResetClick={() => setIsResetModalOpen(true)}
      />

      {/* 2. Main View Router (Dashboard vs HMI Guidance) */}
      {activeView === 'dashboard' ? (
        <main className="flex-1 flex flex-col justify-start py-6 px-4 md:px-8">
          <DashboardView
            stats={dashboardStats}
            workflow={workflow}
            onGoToHmi={() => setActiveView('hmi')}
            loading={loading}
          />
        </main>
      ) : (
        <>
          {/* Progress Stepper (Shown for stages 1 to 5) */}
          {currentStage !== 'POWER_ON' && (
            <ProgressStepper workflow={workflow} />
          )}

          {/* Main Stage Dynamic Guidance Content */}
          <main className="flex-1 flex flex-col justify-center py-6 px-4 md:px-8">
            
            {currentStage === 'POWER_ON' && (
              <StartupSplash
                machine={machine}
                onBeginChecks={() => nextStage('STAGE_1_CHECKS')}
                loading={actionLoading}
              />
            )}

            {currentStage === 'STAGE_1_CHECKS' && (
              <Stage1MachineChecks
                checks={machineChecks}
                onConfirmCheck={confirmMachineCheck}
                onNextStage={() => nextStage('STAGE_2_TOOLS')}
                loading={actionLoading}
              />
            )}

            {currentStage === 'STAGE_2_TOOLS' && (
              <Stage2RequiredTools
                tools={tools}
                onConfirmTool={confirmTool}
                onNextStage={() => nextStage('STAGE_3_WORKPIECE')}
                loading={actionLoading}
              />
            )}

            {currentStage === 'STAGE_3_WORKPIECE' && (
              <Stage3WorkpieceSetup
                workpieceItems={workpieceItems}
                onConfirmItem={confirmWorkpieceItem}
                onNextStage={() => nextStage('STAGE_4_READY')}
                loading={actionLoading}
              />
            )}

            {currentStage === 'STAGE_4_READY' && (
              <Stage4ReadyReview
                readyReview={readyReview}
                workflow={workflow}
                onProceedToOperation={() => nextStage('STAGE_5_OPERATION')}
                loading={actionLoading}
              />
            )}

            {currentStage === 'STAGE_5_OPERATION' && (
              <Stage5Operation
                telemetry={telemetry}
                machine={machine}
                workflow={workflow}
                onStart={startOperation}
                onStop={stopOperation}
                loading={actionLoading}
              />
            )}

          </main>
        </>
      )}

      {/* 3. Bottom Industrial Telemetry Bar */}
      <BottomBar machine={machine} />

      {/* 4. Reset Workflow Confirmation Modal */}
      <ConfirmationModal
        isOpen={isResetModalOpen}
        title="RESET CURRENT WORKFLOW?"
        message="Resetting will clear all confirmed machine checks, tooling installations, and workpiece clamping verifications, returning the HMI to Stage 1 – Machine Checks."
        confirmText="CONFIRM RESET"
        cancelText="CANCEL"
        onConfirm={handleConfirmReset}
        onCancel={() => setIsResetModalOpen(false)}
        loading={actionLoading}
      />

      {/* 5. Toast Notifications */}
      <Toast
        toast={toast}
        onClose={() => showToast('', 'info')}
      />

    </div>
  );
};
