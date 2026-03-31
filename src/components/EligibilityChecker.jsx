import React from 'react';
import { CheckCircle2, XCircle, Info, ChevronRight } from 'lucide-react';

const EligibilityChecker = ({ data }) => {
  if (!data) {
    return (
      <div className="glass-card h-full flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
            <Info size={20} />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white uppercase tracking-tight">Eligibility Analysis</h3>
        </div>
        <p className="text-slate-400 text-xs sm:text-sm">Upload your marksheet and income certificate to see your eligibility status.</p>
        <div className="mt-6 sm:mt-8 py-8 sm:py-10 border-2 border-dashed border-white/5 rounded-xl flex flex-col items-center justify-center flex-1">
          <p className="text-slate-500 text-[10px] sm:text-sm italic font-mono">WAITING_FOR_DATA...</p>
        </div>
      </div>
    );
  }

  const { isEligible, reasons, incomeEligible, marksEligible, timestamp } = data;

  return (
    <div className="glass-card border-l-4 border-l-blue-500 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isEligible ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {isEligible ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white uppercase tracking-tight">Eligibility Analysis</h3>
        </div>
        <span className="text-[8px] sm:text-[10px] font-mono text-slate-500 uppercase">{timestamp?.split('T')[1]?.slice(0, 8) || '00:00:00'}</span>
      </div>

      <div className="space-y-3 sm:space-y-4 flex-1">
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${incomeEligible ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-xs sm:text-sm font-medium uppercase tracking-wide">Income Criteria</span>
          </div>
          <span className={`text-[10px] sm:text-xs font-bold ${incomeEligible ? 'text-green-400' : 'text-red-400'}`}>
            {incomeEligible ? 'PASSED' : 'FAILED'}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${marksEligible ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-xs sm:text-sm font-medium uppercase tracking-wide">Academic Criteria</span>
          </div>
          <span className={`text-[10px] sm:text-xs font-bold ${marksEligible ? 'text-green-400' : 'text-red-400'}`}>
            {marksEligible ? 'PASSED' : 'FAILED'}
          </span>
        </div>

        {reasons.length > 0 && (
          <div className="mt-6">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">AI Agent Observations</p>
            <ul className="space-y-2">
              {reasons.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <ChevronRight size={14} className="mt-0.5 text-primary-500 shrink-0" />
                  <span className="leading-relaxed">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
        <span className="text-[8px] sm:text-xs text-slate-500 font-mono">AGENT_E_R_V1.2</span>
        <button className="text-[8px] sm:text-xs font-bold text-primary-400 hover:text-primary-300 underline uppercase tracking-tighter">View Policy</button>
      </div>
    </div>
  );
};

export default EligibilityChecker;
