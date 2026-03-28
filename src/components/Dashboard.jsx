import React, { useState, useEffect } from 'react';
import { LayoutDashboard, FileText, CheckCircle, AlertTriangle, MessageSquare, Bell, FileSearch, ShieldAlert, Cpu, LogOut, Terminal, User as UserIcon, ShieldCheck, Fingerprint, Database, Zap, Activity, Mail, X, Volume2, VolumeX } from 'lucide-react';
import DocumentUpload from './DocumentUpload';
import StatusTracker from './StatusTracker';
import EligibilityChecker from './EligibilityChecker';
import FraudDetection from './FraudDetection';
import NotificationCenter from './NotificationCenter';
import HelpdeskChat from './HelpdeskChat';
import VerificationReport from './VerificationReport';
import { speak } from '../utils/voiceSynth';

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAbout, setShowAbout] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [voiceGender, setVoiceGender] = useState('female');
  const [notifications, setNotifications] = useState([
    { id: Date.now(), title: 'SYSTEM_BOOT', message: 'PRIX Robotics Security OS v4.0.5 initialized.', type: 'success', time: 'Just now' }
  ]);
  const [applicationData, setApplicationData] = useState({
    status: 'Not Started',
    documents: [],
    ocrResults: null,
    eligibilityResult: null,
    fraudResult: null,
    artifactsHistory: [] // Array of { type, name, securityFinding, ocrResults, timestamp }
  });

  // Identity logic: Derive Subject Name from Mail ID (as requested)
  const mailName = user?.email?.split('@')[0]?.toUpperCase() || 'SUBJECT_ALPHA';
  const displayEmail = user?.email || 'N/A@SECURE.MAIL';
  const initials = mailName.substring(0, 2);

  const developers = [
    { name: "KRISHNA PATIL RAJPUT", role: "WEB DEVELOPER (CORE)" },
    { name: "YASH BAVISKAR", role: "BACKEND ARCHITECT" },
    { name: "Ritesh Rathod", role: "PPT & DOCUMENTATION" },
    { name: "Pratik Somase", role: "SYSTEM RESEARCH" }
  ];

  // Random Notification Logic & Voice Feedback: Every 1 Minute
  useEffect(() => {
    const randomMsgs = [
      { title: 'MALWARE_SCAN', message: 'Heuristic Engine completed background sweep of document buffer.', type: 'info' },
      { title: 'NEURAL_OPTIMIZATION', message: 'Agent Alpha-7 processing speed increased via cache allocation.', type: 'success' },
      { title: 'IDENTITY_AUDIT', message: 'Cross-referencing active session fingerprints...', type: 'warning' },
      { title: 'PROTOCOL_SHIELD', message: 'Active defense layer operating at 99.9% integrity.', type: 'success' },
      { title: 'ENCRYPTED_ROTATION', message: 'Rotating session keys for subject: ' + mailName, type: 'info' }
    ];

    const interval = setInterval(() => {
      const random = randomMsgs[Math.floor(Math.random() * randomMsgs.length)];
      const newNotif = {
        ...random,
        id: Date.now(),
        time: 'Just now'
      };
      setNotifications(prev => [newNotif, ...prev.slice(0, 4)]);

      if (voiceEnabled) {
        speak(`Attention. System update: ${random.title}. ${random.message}`, voiceGender);
      }
    }, 60000); // 1 minute interval

    return () => clearInterval(interval);
  }, [mailName, voiceEnabled, voiceGender]);

  // Voice feedback for tab changes
  useEffect(() => {
    if (voiceEnabled) {
      speak(`Navigating to ${activeTab} module. Link established.`, voiceGender);
    }
  }, [activeTab, voiceEnabled, voiceGender]);

  const stats = [
    { label: 'Neural Trust Index', value: '98.2%', icon: ShieldCheck, color: 'text-green-400' },
    { label: 'Identity Level', value: user?.clearance || 'Level 1', icon: Fingerprint, color: 'text-primary-400' },
    { label: 'Threats Blocked', value: applicationData.artifactsHistory.filter(a => !a.securityFinding.isSafe).length, icon: ShieldAlert, color: 'text-red-400' },
  ];

  const sidebarLinks = [
    { id: 'overview', label: 'Command Center', icon: LayoutDashboard },
    { id: 'documents', label: 'Secure Pipeline', icon: FileSearch },
    { id: 'reports', label: 'AI Artifacts', icon: Database },
    { id: 'chat', label: 'Helpdesk Agent', icon: MessageSquare },
  ];

  return (
    <div className="flex h-screen bg-black text-slate-50 overflow-hidden font-mono selection:bg-primary-500 selection:text-white print:bg-white print:text-black">
      {/* Visual Glitch/Scan Effect */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-primary-500/30 shadow-[0_0_20px_rgba(59,130,246,0.5)] z-[100] animate-scanline pointer-events-none print:hidden" />

      {/* Developers Popup */}
      {showAbout && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[200] flex items-center justify-center p-6 animate-in zoom-in-95 duration-300 print:hidden">
          <div className="w-full max-w-sm bg-slate-950 border-2 border-primary-500/50 p-8 relative shadow-[0_0_100px_-12px_rgba(59,130,246,0.6)] rounded-lg overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-500 to-transparent" />
            <button
              onClick={() => setShowAbout(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors p-1"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-2 font-mono">PRIX Robotics</h2>
              <div className="h-1 w-20 bg-primary-500 mx-auto rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
              <p className="text-[9px] text-primary-400 mt-4 font-black uppercase tracking-[0.3em]">Neural Engineering Division</p>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 text-center border-b border-white/10 pb-4">Architect_Protocols</p>
              <div className="space-y-2">
                {developers.map((dev, i) => (
                  <div key={i} className="flex flex-col p-4 bg-primary-950/20 border border-primary-500/10 group hover:border-primary-500/50 transition-all hover:bg-primary-900/10">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary-500 rounded-full group-hover:animate-ping shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                        <span className="text-[11px] font-black text-slate-200 uppercase tracking-widest leading-none">{dev.name}</span>
                      </div>
                      <span className="text-[8px] text-primary-600 font-bold uppercase font-mono">NODE_0{i+1}</span>
                    </div>
                    <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest ml-5">{dev.role}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 pt-6 border-t border-white/5 flex flex-col items-center gap-2 text-center">
              <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.4em]">
                Sandip Foundation Hackathon 2026
              </p>
              <p className="text-[7px] text-slate-700 uppercase tracking-[0.2em]">"Advancing Autonomous Verification"</p>
            </div>
          </div>
        </div>
      )}

      {/* Cyber-Sidebar */}
      <aside className="w-72 bg-slate-900/40 border-r border-primary-900/30 p-6 flex flex-col relative overflow-hidden backdrop-blur-md print:hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none text-[6px] p-2 leading-none break-all">
          {Array(20).fill("PRIX_ROBOTICS_CORE_IDENTITY_VERIFIED_SECURE_NODE_0x7F_").join(" ")}
        </div>

        <div
          className="flex items-center gap-3 mb-10 p-3 bg-primary-950/40 border border-primary-500/30 shadow-[0_0_25px_rgba(59,130,246,0.2)] rounded-sm cursor-pointer group hover:border-primary-400 transition-all"
          onClick={() => setShowAbout(true)}
        >
          <div className="w-10 h-10 bg-primary-600 flex items-center justify-center font-black text-xl shadow-[0_0_20px_rgba(59,130,246,0.5)] group-hover:animate-pulse text-white">P</div>
          <div>
            <h1 className="font-black text-sm tracking-widest text-white leading-none uppercase group-hover:text-primary-400 transition-colors">PRIX Robotics</h1>
            <p className="text-[8px] text-primary-500 font-bold uppercase tracking-[0.2em] mt-1 italic">V4.0.5_SECURE_OS</p>
          </div>
        </div>

        <nav className="space-y-1 flex-1 relative z-10">
          {sidebarLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`w-full flex items-center gap-3 px-4 py-4 transition-all relative group ${activeTab === link.id ? 'bg-primary-600/10 border-l-2 border-primary-500 text-white shadow-[inset_10px_0_15px_-10px_rgba(59,130,246,0.3)]' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}
            >
              <link.icon size={16} className={activeTab === link.id ? 'text-primary-400' : ''} />
              <span className="font-bold text-[10px] uppercase tracking-widest leading-none">{link.label}</span>
              {activeTab === link.id && <div className="ml-auto w-1 h-1 bg-primary-400 animate-ping" />}
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
               <button onClick={() => {
                 setVoiceEnabled(!voiceEnabled);
                 speak(voiceEnabled ? "Global audio stream deactivated." : "Global audio system online. Initializing neural voices.", voiceGender);
               }} className={`p-1.5 rounded border transition-all ${voiceEnabled ? 'bg-primary-600 border-primary-400 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-black border-white/10 text-slate-600'}`}>
                 {voiceEnabled ? <Volume2 size={12}/> : <VolumeX size={12}/>}
               </button>
             </div>
             <div className="flex justify-between items-end gap-1">
                {[30, 60, 45, 80, 55, 70, 40, 90, 65, 85].map((h, i) => (
                   <div key={i} className="flex-1 bg-primary-500/40 rounded-t-sm" style={{ height: `${h}%` }} />
                ))}
             </div>
          </div>
          <NotificationCenter notifications={notifications} />
        </div>
      </aside>

      {/* Main Content Terminal */}
      <main className="flex-1 overflow-y-auto bg-black relative print:bg-white print:overflow-visible">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-900/10 blur-[150px] -z-10 rounded-full print:hidden" />

        <header className="flex justify-between items-center p-8 border-b border-white/5 sticky top-0 bg-black/80 backdrop-blur-md z-30 print:hidden">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary-600/10 border border-primary-500/30 cursor-pointer group" onClick={() => setShowAbout(true)}>
              <Terminal size={18} className="text-primary-500 group-hover:animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tighter uppercase flex items-center gap-2 cursor-pointer hover:text-primary-400 transition-colors" onClick={() => setShowAbout(true)}>
                {activeTab}::SYSTEM_ROOT
                <span className="text-[8px] px-1.5 py-0.5 bg-green-950 text-green-500 border border-green-500/30 rounded ml-2 animate-pulse font-bold tracking-widest uppercase">Authorized</span>
              </h2>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5 italic leading-none">Prix Robotics neural agentic network online // subject: {mailName}</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 pr-6 border-r border-white/10 text-right">
              <div>
                <p className="text-[11px] font-black text-white leading-none uppercase tracking-widest mb-1">{mailName}</p>
                <p className="text-[9px] text-primary-500 font-bold uppercase tracking-tighter flex items-center justify-end gap-1.5 opacity-80">
                  <Mail size={10} /> {displayEmail}
                </p>
              </div>
              <div className="w-12 h-12 border border-primary-500/30 bg-primary-950/30 flex items-center justify-center p-0.5 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <div className="w-full h-full bg-primary-600 flex items-center justify-center font-black text-white text-[13px] shadow-[inset_0_0_10px_rgba(0,0,0,0.3)]">
                  {initials}
                </div>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="group flex items-center gap-2 text-slate-600 hover:text-red-500 transition-all active:scale-95"
            >
              <LogOut size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block leading-none mt-0.5">TERMINATE</span>
            </button>
          </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto pb-32 print:p-0">
          {activeTab === 'overview' && (
            <div className="space-y-12 print:hidden">
              <StatusTracker currentStatus={applicationData.status} />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat, idx) => (
                  <div key={idx} className="bg-slate-900/30 border border-white/5 p-8 hover:border-primary-500/50 transition-all relative group cursor-default rounded-sm overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-primary-600/5 rotate-45 translate-x-8 -translate-y-8 group-hover:bg-primary-600/10 transition-colors" />
                    <div className="flex items-center gap-6 relative z-10">
                      <div className={`p-5 bg-black border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)] ${stat.color} group-hover:scale-110 transition-transform duration-500`}>
                        <stat.icon size={32} />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] leading-none">{stat.label}</p>
                        <p className="text-4xl font-black text-white mt-2 tracking-tighter leading-none">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <EligibilityChecker data={applicationData.eligibilityResult} />
                <FraudDetection data={applicationData.fraudResult} />
              </div>

              <div className="border border-white/10 bg-slate-950 p-8 relative overflow-hidden shadow-2xl rounded-sm">
                 <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-50" />
                 <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                       <Activity className="text-primary-500" size={20} />
                       <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white">Neural_Forensics_Intelligence</h3>
                    </div>
                    <span className="text-[8px] font-bold text-green-500 uppercase tracking-widest px-2 py-0.5 border border-green-500/30 rounded-sm animate-pulse">MONITORING_ACTIVE</span>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
                    {[
                      { label: 'File Integrity', status: 'VERIFIED', color: 'text-green-400' },
                      { label: 'Heuristics', status: 'ACTIVE', color: 'text-blue-400' },
                      { label: 'Subject Map', status: 'MATCHED', color: 'text-green-400' },
                      { label: 'Active Shield', status: 'STABLE', color: 'text-primary-400' }
                    ].map((item, i) => (
                       <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-sm">
                          <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-1.5 leading-none">{item.label}</p>
                          <p className={`text-xs font-black uppercase ${item.color} mt-1`}>{item.status}</p>
                       </div>
                    ))}
                 </div>

                 <div className="p-5 bg-black border border-white/5 font-mono text-[10px] text-slate-500 h-40 overflow-hidden relative group">
                    <div className="absolute inset-0 bg-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    <p className="text-primary-500 animate-pulse font-bold">[SEC_INTEL]:: PRIX Robotics deep neural scan protocol v5.0 initialized...</p>
                    <p>[SYS_DETECT]:: Scanning artifacts for APK/IPA/EXE malicious payloads...</p>
                    <p>[IDENTITY]:: Subject link: {mailName} // Auth successful.</p>
                    <p className="text-green-500 font-bold">[STATUS]:: Access authorized for Sandip Foundation Hackathon 2026 terminal.</p>
                    <p>[LOG]:: {new Date().toISOString()} :: Metadata ledger committed.</p>
                    <p className="text-slate-700 mt-2 tracking-widest">0x7F4E :: CACHE_CLEARED :: SESSION_SECURED</p>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="print:hidden">
              <DocumentUpload
                onUploadSuccess={(data) => {
                  const newArtifact = {
                    type: data.documents[0],
                    name: `Doc_${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
                    securityFinding: data.securityFinding,
                    ocrResults: data.ocrResults,
                    timestamp: new Date().toLocaleTimeString()
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

                  if (voiceEnabled) {
                    speak(data.securityFinding.isSafe ? `Artifact accepted. Neural integrity verified for ${data.documents[0]}.` : `Alert. Security violation detected in file ${data.documents[0]}. Artifact quarantined and purged.`, voiceGender);
                  }
                }}
              />
            </div>
          )}

          {activeTab === 'reports' && (
            <VerificationReport
              user={{...user, username: mailName}}
              mailName={mailName}
              applicationData={applicationData}
            />
          )}

          {activeTab === 'chat' && (
            <div className="max-w-4xl mx-auto h-[750px] print:hidden">
               <HelpdeskChat
                 user={{...user, username: mailName}}
                 applicationData={applicationData}
                 globalVoiceEnabled={voiceEnabled}
                 globalVoiceGender={voiceGender}
               />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
