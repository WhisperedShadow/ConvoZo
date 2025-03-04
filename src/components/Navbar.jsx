import { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { getUserData } from "./datacollector";
import { signOut } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const navlinks = [
    { name: "Home", ilink: "home-page.png", link: "/" },
    { name: "Roleplay", ilink: "roleplay.png", link: "/roleplay" },
    { name: "Practice", ilink: "practice.png", link: "/practice" },
    { name: "Leaderboard", ilink: "ranking.png", link: "/leaderboard" },
  ];

  const profilelinks = [
    { name: "Share with Friends", ilink: "email-marketing.png" },
    { name: "Help & Support", ilink: "helpdesk.png" },
    { name: "Ratings", ilink: "star.png" },
  ];

  const [email, setEmail] = useState(null);
  const [name, setName] = useState(null);
  const [streak, setStreak] = useState(0);
  const [log, setLog] = useState(true);
  const [lastDate, setLastDate] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [streakUpdated, setStreakUpdated] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const unsubscribe = getUserData(
      setEmail,
      setName,
      setStreak,
      setLog,
      setLastDate
    );
    return () => unsubscribe();
  }, []);

  const fetchPracticeTime = async () => {
    if (!auth.currentUser) return;

    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const savedTime = userSnap.data().practiceSeconds ?? 30 * 60;
        setLastDate(userSnap.data().lastPracticeDate);
        setTimeLeft(savedTime);
      }
    } catch (error) {
      console.error("Error fetching practice time:", error);
    }
  };

  useEffect(() => {
    fetchPracticeTime();
  }, [location.pathname]); 

  useEffect(() => {
    if (streakUpdated || timeLeft === null) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          updateStreak();
          return 0;
        }
        const newTime = prevTime - 1;
        updateTimeInFirestore(newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, streakUpdated]);

  const updateTimeInFirestore = async (newTime) => {
    if (!auth.currentUser) return;
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        practiceSeconds: newTime,
      });
    } catch (error) {
      console.error("Error updating practice time:", error);
    }
  };

  const updateStreak = async () => {
    if (!auth.currentUser || streakUpdated) return;
    try {
      const today = new Date().toLocaleDateString("en-CA");
      const newStreak = streak > 0 ? streak + 1 : 1;
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        lastPracticeDate: today,
        streak: newStreak,
        practiceSeconds: 0,
      });
      setStreak(newStreak);
      setLastDate(today);
      setStreakUpdated(true);
    } catch (error) {
      console.error("Error updating streak:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  if (["/login", "/signup", "/reset-password"].includes(location.pathname)) {
    return null;
  }
  if (!log) return <Navigate to="/login" />;

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <>
      <div className={styles.header}>
        <div className={styles.streak} onClick={() => setShowPopup(!showPopup)}>
          <h2>{streakUpdated  || lastDate === new Date().toLocaleDateString("en-CA")? `🔥 ${streak}` : `⏳ ${formatTime(timeLeft)}`}</h2>
          <img src="/icons/circle.png" alt="Streak Icon" id="profilepopup" />
        </div>
      </div>
      <nav className={styles.navbar}>
        <img src="/icons/logoo.png" alt="Logo" />
        {navlinks.map(({ name, ilink, link }) => (
          <a key={name} href={link}>
            <img src={`/icons/${ilink}`} alt={name} />
            <p>{name}</p>
          </a>
        ))}
      </nav>
      <div className={`${styles.popup} ${showPopup ? styles.show : ""}`}>
        <div>
          <img src="/icons/circle.png" alt="Profile" />
        </div>
        <p>{name}</p>
        <p>{email}</p>
        <hr />
        {profilelinks.map(({ name, ilink }) => (
          <div key={name}>
            <a href="#">
              <img src={`/icons/${ilink}`} alt={name} />
              {name}
            </a>
            <hr />
          </div>
        ))}
        <div>
          <button onClick={logout}>Log Out</button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
