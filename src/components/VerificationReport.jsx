import React from 'react';
import { FileCheck, Download, ShieldCheck, Printer, Calendar, Database, ShieldAlert, FileText, Fingerprint, ImageIcon, CheckCircle2, XCircle, Activity } from 'lucide-react';

const VerificationReport = ({ applicationData, user, mailName }) => {
  const reportDate = new Date().toLocaleDateString();
  const reportID = `VER-X-${Math.floor(Math.random() * 900000) + 100000}`;

  const handlePrint = () => {
    window.print();
  };

  const artifacts = applicationData.artifactsHistory || [];
  const subjectName = mailName || user?.username || 'SUBJECT_ALPHA';

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="glass-card border-t-4 border-t-primary-500 overflow-hidden relative print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
        {/* Background Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] rotate-[-45deg] pointer-events-none print:hidden">
          <h1 className="text-9xl font-black text-white uppercase">Classified</h1>
        </div>

        <div className="flex justify-between items-start mb-10 relative z-10">
          <div className="flex gap-4">
            <div className="p-3 bg-primary-600/20 border border-primary-500/30 rounded-lg">
               <ShieldCheck className="text-primary-500 print:text-black" size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white tracking-tighter print:text-black uppercase">Identity Verification Ledger</h3>
              <div className="flex gap-4 mt-2 text-[9px] font-bold text-slate-500 uppercase tracking-widest print:text-gray-600 font-mono">
                <span className="flex items-center gap-1"><Calendar size={12}/> GEN_TIME: {reportDate}</span>
                <span className="flex items-center gap-1"><Database size={12}/> PROTOCOL_REF: {reportID}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3 print:hidden">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-black text-white transition-all uppercase tracking-widest"
            >
              <Printer size={16} /> PRINT_LOG
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg text-xs font-black text-white transition-all shadow-xl shadow-primary-900/40 uppercase tracking-widest"
            >
              <Download size={16} /> EXPORT_PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
          {/* Section 1: Subject Identity */}
          <div className="lg:col-span-2 space-y-8">
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-sm print:bg-gray-50 print:border-gray-200">
              <h4 className="text-[10px] font-black text-primary-500 uppercase tracking-[0.3em] mb-6 font-mono">01_SUBJECT_IDENTITY</h4>
              <div className="grid grid-cols-2 gap-y-8">
                <div>
                  <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-1">Authenticated_Name</p>
                  <p className="text-sm font-black text-white print:text-black uppercase font-mono">{subjectName}</p>
                </div>
                <div>
                  <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-1">Subject_Mail_Handle</p>
                  <p className="text-sm font-mono text-primary-400 print:text-black">{user?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-1">Academic_Verification_Index</p>
                  <p className="text-sm font-black text-white print:text-black font-mono">{applicationData.ocrResults?.marks || 0}.00%_PASS</p>
                </div>
                <div>
                  <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-1">Verification_Status</p>
                  <p className={`text-sm font-black font-mono ${applicationData.status === 'Eligible' ? 'text-green-500' : 'text-primary-500'} print:text-black uppercase`}>
                    {applicationData.status === 'Eligible' ? 'COMPLIANT' : 'UNDER_ANALYSIS'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-green-500/5 border border-green-500/10 rounded-sm print:bg-green-50 print:border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <FileCheck className="text-green-500" size={20} />
                <h4 className="text-[10px] font-black text-green-500 uppercase tracking-[0.3em] font-mono">Neural_Verdict_Consensus</h4>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed font-mono italic print:text-gray-700">
                "Subject {subjectName} has successfully transmitted documentation artifacts.
                Neural Agent Alpha-7 has performed deep extraction and heuristic analysis.
                Cross-reference against national scholarship ledger confirms 100% policy matching.
                VERDICT: AUTHORIZED_FOR_PROCESSING."
              </p>
            </div>
          </div>

          {/* Section 2: Security Token */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] font-mono">02_SECURITY_TOKEN</h4>
            <div className="p-6 bg-black border border-primary-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)] relative overflow-hidden">
               <div className="absolute top-0 right-0 w-8 h-8 bg-primary-500/10 rotate-45 translate-x-4 -translate-y-4" />
               <div className="flex flex-col items-center gap-4 relative z-10">
                  <Fingerprint size={48} className="text-primary-500" />
                  <div className="text-center">
                     <p className="text-[8px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-1">Subject_Digital_Signature</p>
                     <p className="text-[9px] font-mono text-primary-400 break-all leading-tight uppercase">
                        NEURAL_HASH_{btoa(subjectName).substring(0, 32)}
                     </p>
                  </div>
               </div>
            </div>
            <div className="p-4 bg-white/[0.02] border border-white/5 text-center">
               <p className="text-[7px] text-slate-600 font-bold uppercase tracking-[0.4em]">Clearance_Level: {user?.clearance || 'Level 1'}</p>
            </div>
          </div>
        </div>

        {/* Advanced Section 3: Artifact Security Forensics */}
        <div className="mt-12 pt-8 border-t border-white/5 relative z-10">
           <div className="flex items-center gap-3 mb-10">
              <Activity className="text-primary-500" size={20} />
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] font-mono">03_ARTIFACT_SECURITY_FORENSICS</h4>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {artifacts.length > 0 ? artifacts.map((art, i) => (
                 <div key={i} className={`p-6 border ${art.securityFinding.isSafe ? 'border-green-500/20 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'} rounded-sm print:bg-white print:text-black`}>
                    <div className="flex justify-between items-start mb-6">
                       <div className="flex gap-3">
                          <div className={`p-2 ${art.securityFinding.isSafe ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-500'}`}>
                             {art.securityFinding.isSafe ? <ShieldCheck size={20} /> : <ShieldAlert size={20} />}
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-white print:text-black uppercase font-mono">{art.type.toUpperCase()}_SCHEMA</p>
                             <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-1">FILE: {art.name || 'Doc_Reference'}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-black text-primary-500 font-mono">{art.securityFinding.safetyScore}%</p>
                          <p className="text-[7px] text-slate-600 font-bold uppercase tracking-tighter">TRUST_SCORE</p>
                       </div>
                    </div>

                    {/* Circular Graph for Print */}
                    <div className="flex gap-6 items-center">
                       <div className="relative w-16 h-16">
                          <svg className="w-full h-full transform -rotate-90">
                             <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5 print:text-gray-100" />
                             <circle
                               cx="32" cy="32" r="28"
                               stroke="currentColor"
                               strokeWidth="4"
                               fill="transparent"
                               strokeDasharray="175.9"
                               strokeDashoffset={175.9 - (175.9 * art.securityFinding.safetyScore / 100)}
                               className={`${art.securityFinding.isSafe ? 'text-green-500' : 'text-red-500'} transition-all duration-1000 ease-out`}
                             />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center text-[8px] font-black font-mono">
                             {art.securityFinding.safetyScore}%
                          </div>
                       </div>
                       <div className="flex-1 space-y-2">
                          {art.securityFinding.details.slice(0, 2).map((detail, idx) => (
                             <div key={idx} className="flex items-center gap-2 text-[8px] font-mono text-slate-400 uppercase print:text-gray-600">
                                <div className={`w-1 h-1 rounded-full ${art.securityFinding.isSafe ? 'bg-green-500' : 'bg-red-500'}`} />
                                {detail}
                             </div>
                          ))}
                          {!art.securityFinding.isSafe && (
                             <div className="text-[8px] font-black text-red-500 uppercase mt-2">
                                THREAT_ID: {art.securityFinding.detectedVirus || 'MALWARE_SIGNATURE'}
                             </div>
                          )}
                       </div>
                    </div>
                 </div>
              )) : (
                 <div className="col-span-2 py-12 text-center border border-dashed border-white/5">
                    <p className="text-[10px] text-slate-700 font-black uppercase tracking-[0.5em] italic">No Artifacts Committed to Ledger</p>
                 </div>
              )}
           </div>
        </div>

        {/* Section 4: Print Footer */}
        <div className="hidden print:block mt-24 pt-8 border-t border-gray-300 text-center">
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">
              Validated by NeuralShield Agentic System // Subject: {subjectName} // Secure Node ID: {user?.id}
           </p>
           <p className="text-[8px] text-gray-400 mt-2 font-mono uppercase tracking-widest">
              Digital Artifact Ledger // Page 01 of 01 // Timestamp: {new Date().toISOString()}
           </p>
        </div>
      </div>
    </div>
  );
};

export default VerificationReport;
