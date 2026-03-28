import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, Fingerprint } from 'lucide-react';

const FraudDetection = ({ data }) => {
  if (!data) {
    return (
      <div className="glass-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
            <Fingerprint size={20} />
          </div>
          <h3 className="text-xl font-bold text-white">Fraud Analysis</h3>
        </div>
        <p className="text-slate-400 text-sm">Our AI agent monitors documents for potential fraud and inconsistencies.</p>
        <div className="mt-8 py-10 border-2 border-dashed border-white/5 rounded-xl flex flex-col items-center justify-center opacity-40">
          <ShieldAlert size={40} className="text-slate-600 mb-2" />
          <p className="text-slate-500 text-xs font-mono">SCANNING_INACTIVE</p>
        </div>
      </div>
    );
  }

  const { isFraudulent, confidenceScore, anomalies, timestamp } = data;

  return (
    <div className={`glass-card border-l-4 ${isFraudulent ? 'border-l-red-500' : 'border-l-green-500'}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isFraudulent ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
            {isFraudulent ? <ShieldAlert size={20} /> : <ShieldCheck size={20} />}
          </div>
          <h3 className="text-xl font-bold text-white">Fraud Analysis</h3>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-mono text-slate-500 uppercase">Confidence Score</p>
          <p className={`text-sm font-bold ${confidenceScore > 0.9 ? 'text-green-400' : 'text-orange-400'}`}>
            {(confidenceScore * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className={`p-4 rounded-xl ${isFraudulent ? 'bg-red-500/5' : 'bg-green-500/5'} border border-white/5`}>
          <div className="flex items-center gap-3 mb-2">
            {isFraudulent ? <AlertTriangle size={16} className="text-red-400" /> : <ShieldCheck size={16} className="text-green-400" />}
            <span className="text-sm font-bold uppercase tracking-wider">
              {isFraudulent ? 'Attention Required' : 'No Risks Detected'}
            </span>
          </div>
          <p className="text-sm text-slate-300">
            {isFraudulent
              ? "The Fraud Detection Agent found anomalies in the submitted documents that require manual verification."
              : "No duplicate records or identity mismatches were found across the national database."}
          </p>
        </div>

        {anomalies.length > 0 && (
          <div className="space-y-2 mt-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Detected Anomalies</p>
            {anomalies.map((anomaly, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-red-500/10 rounded-lg text-xs text-red-300 border border-red-500/20">
                <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                {anomaly}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
        <span className="text-xs text-slate-500">Agent: FraudDetectionAgent v2.0</span>
        <button className="text-[10px] font-bold px-3 py-1 rounded bg-white/5 text-slate-400 hover:text-white transition-colors">REPORT ERROR</button>
      </div>
    </div>
  );
};

export default FraudDetection;
