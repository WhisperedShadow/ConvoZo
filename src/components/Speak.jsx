const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "en-US";
recognition.continuous = false;
recognition.interimResults = false;
recognition.running = false; 

const API_KEY = "AIzaSyDrL6nc7eRDPTJMWpi911_QSq9JhvkWCKQ";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

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
    if (recognition.running) return; 

    recognition.running = true;
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
      recognition.running = false; 
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

export const evaluateConvo = async (setEvaluate, Convo) => {
  const formattedConvo = Convo.map((con) => `${con.speaker}: ${con.text}`).join("\n");

  await askGemini(
    `Evaluate the following conversation:

${formattedConvo}

Rate the User's responses on a scale of 1 to 10 based on these attributes:

1. Pronunciation Accuracy  
2. Fluency and Naturalness  
3. Grammar and Vocabulary  
4. Relevance to the Topic  

**Rules for Evaluation:**  
- If the conversation has **less than 20 exchanges**, lower the ratings accordingly.  
- **Format the response strictly as:** 'X/X/X/X' with the numbers only(e.g., '8/7/9/6').  
- **Do NOT add** any extra words, explanations, or new lines—just return the ratings in the specified format.  
- Any violation of these instructions should be avoided. 
- **Do not Give** responce like N/A/N/A/N 

Now, provide the evaluation score.
`,
    (data) => {

        setEvaluate(data);
      
    }
  );
};
