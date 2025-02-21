import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      alert("Logging in");
      navigate("/");
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <img src="logoo.png" alt="Logo" width="80" />
      </div>
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
        <Link to="/reset-password" className={styles.link}>
          Forgot Password?
        </Link>
        <button type="submit">LOG IN</button>
      </form>
      <Link to="/signup" className={styles.link}>
        New here? Sign Up
      </Link>
    </div>
  );
};

export default Login;
