import React, { useState } from 'react';
import { Upload, CheckCircle2, FileText, AlertCircle, Loader2, ShieldAlert, ShieldCheck, XCircle, Zap, Activity, Info, Trash2 } from 'lucide-react';
import { DocumentReadingAgent } from '../agents/DocumentReadingAgent';
import { EligibilityRuleAgent } from '../agents/EligibilityRuleAgent';
import { FraudDetectionAgent } from '../agents/FraudDetectionAgent';
import { analyzeFileSecurity } from '../utils/fileDetective';

const DocumentUpload = ({ onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, scanning, ocr, completed, rejected
  const [activeAgents, setActiveAgents] = useState([]);
  const [processedFiles, setProcessedFiles] = useState([]); // Array of { type, finding, success }

  const documents = [
    { id: 'aadhaar', label: 'Aadhaar Card', icon: FileText, required: true },
    { id: 'marksheet', label: 'Latest Marksheet', icon: FileText, required: true },
    { id: 'income', label: 'Income Certificate', icon: FileText, required: true },
  ];

  const handleDelete = (index) => {
    setProcessedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus('scanning');

    try {
      // 1. FILE DETECTIVE AGENT: DEEP NEURAL SCAN
      setActiveAgents(prev => [...prev, 'Detective Security Agent']);
      const securityScan = await analyzeFileSecurity(file);

      const fileResult = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        name: file.name,
        finding: securityScan,
        timestamp: new Date().toLocaleTimeString(),
        ocrResults: null,
        fraudResult: null,
        eligibilityResult: null
      };

      setUploadStatus('ocr');

      // 2. OCR Processing Agent
      setActiveAgents(prev => [...prev, 'Neural OCR Agent']);
      const extractedData = await DocumentReadingAgent.process(file, type);
      fileResult.ocrResults = extractedData;

      // 3. Fraud Detection Agent
      setActiveAgents(prev => [...prev, 'Fraud Detection Agent']);
      const fraudResults = await FraudDetectionAgent.detect(extractedData);
      fileResult.fraudResult = fraudResults;

      // 4. Eligibility Agent
      let eligibilityResults = null;
      if (type === 'marksheet' || type === 'income') {
        setActiveAgents(prev => [...prev, 'Eligibility Agent']);
        eligibilityResults = await EligibilityRuleAgent.checkEligibility({
          annualIncome: extractedData.annualIncome || 150000,
          marks: extractedData.marks || 85
        });
        fileResult.eligibilityResult = eligibilityResults;
      }

      setProcessedFiles(prev => [fileResult, ...prev]);
      setUploadStatus(securityScan.isSafe ? 'completed' : 'rejected');

      onUploadSuccess({
        documents: [type],
        ocrResults: extractedData,
        fraudResult: fraudResults,
        eligibilityResult: eligibilityResults,
        securityFinding: securityScan,
        status: eligibilityResults?.isEligible ? 'Eligible' : 'Under Review'
      });

    } catch (error) {
      console.error("Upload failed", error);
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
      setTimeout(() => setActiveAgents([]), 3000);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto pb-20">
      <div className="text-center border-b border-white/5 pb-6 sm:pb-8">
        <h3 className="text-2xl sm:text-4xl font-black mb-2 tracking-tighter uppercase flex items-center justify-center gap-2 sm:gap-3">
          <ShieldCheck className="text-primary-500" size={window.innerWidth < 640 ? 24 : 32} />
          <span className="leading-tight">Security Terminal</span>
        </h3>
        <p className="text-slate-500 font-bold uppercase tracking-[0.1em] sm:tracking-[0.2em] text-[8px] sm:text-[10px]">Active Malware Defense & Deep Neural Inspection</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-slate-900/30 border border-white/5 p-6 sm:p-8 text-center group hover:border-primary-500/30 transition-all relative overflow-hidden rounded-sm">
            <div className="absolute top-0 right-0 p-2 opacity-20">
               <Zap size={12} />
            </div>
            <div className="mb-4 sm:mb-6 inline-flex p-3 sm:p-4 bg-black border border-white/5 text-primary-400 group-hover:scale-110 group-hover:text-primary-300 transition-all duration-500">
              <doc.icon size={window.innerWidth < 640 ? 24 : 32} />
            </div>
            <div>
              <h4 className="font-black text-white uppercase tracking-widest text-[10px] sm:text-xs mb-1">{doc.label}</h4>
              <p className="text-[7px] sm:text-[8px] text-slate-600 font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase">{doc.id === 'aadhaar' ? 'IDENTITY_STORE' : (doc.id === 'marksheet' ? 'ACADEMIC_LEDGER' : 'FINANCIAL_SCHEMA')}</p>
            </div>
            <label className="w-full mt-6 sm:mt-8 block">
              <input
                type="file"
                className="hidden"
                onChange={(e) => handleFileUpload(e, doc.id)}
                disabled={isUploading}
              />
              <span className={`block w-full py-3 sm:py-4 border font-black text-[9px] sm:text-[10px] cursor-pointer transition-all uppercase tracking-[0.2em] ${isUploading ? 'bg-slate-800 border-slate-700 text-slate-600' : 'bg-primary-600 border-primary-500 text-white hover:bg-primary-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]'}`}>
                {isUploading ? 'SCANNING...' : 'UPLOAD'}
              </span>
            </label>
          </div>
        ))}
      </div>

      {/* Real-time Processing Feed */}
      {isUploading && (
        <div className="bg-slate-900/50 border border-primary-500/20 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary-500/20">
             <div className="h-full bg-primary-500 animate-[loading_2s_ease-in-out_infinite]" style={{width: '30%'}}></div>
          </div>
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div className="flex items-center gap-3 sm:gap-4">
              <Loader2 className="animate-spin text-primary-500" size={24} />
              <div>
                <span className="font-black text-white uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[10px] sm:text-xs block">Processing Pipeline</span>
                <span className="text-[7px] sm:text-[8px] text-primary-500 font-bold uppercase tracking-widest mt-1">Analyzing file headers and binary signatures...</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {activeAgents.map((agent, i) => (
              <div key={i} className="flex items-center justify-between text-[8px] sm:text-[9px] font-mono text-slate-500 bg-black/40 p-2 sm:p-3 border border-white/5">
                <div className="flex items-center gap-2 sm:gap-3 uppercase tracking-tighter">
                  <div className="w-1.5 h-1.5 bg-primary-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                  <span className="hidden xs:inline">THREAD_ID::{Math.random().toString(36).substr(2, 4).toUpperCase()} ::</span> {agent.replace(/ /g, '_').toUpperCase()}
                </div>
                <div className="text-primary-500 font-black animate-pulse">RUNNING</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results History */}
      <div className="space-y-4 sm:space-y-6">
        {processedFiles.length > 0 && (
          <div className="flex items-center gap-3 mb-4">
             <Info className="text-slate-500" size={16} />
             <h4 className="text-[10px] sm:text-xs font-black text-white uppercase tracking-[0.3em]">Session Document Buffer</h4>
          </div>
        )}

        {processedFiles.map((file, index) => (
          <div key={file.id} className={`border p-6 sm:p-8 relative overflow-hidden bg-slate-950 shadow-2xl transition-all ${file.finding.isSafe ? 'border-green-500/20' : 'border-red-500/40'}`}>
            <div className="absolute top-0 right-0 p-2 flex items-center gap-4">
               <span className="text-[7px] sm:text-[8px] font-black text-slate-800 uppercase tracking-widest">
                  {file.timestamp} // 0x{index.toString(16)}
               </span>
               <button
                 onClick={() => handleDelete(index)}
                 className="p-1.5 bg-red-950/30 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded border border-red-500/20"
                 title="Delete Artifact"
               >
                 <Trash2 size={12} />
               </button>
            </div>

            <div className="flex flex-col md:flex-row gap-6 sm:gap-10 items-center">
              {/* Security Circular Graph */}
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 group">
                 <svg className="w-full h-full transform -rotate-90">
                    <circle cx={window.innerWidth < 640 ? "48" : "64"} cy={window.innerWidth < 640 ? "48" : "64"} r={window.innerWidth < 640 ? "42" : "58"} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
                    <circle
                      cx={window.innerWidth < 640 ? "48" : "64"} cy={window.innerWidth < 640 ? "48" : "64"} r={window.innerWidth < 640 ? "42" : "58"}
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={window.innerWidth < 640 ? 263.8 : 364.4}
                      strokeDashoffset={(window.innerWidth < 640 ? 263.8 : 364.4) - ((window.innerWidth < 640 ? 263.8 : 364.4) * file.finding.safetyScore / 100)}
                      className={`${file.finding.isSafe ? 'text-green-500' : 'text-red-500'} transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(34,197,94,0.3)]`}
                    />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-xl sm:text-2xl font-black ${file.finding.isSafe ? 'text-green-400' : 'text-red-400'}`}>{file.finding.safetyScore}%</span>
                    <span className="text-[7px] sm:text-[8px] font-black text-slate-500 uppercase tracking-tighter">TRUST_SCORE</span>
                 </div>
              </div>

              <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`p-2 sm:p-3 border ${file.finding.isSafe ? 'border-green-500/20 text-green-400' : 'border-red-500/20 text-red-500'}`}>
                      {file.finding.isSafe ? <ShieldCheck size={20} className="sm:w-6 sm:h-6" /> : <ShieldAlert size={20} className="sm:w-6 sm:h-6" />}
                    </div>
                    <div>
                      <h4 className="font-black text-white uppercase tracking-widest text-xs sm:text-sm truncate max-w-[200px]">{file.name}</h4>
                      <div className="flex flex-wrap gap-2 sm:gap-4 mt-1">
                         <span className="text-[7px] sm:text-[9px] font-bold text-slate-500 uppercase tracking-widest">FORMAT: {file.finding.fileInfo.extension}</span>
                         <span className={`text-[7px] sm:text-[9px] font-black uppercase tracking-widest ${file.finding.isSafe ? 'text-green-500' : 'text-red-500'}`}>
                           STATUS: {file.finding.threatLevel}
                         </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                     <p className="text-[7px] sm:text-[8px] text-slate-600 font-bold uppercase mb-0.5 tracking-widest">HASH_IDENTITY</p>
                     <p className="text-[8px] sm:text-[10px] text-primary-500 font-mono font-bold tracking-tighter truncate max-w-[250px]">{file.finding.fingerprint}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3">
                   {file.finding.details.map((detail, i) => (
                      <div key={i} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white/[0.02] border border-white/5 text-[8px] sm:text-[9px] text-slate-400 font-mono uppercase">
                        <div className={`w-1 h-1 rounded-full shrink-0 ${file.finding.isSafe ? 'bg-primary-500' : 'bg-red-500 animate-pulse'}`} />
                        <span className="truncate">{detail}</span>
                      </div>
                   ))}
                </div>

                {!file.finding.isSafe && (
                  <div className="mt-4 sm:mt-6 p-4 sm:p-5 bg-red-950/20 border border-red-500/30 relative">
                     <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                     <div className="flex items-center gap-2 sm:gap-3 text-red-500 mb-2 sm:mb-3 font-black text-[10px] sm:text-xs uppercase tracking-widest">
                        <XCircle size={14} className="sm:w-[18px] sm:h-[18px]" />
                        SECURITY_ALERT: PERSISTED_IN_LEDGER
                     </div>
                     <p className="text-[8px] sm:text-[10px] text-red-300 leading-relaxed italic font-mono uppercase tracking-tight">
                        HEURISTIC_RESULT: [ {file.finding.detectedVirus} ] detected.
                        As requested, harmful artifacts are NOT purged.
                        User maintains manual control over deletion.
                     </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentUpload;
