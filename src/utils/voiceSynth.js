/**
 * Enhanced Voice Synthesis Utility
 * Uses the Web Speech API to provide Male and Female AI voices.
 * Fixed: Added voice loading listener to ensure audibility.
 */

let voices = [];

// Function to load voices asynchronously
const loadVoices = () => {
  voices = window.speechSynthesis.getVoices();
};

if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = loadVoices;
  loadVoices();
}

export const speak = (text, gender = 'female') => {
  if (!window.speechSynthesis) {
    console.error("Speech Synthesis not supported in this browser.");
    return;
  }

  // Cancel any ongoing speech to prevent overlapping and queuing issues
  window.speechSynthesis.cancel();

  // If voices aren't loaded yet, try loading them again
  if (voices.length === 0) {
    loadVoices();
  }

  const utterance = new SpeechSynthesisUtterance(text);

  // Voice selection logic based on browser-specific voice names
  if (gender === 'male') {
    // Priority: David (Windows), Google US English Male, or any voice containing 'male'
    const maleVoice = voices.find(v =>
      v.name.toLowerCase().includes('david') ||
      v.name.toLowerCase().includes('microsoft david') ||
      (v.name.toLowerCase().includes('google') && v.name.toLowerCase().includes('male'))
    );
    utterance.voice = maleVoice || voices[0];
    utterance.pitch = 0.85;
    utterance.rate = 0.95;
  } else {
    // Priority: Zira (Windows), Google UK English Female, or any voice containing 'female'
    const femaleVoice = voices.find(v =>
      v.name.toLowerCase().includes('zira') ||
      v.name.toLowerCase().includes('microsoft zira') ||
      v.name.toLowerCase().includes('female') ||
      v.name.toLowerCase().includes('google uk english female')
    );
    utterance.voice = femaleVoice || voices[1] || voices[0];
    utterance.pitch = 1.05;
    utterance.rate = 1.0;
  }

  // Debug log to console to verify if speech is being triggered
  console.log(`[VOICE_SYNTH] Speaking (${gender}): "${text.substring(0, 30)}..." using voice: ${utterance.voice?.name}`);

  window.speechSynthesis.speak(utterance);
};
