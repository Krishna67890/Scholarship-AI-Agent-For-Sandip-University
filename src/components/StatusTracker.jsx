import React from 'react';
import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react';

const StatusTracker = ({ currentStatus }) => {
  const steps = [
    { id: 'start', label: 'Started', fullLabel: 'Application Started', status: 'completed' },
    { id: 'docs', label: 'Upload', fullLabel: 'Document Upload', status: currentStatus === 'Not Started' ? 'pending' : 'completed' },
    { id: 'ocr', label: 'OCR', fullLabel: 'AI OCR Verification', status: (currentStatus === 'Not Started' || currentStatus === 'Scanning') ? 'waiting' : 'completed' },
    { id: 'eligibility', label: 'Eligibility', fullLabel: 'Eligibility Check', status: currentStatus === 'Eligible' ? 'completed' : (currentStatus === 'Under Review' ? 'pending' : 'waiting') },
    { id: 'final', label: 'Final', fullLabel: 'Final Approval', status: currentStatus === 'Approved' ? 'completed' : 'waiting' },
  ];

  const getIcon = (status, size = 24) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="text-green-500" size={size} />;
      case 'pending': return <Clock className="text-primary-500 animate-pulse" size={size} />;
      case 'waiting': return <Circle className="text-slate-700" size={size} />;
      default: return <AlertCircle className="text-slate-500" size={size} />;
    }
  };

  return (
    <div className="glass-card mb-8 overflow-hidden relative p-4 sm:p-6">
      <div className="flex justify-between items-center relative z-10 gap-1 sm:gap-2">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center gap-2 sm:gap-3 relative flex-1">
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className={`absolute top-3 sm:top-4 left-1/2 w-full h-[1px] sm:h-[2px] -z-10 ${step.status === 'completed' ? 'bg-green-500/50' : 'bg-slate-800'}`} />
            )}

            <div className={`p-0.5 sm:p-1 bg-slate-900 rounded-full`}>
              {getIcon(step.status, window.innerWidth < 640 ? 18 : 24)}
            </div>

            <div className="text-center">
              <p className={`text-[7px] sm:text-xs font-black uppercase tracking-tighter ${step.status === 'completed' ? 'text-white' : 'text-slate-500'}`}>
                <span className="hidden xs:inline">{step.fullLabel}</span>
                <span className="xs:hidden">{step.label}</span>
              </p>
              <p className="text-[6px] sm:text-[10px] text-slate-600 font-mono mt-0.5 hidden xxs:block">
                {step.status === 'completed' ? 'VERIFIED' : (step.status === 'pending' ? 'IN PROGRESS' : 'WAITING')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary-600/10 blur-3xl rounded-full" />
    </div>
  );
};

export default StatusTracker;
