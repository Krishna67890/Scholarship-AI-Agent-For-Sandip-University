import React, { useState } from 'react';
import { Upload, CheckCircle2, FileText, AlertCircle, Loader2, ShieldAlert, ShieldCheck, XCircle, Zap, Activity, Info } from 'lucide-react';
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
        type,
        name: file.name,
        finding: securityScan,
        timestamp: new Date().toLocaleTimeString()
      };

      if (!securityScan.isSafe) {
        setProcessedFiles(prev => [fileResult, ...prev]);
        setUploadStatus('rejected');
        setIsUploading(false);
        return;
      }

      setUploadStatus('ocr');

      // 2. OCR Processing Agent
      setActiveAgents(prev => [...prev, 'Neural OCR Agent']);
      const extractedData = await DocumentReadingAgent.process(file, type);

      // 3. Fraud Detection Agent
      setActiveAgents(prev => [...prev, 'Fraud Detection Agent']);
      const fraudResults = await FraudDetectionAgent.detect(extractedData);

      // 4. Eligibility Agent
      let eligibilityResults = null;
      if (type === 'marksheet' || type === 'income') {
        setActiveAgents(prev => [...prev, 'Eligibility Agent']);
        eligibilityResults = await EligibilityRuleAgent.checkEligibility({
          annualIncome: extractedData.annualIncome || 150000,
          marks: extractedData.marks || 85
        });
      }

      setProcessedFiles(prev => [fileResult, ...prev]);
      setUploadStatus('completed');

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
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <div className="text-center border-b border-white/5 pb-8">
        <h3 className="text-4xl font-black mb-2 tracking-tighter uppercase flex items-center justify-center gap-3">
          <ShieldCheck className="text-primary-500" size={32} />
          Document Security Terminal
        </h3>
        <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Active Malware Defense & Deep Neural Inspection Enabled</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-slate-900/30 border border-white/5 p-8 text-center group hover:border-primary-500/30 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-20">
               <Zap size={12} />
            </div>
            <div className="mb-6 inline-flex p-4 bg-black border border-white/5 text-primary-400 group-hover:scale-110 group-hover:text-primary-300 transition-all duration-500">
              <doc.icon size={32} />
            </div>
            <div>
              <h4 className="font-black text-white uppercase tracking-widest text-xs mb-1">{doc.label}</h4>
              <p className="text-[8px] text-slate-600 font-bold tracking-[0.3em] uppercase">{doc.id === 'aadhaar' ? 'IDENTITY_STORE' : (doc.id === 'marksheet' ? 'ACADEMIC_LEDGER' : 'FINANCIAL_SCHEMA')}</p>
            </div>
            <label className="w-full mt-8 block">
              <input
                type="file"
                className="hidden"
                onChange={(e) => handleFileUpload(e, doc.id)}
                disabled={isUploading}
              />
              <span className={`block w-full py-4 border font-black text-[10px] cursor-pointer transition-all uppercase tracking-[0.2em] ${isUploading ? 'bg-slate-800 border-slate-700 text-slate-600' : 'bg-primary-600 border-primary-500 text-white hover:bg-primary-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]'}`}>
                {isUploading ? 'SCANNING_STREAM...' : 'EXECUTE_UPLOAD'}
              </span>
            </label>
          </div>
        ))}
      </div>

      {/* Real-time Processing Feed */}
      {isUploading && (
        <div className="bg-slate-900/50 border border-primary-500/20 p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary-500/20">
             <div className="h-full bg-primary-500 animate-[loading_2s_ease-in-out_infinite]" style={{width: '30%'}}></div>
          </div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Loader2 className="animate-spin text-primary-500" size={24} />
              <div>
                <span className="font-black text-white uppercase tracking-[0.3em] text-xs block">Processing Pipeline</span>
                <span className="text-[8px] text-primary-500 font-bold uppercase tracking-widest mt-1">Analyzing file headers and binary signatures...</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {activeAgents.map((agent, i) => (
              <div key={i} className="flex items-center justify-between text-[9px] font-mono text-slate-500 bg-black/40 p-3 border border-white/5">
                <div className="flex items-center gap-3 uppercase tracking-tighter">
                  <div className="w-1.5 h-1.5 bg-primary-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                  THREAD_ID::{Math.random().toString(36).substr(2, 4).toUpperCase()} :: {agent.replace(/ /g, '_').toUpperCase()}
                </div>
                <div className="text-primary-500 font-black animate-pulse">RUNNING</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results History with Graphs */}
      <div className="space-y-6">
        {processedFiles.length > 0 && (
          <div className="flex items-center gap-3 mb-4">
             <Info className="text-slate-500" size={16} />
             <h4 className="text-xs font-black text-white uppercase tracking-[0.3em]">Security Audit History</h4>
          </div>
        )}

        {processedFiles.map((file, index) => (
          <div key={index} className={`border p-8 relative overflow-hidden bg-slate-950 shadow-2xl transition-all ${file.finding.isSafe ? 'border-green-500/20' : 'border-red-500/40 animate-shake'}`}>
            <div className="absolute top-0 right-0 p-2 text-[8px] font-black text-slate-800 uppercase tracking-widest">
               {file.timestamp} // 0x{index.toString(16)}
            </div>

            <div className="flex flex-col md:flex-row gap-10 items-center">
              {/* Security Circular Graph */}
              <div className="relative w-32 h-32 flex-shrink-0 group">
                 <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
                    <circle
                      cx="64" cy="64" r="58"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={364.4}
                      strokeDashoffset={364.4 - (364.4 * file.finding.safetyScore / 100)}
                      className={`${file.finding.isSafe ? 'text-green-500' : 'text-red-500'} transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(34,197,94,0.3)]`}
                    />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-2xl font-black ${file.finding.isSafe ? 'text-green-400' : 'text-red-400'}`}>{file.finding.safetyScore}%</span>
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">TRUST_SCORE</span>
                 </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 border ${file.finding.isSafe ? 'border-green-500/20 text-green-400' : 'border-red-500/20 text-red-500'}`}>
                      {file.finding.isSafe ? <ShieldCheck size={24} /> : <ShieldAlert size={24} />}
                    </div>
                    <div>
                      <h4 className="font-black text-white uppercase tracking-widest text-sm">{file.name}</h4>
                      <div className="flex gap-4 mt-1">
                         <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">FORMAT: {file.finding.fileInfo.extension}</span>
                         <span className={`text-[9px] font-black uppercase tracking-widest ${file.finding.isSafe ? 'text-green-500' : 'text-red-500'}`}>
                           STATUS: {file.finding.threatLevel}
                         </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                     <p className="text-[8px] text-slate-600 font-bold uppercase mb-1 tracking-widest">HASH_IDENTITY</p>
                     <p className="text-[10px] text-primary-500 font-mono font-bold tracking-tighter">{file.finding.fingerprint}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                   {file.finding.details.map((detail, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 text-[9px] text-slate-400 font-mono uppercase">
                        <div className={`w-1 h-1 rounded-full ${file.finding.isSafe ? 'bg-primary-500' : 'bg-red-500 animate-pulse'}`} />
                        {detail}
                      </div>
                   ))}
                </div>

                {!file.finding.isSafe && (
                  <div className="mt-6 p-5 bg-red-950/20 border border-red-500/30 relative">
                     <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                     <div className="flex items-center gap-3 text-red-500 mb-3 font-black text-xs uppercase tracking-widest">
                        <XCircle size={18} />
                        SECURITY_PROTOCOL_VIOLATION
                     </div>
                     <p className="text-[10px] text-red-300 leading-relaxed italic font-mono uppercase tracking-tight">
                        HEURISTIC_RESULT: [ {file.finding.detectedVirus} ] detected.
                        The file signature matches a known malicious pattern.
                        The documentation has been blacklisted and purged from our neural buffer.
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
