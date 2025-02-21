import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../config/firebase";
import styles from "./ResetPassword.module.css";
import { Link } from "react-router-dom";

const ResetPassword = () => {
  const [email, setEmail] = useState("");

  const handlePasswordReset = async () => {
    if (!email) {
      alert("Please enter your email!");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent! Check your inbox.");
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <img src="logoo.png" alt="Logo" width="80" />
      </div>
      <h1>Forgot Password?</h1>
      <input
        type="email"
        placeholder="Enter your email"
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button onClick={handlePasswordReset}>Reset Password</button>
      <Link to="/login" className={styles.link}>
        Back to Login
      </Link>
    </div>
  );
};

export default ResetPassword;
