import React from 'react';
import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react';

const StatusTracker = ({ currentStatus }) => {
  const steps = [
    { id: 'start', label: 'Application Started', status: 'completed' },
    { id: 'docs', label: 'Document Upload', status: currentStatus === 'Not Started' ? 'pending' : 'completed' },
    { id: 'ocr', label: 'AI OCR Verification', status: currentStatus === 'Not Started' ? 'waiting' : 'completed' },
    { id: 'eligibility', label: 'Eligibility Check', status: currentStatus === 'Eligible' ? 'completed' : (currentStatus === 'Under Review' ? 'pending' : 'waiting') },
    { id: 'final', label: 'Final Approval', status: currentStatus === 'Approved' ? 'completed' : 'waiting' },
  ];

  const getIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="text-green-500" size={24} />;
      case 'pending': return <Clock className="text-primary-500 animate-pulse" size={24} />;
      case 'waiting': return <Circle className="text-slate-700" size={24} />;
      default: return <AlertCircle className="text-slate-500" size={24} />;
    }
  };

  return (
    <div className="glass-card mb-8 overflow-hidden relative">
      <div className="flex justify-between items-center relative z-10">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center gap-3 relative flex-1">
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className={`absolute top-3 left-1/2 w-full h-[2px] -z-10 ${step.status === 'completed' ? 'bg-green-500/50' : 'bg-slate-800'}`} />
            )}

            <div className={`p-1 bg-slate-900 rounded-full`}>
              {getIcon(step.status)}
            </div>

            <div className="text-center">
              <p className={`text-xs font-bold uppercase tracking-tighter ${step.status === 'completed' ? 'text-white' : 'text-slate-500'}`}>
                {step.label}
              </p>
              <p className="text-[10px] text-slate-600 font-mono mt-0.5">
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
