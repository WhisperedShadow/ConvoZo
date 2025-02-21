import styles from "./practice.module.css";

const Practice = () => {
  return (
    <section className={styles.practice}>
        <h1>PRACTICE WITH</h1>
      <div><div>
        <img
          src="https://static.vecteezy.com/system/resources/thumbnails/036/105/045/small/artificial-intelligence-ai-processor-chip-icon-symbol-for-graphic-design-logo-web-site-social-media-png.png"
          alt=""
        />
        <a href="/practice/ai">AI</a>
      </div>
      <div>
        <img
          src="https://cdn-icons-png.flaticon.com/512/5962/5962463.png"
          alt=""
        />
        <a href="/practice/chat">Chat</a>
      </div></div>
    </section>
  );
};

export default Practice;
