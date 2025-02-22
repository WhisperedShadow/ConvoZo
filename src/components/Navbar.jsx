import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getUserData } from "./datacollector";
import { signOut } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import styles from "./Navbar.module.css";
import { Navigate } from "react-router-dom";

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
  const [streak, setStreak] = useState(null);
  const [log, setLog] = useState(true);
  const [lastDate, setLastDate] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = getUserData(
      setEmail,
      setName,
      setStreak,
      setLog,
      setLastDate
    );

    const profileIcon = document.querySelector("#profilepopup");
    const popup = document.querySelector("#popup");

    if (!profileIcon || !popup) return;

    const togglePopup = () => {
      popup.classList.toggle(styles.show);
    };

    profileIcon.addEventListener("click", togglePopup);

    return () => {
      if (profileIcon) profileIcon.removeEventListener("click", togglePopup);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const checkAndUpdateStreak = async (uid) => {
      const today = new Date().toLocaleDateString("en-CA");
      if (lastDate === today) return;

      try {
        const userRef = doc(db, "users", uid);
        const newStreak = streak + 1;
        await updateDoc(userRef, {
          lastPracticeDate: today,
          streak: newStreak,
        });
        setStreak(newStreak);
        setLastDate(today);
      } catch (error) {
        console.error("Error updating streak:", error);
      }
    };
    setTimeout(() => {
      if (auth.currentUser) {
        checkAndUpdateStreak(auth.currentUser.uid);
      }
    }, 30000);
  }, [lastDate, streak]);

  const logout = async () => {
    try {
      await signOut(auth);
      console.log("User Logged Out");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  if (
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/reset-password"
  )
    return null;
  if (!log) return <Navigate to="/login" />;
  return (
    <>
      <div className={styles.header}>
        <div className={styles.streak}>
          <h2>🔥{streak}</h2>
          <img src="/icons/circle.png" alt="Streak Icon" id="profilepopup" />
        </div>
      </div>

      <nav className={styles.navbar}>
        <img src="/icons/logoo.png" alt="" />
        {navlinks.map((navlink) => (
          <a key={navlink.name} href={navlink.link}>
            <img src={`/icons/${navlink.ilink}`} alt={navlink.name} />
            <p>{navlink.name}</p>
          </a>
        ))}
      </nav>

      <div id="popup" className={styles.popup}>
        <div>
          <img src="/icons/circle.png" alt="Profile" />
        </div>
        <p>{name}</p>
        <p>{email}</p>
        <hr />
        {profilelinks.map((link) => (
          <div key={link.name}>
            <a href="#">
              <img src={`/icons/${link.ilink}`} alt={link.name} />
              {link.name}
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
