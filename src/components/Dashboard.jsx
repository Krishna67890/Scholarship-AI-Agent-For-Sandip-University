import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, FileText, CheckCircle, AlertTriangle, MessageSquare, Bell, FileSearch, ShieldAlert, Cpu, LogOut, Terminal, User as UserIcon, ShieldCheck, Fingerprint, Database, Zap, Activity, Mail, X, Volume2, VolumeX, Menu, Camera, Save, Eye, Info as InfoIcon, FileCheck, ShieldQuestion, ExternalLink, Globe, Shield, BookOpen, Trash2, FileSpreadsheet, FileImage } from 'lucide-react';
import DocumentUpload from './DocumentUpload';
import StatusTracker from './StatusTracker';
import EligibilityChecker from './EligibilityChecker';
import FraudDetection from './FraudDetection';
import NotificationCenter from './NotificationCenter';
import HelpdeskChat from './HelpdeskChat';
import VerificationReport from './VerificationReport';
import { speak } from '../utils/voiceSynth';

const Dashboard = ({ user, onLogout, globalVoiceEnabled, globalVoiceGender, setGlobalVoiceEnabled }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAbout, setShowAbout] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userLogo, setUserLogo] = useState(null);
  const [tempLogo, setTempLogo] = useState(null);
  const [isViewingDocument, setIsViewingDocument] = useState(null);
  const [showPolicy, setShowPolicy] = useState(false);
  const fileInputRef = useRef(null);

  const [notifications, setNotifications] = useState([
    { id: Date.now(), title: 'SYSTEM_BOOT', message: 'PRIX Robotics Security OS v4.0.5 initialized.', type: 'success', time: 'Just now' },
    { id: Date.now() + 1, title: 'AGENT_READY', message: 'Document Reading Agent (OCR) is standing by.', type: 'info', time: 'Just now' },
    { id: Date.now() + 2, title: 'FRAUD_SHIELD', message: 'Fraud Detection Agent initialized 4.2M records.', type: 'warning', time: 'Just now' },
    { id: Date.now() + 3, title: 'ELIGIBILITY_BOT', message: 'Rule Agent updated with 2026 scholarship criteria.', type: 'success', time: 'Just now' }
  ]);

  const [applicationData, setApplicationData] = useState({
    status: 'Not Started',
    documents: [],
    ocrResults: null,
    eligibilityResult: null,
    fraudResult: null,
    artifactsHistory: []
  });

  const mailName = user?.username?.toUpperCase() || user?.email?.split('@')[0]?.toUpperCase() || 'SUBJECT_ALPHA';
  const displayEmail = user?.email || 'N/A@SECURE.MAIL';
  const initials = mailName.substring(0, 2);

  // Initial Welcome Message & Info
  useEffect(() => {
    if (globalVoiceEnabled) {
      speak(`welcome ${mailName} sir. PRIX Robotics system is now online. This website is a Smart Scholarship and Document Verification System. It helps students apply for scholarships by automatically verifying documents like Aadhaar, marksheets, and income certificates. Here is how it works. First, the application is started. Second, you upload your secure documents. Third, our deep neural OCR scans the artifacts. Fourth, the eligibility agent checks the criteria. And finally, you get the approval report. All of this is powered by our advanced Agentic AI assistants.`, globalVoiceGender);
    }

    const savedLogo = localStorage.getItem(`p_logo_${user?.email}`);
    if (savedLogo) setUserLogo(savedLogo);
  }, []);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveLogo = () => {
    setUserLogo(tempLogo);
    localStorage.setItem(`p_logo_${user?.email}`, tempLogo);
    setTempLogo(null);
    speak("Identity logo updated and saved to secure vault.", globalVoiceGender);
  };

  const developers = [
    { name: "KRISHNA PATIL RAJPUT", role: "WEB DEVELOPER (CORE)" },
    { name: "YASH BAVISKAR", role: "BACKEND ARCHITECT" },
    { name: "Ritesh Rathod", role: "PPT & DOCUMENTATION" },
    { name: "Pratik Somase", role: "SYSTEM RESEARCH" }
  ];

  const handleAboutClick = () => {
    setShowAbout(true);
    if (globalVoiceEnabled) {
      speak("About PRIX Robotics. Our mission is to automate scholarship verification using agentic AI. Our system uses OCR to read your documents, runs fraud detection to keep things safe, and checks your eligibility instantly. It is developed for the Sandip Foundation Hackathon to advance autonomous verification.", globalVoiceGender);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const randomMsgs = [
        { title: 'MALWARE_SCAN', message: 'Heuristic Engine completed background sweep of document buffer.', type: 'info' },
        { title: 'PROTOCOL_SHIELD', message: 'Active defense layer operating at 99.9% integrity.', type: 'success' },
        { title: 'IDENTITY_AUDIT', message: 'Rotating session keys for subject: ' + mailName, type: 'info' },
        { title: 'OCR_UPDATE', message: 'Handwriting recognition patterns updated.', type: 'success' },
        { title: 'ELIGIBILITY_CORE', message: 'Matching criteria: Annual Income < 2.5L per annum.', type: 'info' }
      ];
      const random = randomMsgs[Math.floor(Math.random() * randomMsgs.length)];
      const newNotif = { ...random, id: Date.now(), time: 'Just now' };
      setNotifications(prev => [newNotif, ...prev.slice(0, 8)]);
    }, 45000);
    return () => clearInterval(interval);
  }, [mailName]);

  useEffect(() => {
    if (globalVoiceEnabled) {
      if (activeTab === 'overview') speak("Navigating to Command center and you can see the progress of your document here", globalVoiceGender);
      else if (activeTab === 'documents') speak("Navigating to Secure PIPELINE", globalVoiceGender);
      else if (activeTab === 'reports') speak("Navigating to AI Artifacts for printing the data", globalVoiceGender);
      else if (activeTab === 'chat') speak("Navigating to help desk. You can tell the chat to give data about the documentation which you uploaded just now.", globalVoiceGender);
      else if (activeTab === 'profile') speak("Navigating to Subject Profile and stored documents", globalVoiceGender);
    }
    setIsSidebarOpen(false);
  }, [activeTab]);

  const sidebarLinks = [
    { id: 'overview', label: 'Command Center', icon: LayoutDashboard },
    { id: 'documents', label: 'Secure Pipeline', icon: FileSearch },
    { id: 'reports', label: 'AI Artifacts', icon: Database },
    { id: 'profile', label: 'Subject Profile', icon: UserIcon },
    { id: 'chat', label: 'Helpdesk Agent', icon: MessageSquare },
  ];

  const getFileIcon = (ext) => {
    const e = ext?.toLowerCase();
    if (e === 'pdf') return <FileCheck className="text-red-400" size={24} />;
    if (e === 'xlsx' || e === 'xls' || e === 'csv') return <FileSpreadsheet className="text-green-400" size={24} />;
    if (e === 'png' || e === 'jpg' || e === 'jpeg') return <FileImage className="text-blue-400" size={24} />;
    return <FileText className="text-primary-400" size={24} />;
  };

  const deleteArtifact = (id) => {
    setApplicationData(prev => ({
      ...prev,
      artifactsHistory: prev.artifactsHistory.filter(art => art.id !== id)
    }));
    if (globalVoiceEnabled) {
      speak("Digital artifact purged from secure vault.", globalVoiceGender);
    }
  };

  return (
    <div className="flex h-screen bg-black text-slate-50 font-mono selection:bg-primary-500 selection:text-white print:bg-white print:text-black print:h-auto print:block overflow-hidden print:overflow-visible">
      {/* Visual Glitch Effect */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-primary-500/30 shadow-[0_0_20px_rgba(59,130,246,0.5)] z-[100] animate-scanline pointer-events-none print:hidden" />

      {isSidebarOpen && <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[150] lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`fixed inset-y-0 left-0 w-72 bg-slate-900 z-[160] transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:z-0 border-r border-primary-900/30 p-6 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} print:hidden`}>
        <div className="flex items-center gap-3 mb-10 p-3 bg-primary-950/40 border border-primary-500/30 shadow-[0_0_25px_rgba(59,130,246,0.2)] rounded-sm cursor-pointer group hover:border-primary-400 transition-all" onClick={handleAboutClick}>
          <div className="w-10 h-10 bg-primary-600 flex items-center justify-center font-black text-xl text-white">P</div>
          <div>
            <h1 className="font-black text-sm tracking-widest text-white leading-none uppercase">PRIX Robotics</h1>
            <p className="text-[8px] text-primary-500 font-bold uppercase mt-1 italic">V4.0.5_SECURE_OS</p>
          </div>
        </div>

        <nav className="space-y-1 flex-1 relative z-10">
          {sidebarLinks.map((link) => (
            <button key={link.id} onClick={() => setActiveTab(link.id)} className={`w-full flex items-center gap-3 px-4 py-4 transition-all relative group ${activeTab === link.id ? 'bg-primary-600/10 border-l-2 border-primary-500 text-white shadow-[inset_10px_0_15px_-10px_rgba(59,130,246,0.3)]' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}>
              <link.icon size={16} className={activeTab === link.id ? 'text-primary-400' : ''} />
              <span className="font-bold text-[10px] uppercase tracking-widest leading-none">{link.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5 relative z-10">
          <div className="p-4 bg-primary-950/20 mb-6 border border-primary-900/30 rounded-sm">
             <div className="flex items-center justify-between mb-3">
               <div className="flex items-center gap-2 text-primary-500">
                 <Zap size={12} className="animate-pulse" />
                 <span className="text-[8px] font-black uppercase tracking-widest">Neural_Sync</span>
               </div>
               <button onClick={() => setGlobalVoiceEnabled(!globalVoiceEnabled)} className={`p-1.5 rounded border transition-all ${globalVoiceEnabled ? 'bg-primary-600 border-primary-400 text-white' : 'bg-black border-white/10 text-slate-600'}`}>
                 {globalVoiceEnabled ? <Volume2 size={12}/> : <VolumeX size={12}/>}
               </button>
             </div>
             <div className="flex justify-between items-end gap-1">
                {[30, 60, 45, 80, 55, 70, 40, 90, 65, 85].map((h, i) => <div key={i} className="flex-1 bg-primary-500/40 rounded-t-sm" style={{ height: `${h}%` }} />)}
             </div>
          </div>
          <NotificationCenter notifications={notifications} />
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-black relative print:bg-white flex flex-col print:overflow-visible print:h-auto print:block">
        <header className="flex justify-between items-center p-4 sm:p-8 border-b border-white/5 sticky top-0 bg-black/80 backdrop-blur-md z-30 print:hidden">
          <div className="flex items-center gap-3 sm:gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 border border-white/10 text-slate-400 hover:text-primary-500 lg:hidden"><Menu size={20} /></button>
            <div className="p-2 bg-primary-600/10 border border-primary-500/30 cursor-pointer group hidden sm:block" onClick={handleAboutClick}><Terminal size={18} className="text-primary-500" /></div>
            <div>
              <h2 className="text-sm sm:text-xl font-black text-white tracking-tighter uppercase flex items-center gap-2">
                {activeTab}::SYSTEM_ROOT
                <span className="text-[7px] sm:text-[8px] px-1.5 py-0.5 bg-green-950 text-green-500 border border-green-500/30 rounded ml-1 sm:ml-2 animate-pulse font-bold tracking-widest uppercase">Authorized</span>
              </h2>
              <p className="text-[8px] sm:text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5 italic hidden sm:block">subject: {mailName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
            <div className="flex items-center gap-2 sm:gap-3 sm:pr-6 sm:border-r sm:border-white/10 text-right">
              <div className="hidden xs:block text-right">
                <p className="text-[10px] sm:text-[11px] font-black text-white leading-none uppercase tracking-widest mb-1">{mailName}</p>
                <p className="text-[8px] sm:text-[9px] text-primary-500 font-bold uppercase tracking-tighter flex items-center justify-end gap-1.5 opacity-80">
                  <Mail size={10} /> {displayEmail}
                </p>
              </div>

              <div className="relative group">
                <div className="w-10 h-10 sm:w-14 sm:h-14 border-2 border-primary-500/30 bg-primary-950/30 flex items-center justify-center p-0.5 shadow-[0_0_15px_rgba(59,130,246,0.2)] rounded-sm overflow-hidden cursor-pointer" onClick={() => fileInputRef.current.click()}>
                  {tempLogo || userLogo ? (
                    <img src={tempLogo || userLogo} alt="User Logo" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-primary-600 flex items-center justify-center font-black text-white text-[10px] sm:text-[13px]">{initials}</div>
                  )}
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={16} className="text-white" />
                  </div>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                {tempLogo && (
                  <button onClick={saveLogo} className="absolute -bottom-2 -right-2 p-1.5 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-500 z-20"><Save size={12} /></button>
                )}
              </div>
            </div>

            <button onClick={onLogout} className="group flex items-center gap-2 text-slate-600 hover:text-red-500 transition-all"><LogOut size={18} /><span className="text-[10px] font-black uppercase tracking-widest hidden lg:block leading-none mt-0.5">TERMINATE</span></button>
          </div>
        </header>

        <div className="p-4 sm:p-10 max-w-7xl mx-auto pb-32 print:p-0 flex-1 w-full print:overflow-visible print:h-auto print:block">
          {activeTab === 'overview' && (
            <div className="space-y-8 sm:space-y-12">
              <div className="bg-slate-900/40 border border-white/5 p-6 sm:p-8 rounded-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><InfoIcon size={64} /></div>
                <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter mb-4 flex items-center gap-3"><Zap className="text-primary-500" size={24} />System Operation Framework</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {[
                    { step: '01', label: 'STARTED', info: 'Initialization of session and identity auth.' },
                    { step: '02', label: 'UPLOAD', info: 'Secure document transmission pipeline.' },
                    { step: '03', label: 'OCR_SCAN', info: 'Deep neural data extraction from artifacts.' },
                    { step: '04', label: 'ELIGIBILITY', info: 'Rule agent matching against criteria.' },
                    { step: '05', label: 'FINAL', info: 'Forensic ledger commitment and approval.' }
                  ].map((item, i) => (
                    <div key={i} className="p-4 bg-black/40 border border-white/5 rounded-sm hover:border-primary-500/30 transition-all">
                      <p className="text-primary-500 font-black text-xs mb-1">{item.step}</p>
                      <p className="text-white font-bold text-[10px] uppercase tracking-widest mb-2">{item.label}</p>
                      <p className="text-slate-500 text-[9px] leading-tight">{item.info}</p>
                    </div>
                  ))}
                </div>
              </div>

              <StatusTracker currentStatus={applicationData.status} />

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
                <div className="bg-slate-900/30 border border-white/5 p-6 sm:p-8 hover:border-primary-500/50 transition-all rounded-sm overflow-hidden relative group">
                  <div className="flex items-center gap-4 sm:gap-6 relative z-10">
                    <div className="p-4 sm:p-5 bg-black border border-white/10 text-green-400"><ShieldCheck size={24} /></div>
                    <div>
                      <p className="text-[9px] sm:text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Neural Trust Index</p>
                      <p className="text-2xl sm:text-4xl font-black text-white mt-2 tracking-tighter">98.2%</p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-900/30 border border-white/5 p-6 sm:p-8 hover:border-primary-500/50 transition-all rounded-sm overflow-hidden relative group">
                  <div className="flex items-center gap-4 sm:gap-6 relative z-10">
                    <div className="p-4 sm:p-5 bg-black border border-white/10 text-primary-400"><Fingerprint size={24} /></div>
                    <div>
                      <p className="text-[9px] sm:text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Identity Level</p>
                      <p className="text-2xl sm:text-4xl font-black text-white mt-2 tracking-tighter">{user?.clearance || 'Level 1'}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-900/30 border border-white/5 p-6 sm:p-8 hover:border-primary-500/50 transition-all rounded-sm overflow-hidden relative group">
                  <div className="flex items-center gap-4 sm:gap-6 relative z-10">
                    <div className="p-4 sm:p-5 bg-black border border-white/10 text-red-400"><ShieldAlert size={24} /></div>
                    <div>
                      <p className="text-[9px] sm:text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Threats Flagged</p>
                      <p className="text-2xl sm:text-4xl font-black text-white mt-2 tracking-tighter">{applicationData.artifactsHistory.filter(a => !a.securityFinding.isSafe).length}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
                <div className="flex flex-col gap-4">
                  <EligibilityChecker data={applicationData.eligibilityResult} />
                  {applicationData.eligibilityResult && (
                    <button onClick={() => setShowPolicy(true)} className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600/10 border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase tracking-widest hover:bg-blue-600/20 transition-all">
                      <ExternalLink size={14} /> View Detailed Policy Report
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-4">
                  <FraudDetection data={applicationData.fraudResult} />
                  {applicationData.artifactsHistory.length > 0 && (
                    <button onClick={() => setActiveTab('reports')} className="flex items-center justify-center gap-2 w-full py-3 bg-primary-600/10 border border-primary-500/30 text-primary-400 text-[10px] font-black uppercase tracking-widest hover:bg-primary-600/20 transition-all">
                      <FileCheck size={14} /> View Document Forensics Report
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="print:hidden">
              <DocumentUpload
                onUploadSuccess={(data) => {
                  const newArtifact = {
                    id: 'art_' + Math.random().toString(36).substr(2, 9),
                    type: data.documents[0],
                    name: `Doc_${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
                    securityFinding: data.securityFinding,
                    ocrResults: data.ocrResults,
                    timestamp: new Date().toLocaleTimeString(),
                    extension: data.securityFinding.fileInfo.extension || 'pdf',
                    content: "FORENSIC_SNAPSHOT: Document has been successfully ingested into the PRIX Robotics neural buffer. High-fidelity OCR has mapped the artifact to user identity protocols."
                  };
                  setApplicationData(prev => ({
                    ...prev,
                    documents: Array.from(new Set([...prev.documents, ...data.documents])),
                    ocrResults: data.ocrResults,
                    fraudResult: data.fraudResult,
                    eligibilityResult: data.eligibilityResult,
                    status: data.status,
                    artifactsHistory: [newArtifact, ...prev.artifactsHistory]
                  }));

                  if (globalVoiceEnabled) {
                    if (data.securityFinding.isSafe) {
                        speak(`congratulations your file is safe. Artifact accepted. Neural integrity verified for ${data.documents[0]}.`, globalVoiceGender);
                    } else {
                        speak(`sorry your document is rejected. your file is unsafe. Alert. Security violation detected in file ${data.documents[0]}. Artifact quarantined and preserved.`, globalVoiceGender);
                    }
                  }
                }}
                artifactsHistory={applicationData.artifactsHistory}
                onDeleteArtifact={(id) => deleteArtifact(id)}
              />
            </div>
          )}

          {activeTab === 'reports' && <VerificationReport user={{...user, username: mailName}} mailName={mailName} applicationData={applicationData} />}

          {activeTab === 'profile' && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row gap-10 items-start">
                <div className="w-full md:w-1/3 space-y-6">
                  <div className="glass-card flex flex-col items-center p-10 text-center border-primary-500/20">
                    <div className="w-32 h-32 border-4 border-primary-500 shadow-[0_0_30px_rgba(59,130,246,0.4)] mb-6 overflow-hidden relative group">
                      {userLogo ? <img src={userLogo} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-primary-600 flex items-center justify-center text-4xl font-black text-white">{initials}</div>}
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => fileInputRef.current.click()}><Camera size={24} /></div>
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{mailName}</h3>
                    <p className="text-primary-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-1 italic">{displayEmail}</p>

                    <div className="mt-6 pt-6 border-t border-white/5 w-full flex flex-col gap-3">
                      <button onClick={() => setShowPolicy(true)} className="flex items-center justify-center gap-2 w-full py-2 bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-widest hover:bg-blue-600/20 transition-all"><ShieldQuestion size={12} /> View Policy</button>
                      <button onClick={() => setActiveTab('reports')} className="flex items-center justify-center gap-2 w-full py-2 bg-primary-600/10 border border-primary-500/20 text-primary-400 text-[9px] font-black uppercase tracking-widest hover:bg-primary-600/20 transition-all"><FileCheck size={12} /> View Report</button>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-2/3 space-y-8">
                  <h3 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3"><Database className="text-primary-500" /> Vault Storage</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {applicationData.artifactsHistory.map((art) => (
                      <div key={art.id} className="p-6 border border-white/5 bg-slate-950/50 hover:bg-slate-900 transition-all rounded-sm relative group">
                        <div className="flex justify-between items-start mb-4">
                          <div className="p-2 bg-primary-600/10 rounded">
                            {getFileIcon(art.extension)}
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => setIsViewingDocument(art)} className="p-2 bg-primary-600/10 border border-primary-500/20 text-primary-400 hover:bg-primary-500 hover:text-white transition-all rounded" title="View Document"><Eye size={16} /></button>
                            <button onClick={() => deleteArtifact(art.id)} className="p-2 bg-red-900/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all rounded" title="Delete Artifact"><X size={16} /></button>
                          </div>
                        </div>
                        <h4 className="text-xs font-black text-white uppercase tracking-widest mb-1 truncate">{art.name}</h4>
                        <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-4">TYPE: {art.type.toUpperCase()} ({art.extension?.toUpperCase()})</p>
                        <div className="flex justify-between items-center pt-4 border-t border-white/5">
                          <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${art.securityFinding.isSafe ? 'bg-green-950 text-green-500 border border-green-500/30' : 'bg-red-950 text-red-500 border border-red-500/30'}`}>{art.securityFinding.threatLevel}</span>
                          <span className="text-[8px] text-slate-600 font-mono">{art.timestamp}</span>
                        </div>
                      </div>
                    ))}
                    {applicationData.artifactsHistory.length === 0 && <div className="col-span-full py-20 text-center border border-dashed border-white/10"><p className="text-slate-600 font-black uppercase text-xs italic">Secure Vault is Empty</p></div>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="max-w-4xl mx-auto h-[600px] sm:h-[750px] print:hidden">
               <HelpdeskChat user={{...user, username: mailName}} applicationData={applicationData} globalVoiceEnabled={globalVoiceEnabled} globalVoiceGender={globalVoiceGender} />
            </div>
          )}
        </div>

        {/* DOCUMENT VIEWER MODAL */}
        {isViewingDocument && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[300] flex items-center justify-center p-4 sm:p-10 animate-in zoom-in-95 duration-300">
            <div className="w-full max-w-4xl bg-slate-950 border-2 border-primary-500/50 flex flex-col h-[80vh] relative shadow-[0_0_100px_-12px_rgba(59,130,246,0.6)] rounded-sm overflow-hidden">
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/40">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary-600/20 rounded"><FileSearch className="text-primary-500" size={24} /></div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tighter">{isViewingDocument.name}</h3>
                </div>
                <button onClick={() => setIsViewingDocument(null)} className="p-2 text-slate-500 hover:text-white"><X size={24} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-10 bg-black/20 font-mono space-y-10">
                {/* Visual rendering of file type */}
                <div className="p-8 bg-white/[0.03] border border-white/5 relative min-h-[300px] flex items-center justify-center text-center">
                  <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12"><Fingerprint size={120} /></div>
                  <div className="space-y-4">
                    <div className="inline-flex p-6 bg-primary-600/10 rounded-full border border-primary-500/20 mb-4">
                      {getFileIcon(isViewingDocument.extension)}
                    </div>
                    <p className="text-sm font-black text-white uppercase tracking-[0.2em]">Rendering Artifact: {isViewingDocument.extension?.toUpperCase()}</p>
                    <p className="text-[10px] text-slate-500 max-w-md mx-auto leading-relaxed uppercase">Forensic simulation active. System has reconstructed digital artifact from neural buffer strings.</p>
                    <div className="mt-8 p-6 bg-black/40 border border-white/5 rounded max-w-xl mx-auto">
                      <p className="text-xs text-slate-300 italic">"{isViewingDocument.content}"</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-[9px] font-black text-primary-500 uppercase tracking-widest border-b border-primary-500/20 pb-2">OCR_RESULT</h4>
                    {isViewingDocument.type === 'aadhaar' && <><div className="flex justify-between text-[10px]"><span className="text-slate-500 uppercase font-bold">NAME:</span><span className="text-white uppercase">{applicationData.ocrResults?.name}</span></div><div className="flex justify-between text-[10px]"><span className="text-slate-500 uppercase font-bold">ID_REF:</span><span className="text-white font-mono">{applicationData.ocrResults?.aadhaarNumber}</span></div></>}
                    {isViewingDocument.type === 'marksheet' && <><div className="flex justify-between text-[10px]"><span className="text-slate-500 uppercase font-bold">MARKS:</span><span className="text-white">{applicationData.ocrResults?.marks}%</span></div><div className="flex justify-between text-[10px]"><span className="text-slate-500 uppercase font-bold">INSTITUTE:</span><span className="text-white uppercase">Sandip Foundation</span></div></>}
                    {isViewingDocument.type === 'income' && <><div className="flex justify-between text-[10px]"><span className="text-slate-500 uppercase font-bold">INCOME:</span><span className="text-white">₹{applicationData.ocrResults?.annualIncome}</span></div><div className="flex justify-between text-[10px]"><span className="text-slate-500 uppercase font-bold">BRACKET:</span><span className="text-white uppercase">Authorized</span></div></>}
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[9px] font-black text-red-500 uppercase tracking-widest border-b border-red-500/20 pb-2">SECURITY_REPORT</h4>
                    <div className="flex justify-between text-[10px]"><span className="text-slate-500 uppercase font-bold">SCORE:</span><span className="text-white">{isViewingDocument.securityFinding.safetyScore}%</span></div>
                    <div className="flex justify-between text-[10px]"><span className="text-slate-500 uppercase font-bold">THREAT:</span><span className={isViewingDocument.securityFinding.isSafe ? 'text-green-500' : 'text-red-500'}>{isViewingDocument.securityFinding.threatLevel}</span></div>
                    <div className="flex justify-between text-[10px]"><span className="text-slate-500 uppercase font-bold">EXT:</span><span className="text-white">{isViewingDocument.extension?.toUpperCase()}</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* POLICY MODAL */}
        {showPolicy && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[300] flex items-center justify-center p-4 animate-in zoom-in-95 duration-300">
            <div className="w-full max-w-2xl bg-slate-950 border-2 border-blue-500/50 p-8 rounded-sm relative">
              <button onClick={() => setShowPolicy(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={24} /></button>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-6 flex items-center gap-3"><ShieldQuestion className="text-blue-500" /> Scholarship Policy Ledger 2026</h3>
              <div className="space-y-6 text-slate-300 text-xs leading-relaxed font-mono">
                <div className="p-4 bg-white/5 border-l-2 border-blue-500">
                  <p className="font-bold text-white mb-2">POLICY_01: FINANCIAL_THRESHOLD</p>
                  <p>Subject annual household income must not exceed ₹2,50,000 as per state revenue documentation artifacts.</p>
                </div>
                <div className="p-4 bg-white/5 border-l-2 border-blue-500">
                  <p className="font-bold text-white mb-2">POLICY_02: MERIT_REQUIREMENT</p>
                  <p>A minimum aggregate score of 75.00% in the last qualifying examination is mandatory for consideration.</p>
                </div>
                <div className="p-4 bg-white/5 border-l-2 border-blue-500">
                  <p className="font-bold text-white mb-2">POLICY_03: FORENSIC_INTEGRITY</p>
                  <p>All digital artifacts must pass the Heuristic Malware Scan. Flagged documents require manual administrative override.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABOUT US MODAL UPDATED WITH WEBSITE INFO */}
        {showAbout && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[400] flex items-center justify-center p-4 sm:p-6 animate-in zoom-in-95 duration-300">
            <div className="w-full max-w-2xl bg-slate-950 border-2 border-primary-500/50 p-6 sm:p-8 relative shadow-[0_0_100px_-12px_rgba(59,130,246,0.6)] rounded-lg overflow-hidden flex flex-col max-h-[90vh]">
              <button onClick={() => setShowAbout(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={24} /></button>

              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">PRIX Robotics</h2>
                <div className="h-1 w-20 bg-primary-500 mx-auto rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                <p className="text-[10px] text-primary-400 mt-4 font-black uppercase tracking-[0.3em]">Smart Scholarship & Document Verification System</p>
              </div>

              <div className="overflow-y-auto space-y-8 pr-2 custom-scrollbar">
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <Globe size={16} className="text-primary-500" /> About the System
                  </h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                    The Smart Scholarship & Document Verification System is an Agentic AI solution designed to automate the slow and error-prone manual verification process for student scholarships. Many students face delays or rejection due to manual checks of Aadhaar, income certificates, and marks. PRIX Robotics solves this by using specialized AI agents.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: "Document Reading Agent", info: "Uses advanced OCR to extract data from Aadhaar, marksheets, and income certificates automatically.", icon: FileText },
                    { title: "Eligibility Rule Agent", info: "Instantly matches student data against complex scholarship criteria like marks and income limits.", icon: CheckCircle },
                    { title: "Fraud Detection Agent", info: "Scans for fake or duplicate documents and detects binary malware signatures in artifacts.", icon: ShieldAlert },
                    { title: "Helpdesk Chat Agent", info: "A human-centric AI assistant that answers student queries about their application in real-time.", icon: MessageSquare }
                  ].map((agent, i) => (
                    <div key={i} className="p-4 bg-white/5 border border-white/10 rounded flex gap-3">
                      <agent.icon size={20} className="text-primary-500 shrink-0" />
                      <div>
                        <p className="text-[9px] font-black text-white uppercase mb-1">{agent.title}</p>
                        <p className="text-[8px] text-slate-500 leading-tight">{agent.info}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2 border-t border-white/5 pt-6">
                    <BookOpen size={16} className="text-primary-500" /> Hackathon Information
                  </h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    This project was developed for the Sandip Foundation Hackathon 2026. It leverages cutting-edge web technologies and Agentic AI concepts to demonstrate how autonomous systems can streamline government and educational workflows, ensuring transparency and security in document handling.
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2 border-t border-white/5 pt-6">
                    <UserIcon size={16} className="text-primary-500" /> Architects of Intelligence
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {developers.map((dev, i) => (
                      <div key={i} className="p-3 bg-primary-950/20 border border-primary-500/10 flex justify-between items-center group hover:border-primary-500/50 transition-all">
                        <div>
                          <p className="text-[10px] font-black text-slate-200 uppercase tracking-widest leading-none">{dev.name}</p>
                          <p className="text-[7px] text-slate-500 font-bold uppercase tracking-widest mt-1">{dev.role}</p>
                        </div>
                        <span className="text-[8px] text-primary-600 font-bold uppercase font-mono">NODE_0{i+1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 text-center shrink-0">
                <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.4em]">Sandip Foundation Hackathon 2026</p>
                <p className="text-[7px] text-slate-700 uppercase tracking-[0.2em] mt-1">"Advancing Autonomous Verification"</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
