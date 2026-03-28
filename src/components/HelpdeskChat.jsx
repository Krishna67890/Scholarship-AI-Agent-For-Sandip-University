import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Minus, X, FileCheck, Volume2, VolumeX } from 'lucide-react';
import { HelpdeskChatAgent } from '../agents/HelpdeskChatAgent';
import { speak } from '../utils/voiceSynth';

const HelpdeskChat = ({ user, applicationData }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hello ${user?.username || 'Subject'}! I'm your dedicated Neural Assistant. How can I help you navigate your scholarship application today?`,
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [gender, setGender] = useState('female');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await HelpdeskChatAgent.respond(input, { user, applicationData });

      const botMsg = {
        id: Date.now() + 1,
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
        actions: response.suggestedActions,
        isAdvanced: true
      };

      setMessages(prev => [...prev, botMsg]);

      if (voiceEnabled) {
        speak(response.text, gender);
      }
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full glass-card p-0 overflow-hidden border-primary-500/20 shadow-2xl bg-slate-950/50 backdrop-blur-xl">
      {/* Advanced Header */}
      <div className="bg-primary-600 p-5 flex items-center justify-between shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none text-[6px] break-all p-1 leading-none font-mono">
           {Array(10).fill("NEURAL_ASSISTANT_ALPHA_7_ACTIVE_SESSION_").join("")}
        </div>
        <div className="flex items-center gap-4 text-white relative z-10">
          <div className="w-10 h-10 rounded-xl bg-black/30 border border-white/20 flex items-center justify-center shadow-inner">
            <Bot size={24} className="text-primary-200" />
          </div>
          <div>
            <h4 className="font-black text-xs uppercase tracking-[0.2em] leading-none">Neural Assistant Alpha-7</h4>
            <div className="flex items-center gap-3 mt-1.5">
               <p className="text-[9px] text-primary-100 flex items-center gap-1.5 font-bold uppercase tracking-widest">
                 <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                 Core: Optimal
               </p>
               <div className="h-2 w-[1px] bg-white/20" />
               <button
                 onClick={() => setVoiceEnabled(!voiceEnabled)}
                 className={`text-[9px] font-black flex items-center gap-1 uppercase transition-all ${voiceEnabled ? 'text-white' : 'text-primary-300 opacity-50'}`}
               >
                 {voiceEnabled ? <Volume2 size={10}/> : <VolumeX size={10}/>}
                 Voice_{voiceEnabled ? 'ON' : 'OFF'}
               </button>
               {voiceEnabled && (
                 <select
                   value={gender}
                   onChange={(e) => setGender(e.target.value)}
                   className="bg-black/20 text-[8px] font-black uppercase text-white outline-none border-none cursor-pointer"
                 >
                   <option value="female">FEMALE</option>
                   <option value="male">MALE</option>
                 </select>
               )}
            </div>
          </div>
        </div>
        <div className="flex gap-2 relative z-10">
          <button className="p-1.5 hover:bg-white/10 rounded text-white/70 transition-colors"><Minus size={16} /></button>
          <button className="p-1.5 hover:bg-white/10 rounded text-white/70 transition-colors"><X size={16} /></button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-black/20">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-4 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-9 h-9 rounded-lg shrink-0 flex items-center justify-center border ${msg.sender === 'user' ? 'bg-primary-950/50 border-primary-500/30 text-primary-400' : 'bg-slate-900 border-white/10 text-slate-400'}`}>
                {msg.sender === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div className="space-y-3">
                <div className={`p-4 rounded-2xl text-xs font-medium leading-relaxed tracking-wide shadow-sm ${msg.sender === 'user' ? 'bg-primary-600 text-white rounded-tr-none border-b-2 border-primary-700' : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'}`}>
                  {msg.text}
                  {msg.isAdvanced && (
                    <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 opacity-40">
                       <FileCheck size={10} />
                       <span className="text-[8px] uppercase tracking-widest font-black">Verified by Neural Logic Core</span>
                    </div>
                  )}
                </div>
                {msg.actions && (
                  <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {msg.actions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => setInput(action)}
                        className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-primary-400 hover:bg-primary-500/10 hover:border-primary-500/40 transition-all uppercase tracking-tighter"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                )}
                <p className="text-[8px] text-slate-600 font-black uppercase tracking-tighter">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} // SESSION_LOG
                </p>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-4 items-center text-slate-500 text-[10px] font-black tracking-widest animate-pulse">
              <div className="w-9 h-9 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center">
                <Bot size={18} />
              </div>
              <span>AGENT_THINKING...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Advanced Input Area */}
      <form onSubmit={handleSend} className="p-6 border-t border-white/5 bg-black/40 backdrop-blur-md">
        <div className="relative flex items-center group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Discuss artifacts, security, or roles..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 pr-14 text-xs text-primary-400 focus:outline-none focus:border-primary-500/50 transition-all placeholder:text-slate-700 font-mono"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 p-2.5 bg-primary-600 hover:bg-primary-500 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary-900/20 active:scale-95"
          >
            {isTyping ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          </button>
        </div>
        <div className="flex justify-between items-center mt-4">
           <p className="text-[8px] text-slate-600 uppercase tracking-[0.3em] font-black">Prix Robotics // Alpha-7 Discussion Session</p>
           <div className="flex gap-2">
              <div className="w-1 h-1 rounded-full bg-primary-500 animate-ping" />
              <div className="w-1 h-1 rounded-full bg-primary-500 animate-ping delay-75" />
              <div className="w-1 h-1 rounded-full bg-primary-500 animate-ping delay-150" />
           </div>
        </div>
      </form>
    </div>
  );
};

export default HelpdeskChat;
