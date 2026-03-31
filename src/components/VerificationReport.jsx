import React from 'react';
import { FileCheck, Download, ShieldCheck, Printer, Calendar, Database, ShieldAlert, FileText, Fingerprint, ImageIcon, CheckCircle2, XCircle, Activity, AlertTriangle, FileSpreadsheet, FileImage } from 'lucide-react';

const VerificationReport = ({ applicationData, user, mailName }) => {
  const reportDate = new Date().toLocaleDateString();
  const reportID = `VER-X-${Math.floor(Math.random() * 900000) + 100000}`;

  const handlePrint = () => {
    window.print();
  };

  const artifacts = applicationData.artifactsHistory || [];
  const subjectName = mailName || user?.username || 'SUBJECT_ALPHA';

  const unsafeArtifacts = artifacts.filter(a => !a.securityFinding.isSafe);
  const safeArtifacts = artifacts.filter(a => a.securityFinding.isSafe);

  const getFileIcon = (ext) => {
    const e = ext?.toLowerCase();
    if (e === 'pdf') return <FileCheck className="text-red-400" size={18} />;
    if (e === 'xlsx' || e === 'xls' || e === 'csv') return <FileSpreadsheet className="text-green-400" size={18} />;
    if (e === 'png' || e === 'jpg' || e === 'jpeg') return <FileImage className="text-blue-400" size={18} />;
    return <FileText className="text-primary-400" size={18} />;
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-700 pb-20 print:p-0 print:space-y-4">
      <div className="glass-card border-t-4 border-t-primary-500 overflow-visible relative print:bg-white print:text-black print:border-none print:shadow-none print:p-0 p-4 sm:p-8">
        {/* Background Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] rotate-[-45deg] pointer-events-none print:hidden">
          <h1 className="text-6xl sm:text-9xl font-black text-white uppercase">Forensic_Ledger</h1>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start mb-8 sm:mb-10 relative z-10 gap-6">
          <div className="flex gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-primary-600/20 border border-primary-500/30 rounded-lg shrink-0 print:border-black print:bg-transparent">
               <ShieldCheck className="text-primary-500 print:text-black w-6 h-6 sm:w-8 sm:h-8" size={32} />
            </div>
            <div>
              <h3 className="text-lg sm:text-2xl font-black text-white print:text-black uppercase leading-tight">Comprehensive Artifact Report</h3>
              <div className="flex flex-wrap gap-2 sm:gap-4 mt-2 text-[7px] sm:text-[9px] font-bold text-slate-500 uppercase tracking-widest print:text-black font-mono">
                <span className="flex items-center gap-1"><Calendar size={10}/> {reportDate}</span>
                <span className="flex items-center gap-1"><Database size={10}/> REF: {reportID}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 sm:gap-3 print:hidden w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[9px] sm:text-xs font-black text-white transition-all uppercase tracking-widest"
            >
              <Printer size={14} className="sm:w-4 sm:h-4" /> PRINT_DATA
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg text-[9px] sm:text-xs font-black text-white transition-all shadow-xl shadow-primary-900/40 uppercase tracking-widest"
            >
              <Download size={14} className="sm:w-4 sm:h-4" /> DOWNLOAD
            </button>
          </div>
        </div>

        {/* PRINT NOTICE FOR HARMFUL DATA */}
        {unsafeArtifacts.length > 0 && (
          <div className="mb-8 p-4 bg-red-950/20 border border-red-500/30 rounded flex items-center gap-4 relative overflow-hidden print:bg-white print:border-black print:text-black">
             <div className="absolute top-0 right-0 p-1 opacity-10 rotate-12 print:hidden"><ShieldAlert size={40} /></div>
             <AlertTriangle className="text-red-500 print:text-black shrink-0" size={24} />
             <div>
                <p className="text-[10px] font-black text-red-500 uppercase tracking-widest print:text-black">Warning: Harmful Data Detected</p>
                <p className="text-[9px] text-red-300 font-medium print:text-black">This report contains forensic details of artifacts flagged as unsafe by the Neural Heuristic Engine. Printing for administrative audit purposes only.</p>
             </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 relative z-10">
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            <div className="p-4 sm:p-6 bg-white/[0.02] border border-white/5 rounded-sm print:bg-white print:border-black print:text-black">
              <h4 className="text-[9px] sm:text-[10px] font-black text-primary-500 uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-4 sm:mb-6 font-mono print:text-black">01_SUBJECT_IDENTITY</h4>
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-y-6 sm:gap-y-8 gap-x-4">
                <div>
                  <p className="text-[7px] sm:text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-1 print:text-black">Authenticated_Name</p>
                  <p className="text-xs sm:text-sm font-black text-white print:text-black uppercase font-mono truncate">{subjectName}</p>
                </div>
                <div>
                  <p className="text-[7px] sm:text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-1 print:text-black">Subject_Mail_Handle</p>
                  <p className="text-xs sm:text-sm font-mono text-primary-400 print:text-black truncate">{user?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[7px] sm:text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-1 print:text-black">Verification_Verdict</p>
                  <p className={`text-xs sm:text-sm font-black font-mono ${applicationData.status === 'Eligible' ? 'text-green-500' : 'text-primary-500'} print:text-black uppercase`}>
                    {applicationData.status === 'Eligible' ? 'COMPLIANT' : 'AUDIT_REQUIRED'}
                  </p>
                </div>
                <div>
                  <p className="text-[7px] sm:text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-1 print:text-black">System_Trust_Index</p>
                  <p className="text-xs sm:text-sm font-black text-white print:text-black font-mono">98.2%_VERIFIED</p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 bg-green-500/5 border border-green-500/10 rounded-sm print:bg-white print:border-black print:text-black">
              <div className="flex items-center gap-3 mb-4">
                <FileCheck className="text-green-500 print:text-black w-4 h-4 sm:w-5 sm:h-5" size={20} />
                <h4 className="text-[9px] sm:text-[10px] font-black text-green-500 uppercase tracking-[0.2em] sm:tracking-[0.3em] font-mono print:text-black">Audit_Consensus</h4>
              </div>
              <p className="text-[9px] sm:text-[10px] text-slate-400 leading-relaxed font-mono italic print:text-black">
                "Subject {subjectName} artifacts history has been preserved in the secure ledger.
                System has analyzed both compliant and harmful digital signatures.
                VERDICT: Forensic documentation completed."
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] sm:tracking-[0.3em] font-mono print:text-black">02_SECURITY_TOKEN</h4>
            <div className="p-6 sm:p-8 bg-black border border-primary-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)] relative overflow-hidden print:bg-white print:border-black print:text-black">
               <div className="absolute top-0 right-0 w-8 h-8 bg-primary-500/10 rotate-45 translate-x-4 -translate-y-4 print:hidden" />
               <div className="flex flex-col items-center gap-4 relative z-10">
                  <Fingerprint size={window.innerWidth < 640 ? 36 : 48} className="text-primary-500 print:text-black" />
                  <div className="text-center w-full">
                     <p className="text-[7px] sm:text-[8px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-1 print:text-black">Forensic_Signature</p>
                     <p className="text-[8px] sm:text-[9px] font-mono text-primary-400 print:text-black break-all leading-tight uppercase">
                        {btoa(subjectName).substring(0, 32)}
                     </p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-white/5 relative z-10 print:border-black">
           <div className="flex items-center gap-3 mb-6 sm:mb-10">
              <Activity className="text-primary-500 print:text-black w-4 h-4 sm:w-5 sm:h-5" size={20} />
              <h4 className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] sm:tracking-[0.3em] font-mono print:text-black">03_ARTIFACT_FORENSICS (ALL_UPLOADED_DATA)</h4>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 print:grid-cols-1">
              {artifacts.length > 0 ? artifacts.map((art, i) => (
                 <div key={i} className={`p-4 sm:p-6 border ${art.securityFinding.isSafe ? 'border-green-500/20 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'} rounded-sm print:bg-white print:border-black print:text-black print:mb-4 page-break-inside-avoid`}>
                    <div className="flex justify-between items-start mb-4 sm:mb-6">
                       <div className="flex gap-2 sm:gap-3">
                          <div className={`p-1.5 sm:p-2 ${art.securityFinding.isSafe ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-500'} print:text-black print:bg-transparent`}>
                             {getFileIcon(art.extension)}
                          </div>
                          <div className="min-w-0">
                             <p className="text-[9px] sm:text-[10px] font-black text-white print:text-black uppercase font-mono truncate">{art.type.toUpperCase()}_SCHEMA</p>
                             <p className="text-[7px] sm:text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-1 truncate print:text-black">REF: {art.name} ({art.extension?.toUpperCase()})</p>
                          </div>
                       </div>
                       <div className="text-right shrink-0">
                          <p className={`text-[9px] sm:text-[10px] font-black font-mono ${art.securityFinding.isSafe ? 'text-primary-500' : 'text-red-500'} print:text-black`}>{art.securityFinding.safetyScore}%</p>
                          <p className="text-[6px] sm:text-[7px] text-slate-600 font-bold uppercase tracking-tighter print:text-black">TRUST</p>
                       </div>
                    </div>

                    <div className="flex gap-4 sm:gap-6 items-center">
                       <div className="relative w-12 h-12 sm:w-16 sm:h-16 shrink-0">
                          <svg className="w-full h-full transform -rotate-90">
                             <circle cx={window.innerWidth < 640 ? "24" : "32"} cy={window.innerWidth < 640 ? "24" : "32"} r={window.innerWidth < 640 ? "20" : "28"} stroke="currentColor" strokeWidth="3" fill="transparent" className="text-white/5 print:text-black/10" />
                             <circle
                               cx={window.innerWidth < 640 ? "24" : "32"} cy={window.innerWidth < 640 ? "24" : "32"} r={window.innerWidth < 640 ? "20" : "28"}
                               stroke="currentColor"
                               strokeWidth="3"
                               fill="transparent"
                               strokeDasharray={window.innerWidth < 640 ? "125.6" : "175.9"}
                               strokeDashoffset={(window.innerWidth < 640 ? "125.6" : "175.9") - ((window.innerWidth < 640 ? "125.6" : "175.9") * art.securityFinding.safetyScore / 100)}
                               className={`${art.securityFinding.isSafe ? 'text-green-500' : 'text-red-500'} transition-all duration-1000 ease-out print:text-black`}
                             />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center text-[7px] sm:text-[8px] font-black font-mono print:text-black">
                             {art.securityFinding.safetyScore}%
                          </div>
                       </div>
                       <div className="flex-1 space-y-1.5 sm:space-y-2 min-w-0">
                          {art.securityFinding.details.slice(0, 3).map((detail, idx) => (
                             <div key={idx} className="flex items-center gap-1.5 sm:gap-2 text-[7px] sm:text-[8px] font-mono text-slate-400 uppercase print:text-black truncate">
                                <div className={`w-1 h-1 rounded-full shrink-0 ${art.securityFinding.isSafe ? 'bg-green-500' : 'bg-red-500'} print:bg-black`} />
                                <span className="truncate">{detail}</span>
                             </div>
                          ))}
                          {!art.securityFinding.isSafe && (
                             <div className="text-[7px] sm:text-[8px] font-black text-red-500 uppercase mt-1 truncate print:text-black">
                                STATUS: flagged_malicious
                             </div>
                          )}
                       </div>
                    </div>
                 </div>
              )) : (
                 <div className="col-span-full py-10 sm:py-12 text-center border border-dashed border-white/5 print:border-black">
                    <p className="text-[9px] sm:text-[10px] text-slate-700 font-black uppercase tracking-[0.3em] sm:tracking-[0.5em] italic print:text-black">Buffer_Empty</p>
                 </div>
              )}
           </div>
        </div>

        <div className="hidden print:block mt-16 sm:mt-24 pt-8 border-t border-black text-center">
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-black">
              Validated by NeuralShield Agentic System // Subject: {subjectName}
           </p>
           <p className="text-[8px] text-black mt-2 font-mono uppercase tracking-widest">
              Digital Artifact Ledger // Timestamp: {new Date().toISOString()}
           </p>
        </div>
      </div>
    </div>
  );
};

export default VerificationReport;
