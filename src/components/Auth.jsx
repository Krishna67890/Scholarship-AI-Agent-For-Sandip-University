import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, RefreshCw, Terminal, ArrowRight, ShieldAlert, Fingerprint, CheckCircle2, X, Cpu, Volume2, VolumeX, UserCircle2 } from 'lucide-react';
import { generateRandomGmail, generateRandomPassword, findUserByEmail, findUserByUsername, saveUser, setCurrentUser } from '../utils/authUtils';
import { speak } from '../utils/voiceSynth';

const Auth = ({ onLogin, voiceGender, onVoiceChange, voiceEnabled, setVoiceEnabled }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showAbout, setShowAbout] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Initial welcome voice prompt
  useEffect(() => {
    if (voiceEnabled) {
      const timer = setTimeout(() => {
        speak("welcome to login page please login through your email and password then sign in if you dint sign in 1st register then sign in", voiceGender);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [voiceEnabled, voiceGender]);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleRandomize = () => {
    const randomUser = `agent_${Math.random().toString(36).substr(2, 5)}`;
    setFormData({
      ...formData,
      username: randomUser,
      email: generateRandomGmail(),
      password: generateRandomPassword()
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    setTimeout(() => {
      if (isLogin) {
        const user = findUserByUsername(formData.username) || findUserByEmail(formData.username);
        if (!user) {
          setError('IDENTITY_NOT_FOUND: UNKNOWN_SUBJECT');
          setIsLoading(false);
          return;
        }
        if (user.password !== formData.password) {
          setError('AUTH_FAILURE: INVALID_CREDENTIALS');
          setIsLoading(false);
          return;
        }
        setCurrentUser(user);
        onLogin(user);
      } else {
        if (!validateEmail(formData.email)) {
          setError('MALFORMED_GMAIL_ID: MUST_CONTAIN_@_AND_.COM');
          setIsLoading(false);
          return;
        }
        if (findUserByUsername(formData.username)) {
          setError('CONFLICT: USERNAME_ALREADY_RESERVED');
          setIsLoading(false);
          return;
        }
        if (findUserByEmail(formData.email)) {
          setError('CONFLICT: GMAIL_ID_IN_USE');
          setIsLoading(false);
          return;
        }
        const newUser = {
          ...formData,
          id: 'subject_' + Math.random().toString(36).substr(2, 9),
          clearance: 'Level 1'
        };
        saveUser(newUser);
        setSuccess('IDENTITY_COMMITTED: REDIRECTING_TO_AUTH_GATEWAY');
        setTimeout(() => {
          setIsLogin(true);
          setSuccess('');
          setFormData(prev => ({...prev, username: newUser.username}));
        }, 2000);
      }
      setIsLoading(false);
    }, 1500);
  };

  const developers = [
    { name: "KRISHNA PATIL RAJPUT", role: "WEB DEVELOPER (CORE)" },
    { name: "YASH BAVISKAR", role: "BACKEND ARCHITECT" },
    { name: "Ritesh Rathod", role: "PPT & DOCUMENTATION" },
    { name: "Pratik Somase", role: "SYSTEM RESEARCH" }
  ];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 sm:p-6 font-mono selection:bg-primary-500 selection:text-white relative overflow-hidden">
      {/* Hackathon Matrix Background - Optimized for mobile */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden text-[6px] sm:text-[8px] text-primary-500 flex flex-wrap gap-1 leading-none">
        {Array(1000).fill(0).map((_, i) => (
          <span key={i}>{Math.random() > 0.5 ? '1' : '0'}</span>
        ))}
      </div>

      <div className="w-full max-w-md relative z-10 py-8">
        {/* Header section with voice controls */}
        <div className="flex justify-between items-start mb-6">
          <div className="border-l-4 border-primary-600 pl-4 cursor-pointer group" onClick={() => setShowAbout(true)}>
            <div className="flex items-center gap-2 text-primary-500 mb-1">
              <Cpu size={14} className="group-hover:animate-spin" />
              <span className="text-[9px] font-black tracking-[0.3em] uppercase">Security Gateway</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tighter group-hover:text-primary-400 transition-colors uppercase">PRIX Robotics</h1>
            <p className="text-slate-500 text-[10px] mt-1 uppercase tracking-widest font-bold">Secure_Identity_OS v4.0.5</p>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`p-2 border transition-all ${voiceEnabled ? 'bg-primary-600 border-primary-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-black border-white/10 text-slate-500'}`}
              title={voiceEnabled ? "Mute AI Assistant" : "Unmute AI Assistant"}
            >
              {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            {voiceEnabled && (
              <div className="flex border border-white/10 rounded overflow-hidden">
                <button
                  onClick={() => onVoiceChange('male')}
                  className={`px-2 py-1 text-[8px] font-bold uppercase transition-all ${voiceGender === 'male' ? 'bg-primary-600 text-white' : 'bg-black text-slate-500'}`}
                >
                  MALE
                </button>
                <button
                  onClick={() => onVoiceChange('female')}
                  className={`px-2 py-1 text-[8px] font-bold uppercase transition-all ${voiceGender === 'female' ? 'bg-primary-600 text-white' : 'bg-black text-slate-500'}`}
                >
                  FEMALE
                </button>
              </div>
            )}
          </div>
        </div>

        {/* About Us Popup */}
        {showAbout && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4 sm:p-6 animate-in zoom-in-95 duration-300">
            <div className="w-full max-w-sm bg-slate-950 border-2 border-primary-500/50 p-6 sm:p-8 relative shadow-[0_0_100px_-12px_rgba(59,130,246,0.6)] rounded-lg overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-500 to-transparent" />
              <button
                onClick={() => setShowAbout(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors p-1"
              >
                <X size={24} />
              </button>

              <div className="text-center mb-8 sm:mb-10">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tighter uppercase mb-2">PRIX Robotics</h2>
                <div className="h-1 w-16 sm:w-20 bg-primary-500 mx-auto rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                <p className="text-[8px] sm:text-[9px] text-primary-400 mt-4 font-black uppercase tracking-[0.3em]">Core Intelligence Division</p>
              </div>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 text-center border-b border-white/10 pb-4">Architect_Protocols</p>
                <div className="space-y-2">
                  {developers.map((dev, i) => (
                    <div key={i} className="flex flex-col p-3 sm:p-4 bg-primary-950/20 border border-primary-500/10 group hover:border-primary-500/50 transition-all hover:bg-primary-900/10">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-primary-500 rounded-full group-hover:animate-ping shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                          <span className="text-[10px] sm:text-[11px] font-black text-slate-200 uppercase tracking-widest leading-none">{dev.name}</span>
                        </div>
                        <span className="text-[7px] sm:text-[8px] text-primary-600 font-bold uppercase font-mono">NODE_0{i+1}</span>
                      </div>
                      <p className="text-[7px] sm:text-[8px] text-slate-500 font-bold uppercase tracking-widest ml-5">{dev.role}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 sm:mt-12 pt-6 border-t border-white/5 flex flex-col items-center gap-2 text-center">
                <p className="text-[8px] sm:text-[9px] text-slate-600 font-black uppercase tracking-[0.4em]">
                  Sandip Foundation Hackathon 2026
                </p>
                <p className="text-[7px] text-slate-700 uppercase tracking-[0.2em]">"Advancing Autonomous Verification"</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-6 sm:p-8 shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)]">
          <div className="flex gap-4 mb-6 sm:mb-8">
            <button
              onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
              className={`flex-1 py-2 text-[9px] sm:text-[10px] font-black uppercase tracking-widest border transition-all ${isLogin ? 'bg-primary-600 border-primary-500 text-white' : 'border-white/10 text-slate-500 hover:text-white'}`}
            >
              [ LOGIN ]
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
              className={`flex-1 py-2 text-[9px] sm:text-[10px] font-black uppercase tracking-widest border transition-all ${!isLogin ? 'bg-primary-600 border-primary-500 text-white' : 'border-white/10 text-slate-500 hover:text-white'}`}
            >
              [ REGISTER ]
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-950/50 border border-red-500/50 flex items-center gap-3 text-red-400">
              <ShieldAlert size={18} className="shrink-0" />
              <p className="text-[10px] font-bold uppercase tracking-tighter">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-950/50 border border-green-500/50 flex items-center gap-3 text-green-400">
              <CheckCircle2 size={18} className="shrink-0" />
              <p className="text-[10px] font-bold uppercase tracking-tighter">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest flex justify-between">
                  Full_Name <span className="text-slate-700">::STR</span>
                </label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary-500" size={16} />
                  <input
                    type="text"
                    required
                    placeholder="ENTER_NAME"
                    className="w-full bg-black border border-white/10 py-3 px-10 text-xs text-primary-400 focus:outline-none focus:border-primary-500 transition-all placeholder:text-slate-800"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  {isLogin ? 'IDENTITY_HANDLE' : 'CHOOSE_USERNAME'}
                </label>
                {!isLogin && (
                  <button type="button" onClick={handleRandomize} className="text-[9px] sm:text-[10px] text-primary-500 hover:text-primary-400 underline">
                    GEN_RANDOM
                  </button>
                )}
              </div>
              <div className="relative group">
                <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary-500" size={16} />
                <input
                  type="text"
                  required
                  placeholder={isLogin ? "USERNAME_OR_GMAIL" : "USERNAME"}
                  className="w-full bg-black border border-white/10 py-3 px-10 text-xs text-primary-400 focus:outline-none focus:border-primary-500 transition-all placeholder:text-slate-800"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest">Gmail_Address</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary-500" size={16} />
                  <input
                    type="email"
                    required
                    placeholder="USER@GMAIL.COM"
                    className="w-full bg-black border border-white/10 py-3 px-10 text-xs text-primary-400 focus:outline-none focus:border-primary-500 transition-all placeholder:text-slate-800 font-mono"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest">Access_Cipher</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary-500" size={16} />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-black border border-white/10 py-3 px-10 text-xs text-primary-400 focus:outline-none focus:border-primary-500 transition-all placeholder:text-slate-800 font-mono"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 hover:bg-primary-500 text-white font-black py-4 border-b-4 border-primary-800 flex items-center justify-center gap-3 transition-all transform active:translate-y-1 active:border-b-0 disabled:opacity-50 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
            >
              {isLoading ? (
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-white animate-bounce shadow-[0_0_5px_white]" />
                  <div className="w-1.5 h-1.5 bg-white animate-bounce delay-75 shadow-[0_0_5px_white]" />
                  <div className="w-1.5 h-1.5 bg-white animate-bounce delay-150 shadow-[0_0_5px_white]" />
                </div>
              ) : (
                <>
                  <span className="text-xs uppercase tracking-[0.2em]">{isLogin ? 'EXECUTE_AUTHENTICATION' : 'INIT_IDENTITY'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-2 text-[7px] sm:text-[8px] text-slate-700 uppercase tracking-widest font-black font-mono text-center sm:text-left">
          <span>ENC_TYPE: RSA_4096_GCM</span>
          <span className="text-primary-900 animate-pulse uppercase tracking-[0.2em]">Sandip Foundation Hackathon 2026</span>
          <span>LOCATION: PRIX_NODE_01</span>
        </div>
      </div>
    </div>
  );
};

export default Auth;
