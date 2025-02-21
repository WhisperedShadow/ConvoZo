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
      `Consider you are an English Learning Partner. Your name is ConvoZo. The conversation so far is: ${JSON.stringify(
        newConvo
      )}. Reply to the last user response.`,
      setResponse
    );
  };

  useEffect(() => {
    if (response.trim()) {
      setConvo((prevConvo) => [...prevConvo, { speaker: "AI", text: response }]);
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
        <button onClick={listen} id="mic">Speak</button>
        <button
          onClick={() => setConvo([{ speaker: "AI", text: "Hi! I am your AI Partner" }])}
        >
          Reset
        </button>
      </div>
    </section>
  );
};

export default AI;
