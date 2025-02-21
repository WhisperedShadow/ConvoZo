export const speakText = (text) => {
  if (!window.speechSynthesis) {
    console.error("Speech Synthesis not supported in this browser.");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.rate = 1;
  utterance.pitch = 1.5;
  utterance.volume = 1;
  utterance.onstart = () => console.log("Speaking...");
  utterance.onend = () => console.log("Speech finished.");
  utterance.onerror = (event) => console.error("Speech error:", event.error);
  window.speechSynthesis.speak(utterance);
};
