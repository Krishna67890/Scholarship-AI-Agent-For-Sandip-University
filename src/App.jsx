import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import { getCurrentUser, clearCurrentUser } from './utils/authUtils';
import { speak } from './utils/voiceSynth';

function App() {
  const [user, setUser] = useState(null);
  const [voiceGender, setVoiceGender] = useState('female');
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  useEffect(() => {
    const savedUser = getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    }

    // Global voice settings from localStorage if available
    const savedGender = localStorage.getItem('p_voice_gender');
    if (savedGender) setVoiceGender(savedGender);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    // Welcome message after login
    if (voiceEnabled) {
      setTimeout(() => {
        speak(`welcome to Prix Robotics. In this website you will get to know that your files are safe or not. Your .extensions should be safe as our app responsibility`, voiceGender);
      }, 1000);
    }
  };

  const handleLogout = () => {
    clearCurrentUser();
    setUser(null);
  };

  const handleVoiceChange = (gender) => {
    setVoiceGender(gender);
    localStorage.setItem('p_voice_gender', gender);
    speak(`Voice changed to ${gender} mode.`, gender);
  };

  return (
    <div className="min-h-screen bg-black">
      {!user ? (
        <Auth
          onLogin={handleLogin}
          voiceGender={voiceGender}
          onVoiceChange={handleVoiceChange}
          voiceEnabled={voiceEnabled}
          setVoiceEnabled={setVoiceEnabled}
        />
      ) : (
        <Dashboard
          user={user}
          onLogout={handleLogout}
          globalVoiceGender={voiceGender}
          globalVoiceEnabled={voiceEnabled}
          setGlobalVoiceEnabled={setVoiceEnabled}
        />
      )}
    </div>
  );
}

export default App;
