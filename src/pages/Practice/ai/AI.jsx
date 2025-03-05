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
    if (convo.length === 0) return;

    const lastMessage = convo[convo.length - 1];
    if (lastMessage.speaker === "AI") {
      speakText(lastMessage.text);
      console.log(lastMessage.text);
    }
  }, [convo]);

  useEffect(() => {
    const micButton = document.getElementById("mic");
    if (micButton) {
      micButton.style.backgroundColor = listening ? "red" : "green";
    }
  }, [listening]);

  const listen = async () => {
    const userText = await startListening(setListening);
    if (!userText.trim()) return;

    setConvo((prevConvo) => {
      const newConvo = [...prevConvo, { speaker: "User", text: userText }];

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

      return newConvo;
    });
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
