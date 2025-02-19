import { db, auth, database } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { ref, get } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";

export const getUserStreak = async (uid, setStreak) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      setStreak(userSnap.data().streak);
    } else {
      console.log("No such user found!");
    }
  } catch (error) {
    console.error("Error fetching user:", error);
  }
};

export const getUserData = (setEmail, setName, setStreak, setLog) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      setEmail(user.email);
      get(ref(database, `users/${user.uid}/username`)).then((snapshot) => {
        if (snapshot.exists()) {
          setName(snapshot.val());
        }
      });
      getUserStreak(user.uid, setStreak);
    } else {
      setLog(false);
    }
  });
};
