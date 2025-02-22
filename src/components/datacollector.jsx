import { db, auth, database } from "../config/firebase";
import { doc, collection, getDoc, setDoc, getDocs } from "firebase/firestore";
import { ref, get } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";

export const getUserStreak = async (uid, setStreak, setPracDate) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      setStreak(userSnap.data().streak);
      setPracDate(userSnap.data().lastPracticeDate);
    } else {
      const date = new Date().toLocaleDateString("en-CA");
      await setDoc(userRef, {
        lastPracticeDate: date,
        practiceSeconds: 0,
        streak: 0,
      });
      setStreak(0);
    }
  } catch (error) {
    console.error("Error fetching user:", error);
  }
};

export const getUserData = (setEmail, setName, setStreak, setLog, setPracDate) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      setLog(true);
      setEmail(user.email);
      try {
        const snapshot = await get(ref(database, `users/${user.uid}/username`));
        if (snapshot.exists()) {
          setName(snapshot.val());
        } else {
          setName("Guest");
        }
      } catch (error) {
        console.error("Error fetching username:", error);
      }
      getUserStreak(user.uid, setStreak, setPracDate);
    } else {
      setLog(false);
    }
  });
};

export const getAllUsers = async () => {
  const combinedUsers = [];

  try {
    const usersSnapshot = await getDocs(collection(db, "users"));
    const firestoreUsers = {};
    usersSnapshot.forEach((doc) => {
      firestoreUsers[doc.id] = {
        streak: doc.data().streak || 0,
        lastPracticeDate: doc.data().lastPracticeDate || "N/A",
      };
    });

    const rtdbSnapshot = await get(ref(database, "users"));
    if (rtdbSnapshot.exists()) {
      const rtdbUsers = rtdbSnapshot.val();

      Object.keys(rtdbUsers).forEach((uid) => {
        combinedUsers.push({
          uid,
          name: rtdbUsers[uid]?.username || "Unknown",
          email: rtdbUsers[uid]?.email || "No Email",
          streak: firestoreUsers[uid]?.streak || 0,
          lastPracticeDate: firestoreUsers[uid]?.lastPracticeDate || "N/A",
        });
      });
      combinedUsers.sort((a, b) => b.streak - a.streak);
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  }

  return combinedUsers;
};
