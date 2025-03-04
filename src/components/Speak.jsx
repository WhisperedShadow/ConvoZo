const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "en-US";
recognition.continuous = false;
recognition.interimResults = false;

const API_KEY = "AIzaSyD6BHGLVrojHn4gY2SaMNQvlEgrciPoKKM";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

export const speakText = (text) => {
  if (!window.speechSynthesis) {
    console.error("Speech Synthesis not supported in this browser.");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1.2;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);
};

export const startListening = (setListening) => {
  return new Promise((resolve) => {
    recognition.start();
    setListening(true);

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript;
      console.log("Recognized Speech:", result);
      setListening(false);
      resolve(result);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
      resolve("");
    };

    recognition.onend = () => {
      setListening(false);
    };
  });
};

export const askGemini = async (text, setResponse) => {
  try {
    const requestBody = {
      contents: [{ role: "user", parts: [{ text }] }],
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    console.log("API Response:", data);

    if (data?.candidates && data.candidates.length > 0) {
      const aiText =
        data.candidates[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't generate a response.";
      setResponse(aiText);
    } else {
      setResponse("Sorry! I can't understand.");
    }
  } catch (error) {
    console.error("API Error:", error);
    setResponse("Sorry! I can't understand.");
  }
};
