import styles from "./Home.module.css";

const Home = () => {
  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <h1>👋 Welcome to Convozo</h1>
        <p>Your ultimate platform for fun, learning, and competitive conversation practice!</p>
      </section>

      <section className={styles.section}>
        <h2>🎭 Roleplay Conversations</h2>
        <p>
          Dive into interactive roleplays. Choose from various scenarios like interviews,
          customer support, travel, and more. Practice real-world conversations in a
          playful, safe space.
        </p>
      </section>

      <section className={styles.section}>
        <h2>🤖 Practice with AI or Humans</h2>
        <p>
          Hone your speaking and response skills by chatting with AI bots or real users
          from around the world. Pick your partner and level up your communication game!
        </p>
      </section>

      <section className={styles.section}>
        <h2>🏆 Leaderboard & Rewards</h2>
        <p>
          Track your progress, earn points, and climb the leaderboard! Compete with friends
          and community members. Get recognized for your communication skills.
        </p>
      </section>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Convozo. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
