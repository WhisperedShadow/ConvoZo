import { useEffect, useState } from "react";
import {
  speakText,
  startListening,
  askGemini,
  evaluateConvo,
} from "../../../components/Speak";
import styles from "./AI.module.css";

const AI = () => {
  const [listening, setListening] = useState(false);
  const [evaluated, setEvaluated] = useState(null);
  const [response, setResponse] = useState("");
  const [result, setResult] = useState(null);
  const attr = [
    "Pronunciation Accuracy",
    "Fluency and Naturalness",
    "Grammar and Vocabulary",
    "Relevance to the topic",
  ];
  const [convo, setConvo] = useState([
    { speaker: "AI", text: "Hi! I am your AI Partner" },
  ]);

  useEffect(() => {
    if (convo.length === 0) return;
    const lastMessage = convo[convo.length - 1];
    if (lastMessage.speaker === "AI") {
      speakText(lastMessage.text);
    }
  }, [convo]);

  useEffect(() => {
    const micButton = document.getElementById("mic");
    if (micButton) {
      micButton.style.backgroundColor = listening ? "red" : "green";
    }
  }, [listening]);

  const listen = async () => {
    if (listening) return;

    const userText = await startListening(setListening);
    if (!userText.trim()) return;

    const newConvo = [...convo, { speaker: "User", text: userText }];
    setConvo(newConvo);

    const formattedConvo = newConvo
      .map((con) => `${con.speaker}: ${con.text}`)
      .join("\n");

    askGemini(
      `You are ConvoZo, an AI English learning and communication skill development partner. Your goal is to help users improve their spoken English through natural conversations.
      
      The conversation so far is:
      ${formattedConvo}
      
      Reply naturally to the last user response.
      
      Guidelines:
      - Engage in fluent and natural conversations, encouraging users to express themselves clearly.
      - Correct mistakes subtly by rephrasing responses rather than direct corrections.
      - Keep responses relevant to everyday communication and English learning.
      - Do not generate responses unrelated to English learning or ConvoZo’s features.
      - Maintain a friendly and encouraging tone.`,
      setResponse
    );
  };

  useEffect(() => {
    if (response.trim()) {
      setConvo((prevConvo) => [
        ...prevConvo,
        { speaker: "AI", text: response },
      ]);
      setResponse("");
    }
  }, [response]);

  const evaluate = async () => {
    await evaluateConvo(setResult, convo);
    document.getElementById('mic').disabled=true
  };

  useEffect(() => {
    if (!result) return;

    console.log("Evaluation API Response:", result);

    const scores = result.split("/").map((item) => item.trim());
    if (scores.length !== attr.length) {
      console.error("Invalid evaluation response", result);
      return;
    }
    console.log(result);

    setEvaluated(
      <div className={styles.evaluation}>
        {scores.map((item, index) => (
         <>
          <label key={index}>
            <p>{attr[index]}</p>
            <input type="range" disabled value={parseInt(item) || 0} min="0" max="10" />
            <p>{parseInt(item)}</p>
          </label>
          
          </>
        ))}
      </div>
    );
  }, [result]);

  const reset = () =>{
    setConvo([{ speaker: "AI", text: "Hi! I am your AI Partner" }])
    document.getElementById('mic').disabled=false
    setEvaluated(null)
  }

  return (
    <section className={styles.container}>
      <h1>AI Chat</h1>
      <p>Click the button to start speaking</p>

      <div className={styles.chatBox}>
        {convo.map((msg, index) => (
          <div
            key={index}
            className={
              msg.speaker === "AI" ? styles.aiMessage : styles.userMessage
            }
          >
            <strong>{msg.speaker}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <div className={styles.controls}>
        <button onClick={listen} id="mic">🎤 Speak</button>
        <button onClick={reset}>🔄 Reset</button>
        <button onClick={evaluate}>📊 Evaluate</button>
      </div>
      
      {evaluated}
    </section>
  );
};

export default AI;
