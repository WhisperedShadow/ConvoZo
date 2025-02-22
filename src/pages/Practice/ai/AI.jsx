import { useEffect, useState } from "react";
import {
  speakText,
  startListening,
  askGemini,
} from "../../../components/Speak";
import styles from "./AI.module.css";

const AI = () => {
  const [listening, setListening] = useState(false);
  const [convo, setConvo] = useState([
    { speaker: "AI", text: "Hi! I am your AI Partner" },
  ]);
  const [response, setResponse] = useState("");

  useEffect(() => {
    const lastMessage = convo[convo.length - 1];
    if (lastMessage.speaker === "AI") {
      speakText(lastMessage.text);
      console.log(lastMessage.text);
    }
  }, [convo]);

  useEffect(() => {
    document.getElementById("mic").style.backgroundColor = listening
      ? "red"
      : "green";
  }, [listening]);

  const listen = async () => {
    const userText = await startListening(setListening);
    if (!userText.trim()) return;

    const newConvo = [...convo, { speaker: "User", text: userText }];
    setConvo(newConvo);

    askGemini(
      `You are ConvoZo, an AI English learning and communication skill development partner. Your goal is to help users improve their spoken English through natural conversations.

The conversation so far is: ${JSON.stringify(
        newConvo
      )}. Reply naturally to the last user response.

Guidelines:
Engage in fluent and natural conversations, encouraging users to express themselves clearly.
Correct mistakes subtly by rephrasing responses rather than direct corrections.
Keep responses relevant to everyday communication and English learning.
Do not generate responses unrelated to English learning or ConvoZo’s features.
Do not use bold text, italics, or any formatting.
Maintain a friendly and encouraging tone.
ConvoZo Features:
Roleplay Scenarios – Users can practice conversations in different real-life situations.
AI Conversation Practice – The main feature where users talk with AI to improve fluency and confidence.
Video Chat with Others – Users can connect with people to practice speaking.
Daily Streaks & Leaderboard – Encourage consistent learning with streaks and rankings.
Always focus on improving users' communication skills while keeping the conversation engaging and interactive.`,
      setResponse
    );
  };

  useEffect(() => {
    if (response.trim()) {
      setConvo((prevConvo) => [
        ...prevConvo,
        { speaker: "AI", text: response },
      ]);
    }
  }, [response]);

  return (
    <section className={styles.container}>
      <h1>AI Chat</h1>
      <p>Click the button to start speaking</p>

      <div className={styles.conversation}>
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
        <button onClick={listen} id="mic">
          Speak
        </button>
        <button
          onClick={() =>
            setConvo([{ speaker: "AI", text: "Hi! I am your AI Partner" }])
          }
        >
          Reset
        </button>
      </div>
    </section>
  );
};

export default AI;
