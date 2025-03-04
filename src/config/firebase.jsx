import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDu-EhwzJ284bjrly_3K5qJNismuVMv8Yk",
  authDomain: "covozo.firebaseapp.com",
  databaseURL: "https://covozo-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "covozo",
  storageBucket: "covozo.firebasestorage.app",
  messagingSenderId: "844677291867",
  appId: "1:844677291867:web:b8cd7f5f6fd894c66c847e",
  measurementId: "G-XJ22633H22"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const db = getFirestore(app);
