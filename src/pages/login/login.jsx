import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { ref, set } from "firebase/database";
import "./login.css";
import { auth, database} from '../../config/firebase'



const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await set(ref(database, "users/" + userCredential.user.uid), {
        username: name,
        email,
      });
      alert("Signup successful! You can now log in.");
      setIsLogin(true);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful! Redirecting...");
      window.location.href = "/";
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handlePasswordReset = async () => {
    if (!formData.email) {
      alert("Please enter your email!");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, formData.email);
      alert("Password reset email sent! Check your inbox.");
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="container">
      <div className="logo">
        <img src="logoo.png" alt="Logo" width="80" />
      </div>

      {isForgotPassword ? (
        <div className="forgot-password-container">
          <h1>Forgot Password?</h1>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            onChange={handleChange}
            required
          />
          <button onClick={handlePasswordReset}>Reset Password</button>
          <button onClick={handlePasswordReset}>Resend Email</button>
          <a onClick={() => setIsForgotPassword(false)}>Back to Login</a>
        </div>
      ) : isLogin ? (
        <div>
          <h1>Nice to meet you back, Let’s Login!</h1>
          <form onSubmit={handleLogin}>
            <input
              id="email"
              type="email"
              placeholder="example@mail.com"
              onChange={handleChange}
              required
            />
            <input
              id="password"
              type="password"
              placeholder="Enter Password"
              onChange={handleChange}
              required
            />
            <a onClick={() => setIsForgotPassword(true)}>Forgot Password?</a>
            <button type="submit">LOG IN</button>
          </form>
          <a onClick={() => setIsLogin(false)}>New here? Sign Up</a>
        </div>
      ) : (
        <div>
          <h1>Fresh to us? Let’s Sign Up!</h1>
          <form onSubmit={handleSignup}>
            <input
              id="name"
              type="text"
              placeholder="Full Name"
              onChange={handleChange}
              required
            />
            <input
              id="email"
              type="email"
              placeholder="example@mail.com"
              onChange={handleChange}
              required
            />
            <input
              id="password"
              type="password"
              placeholder="Create Password"
              onChange={handleChange}
              required
            />
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              onChange={handleChange}
              required
            />
            <button type="submit">SIGN UP</button>
          </form>
          <a onClick={() => setIsLogin(true)}>
            Already have an account? Log In
          </a>
        </div>
      )}
    </div>
  );
};

export default Login;
