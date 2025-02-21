import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, database } from "../../config/firebase";
import styles from "./Signup.module.css";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      await set(ref(database, "users/" + userCredential.user.uid), {
        username: formData.name,
        email: formData.email,
      });
      alert("Signup successful! You can now log in.");
      navigate("/login");
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <img src="/icons/logoo.png" alt="Logo" width="80" />
      </div>
      <h1>Fresh to us? Let’s Sign Up!</h1>
      <form onSubmit={handleSignup}>
        <input id="name" type="text" placeholder="Full Name" onChange={handleChange} required />
        <input id="email" type="email" placeholder="example@mail.com" onChange={handleChange} required />
        <input id="password" type="password" placeholder="Create Password" onChange={handleChange} required />
        <input id="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} required />
        <button type="submit">SIGN UP</button>
      </form>
      <Link to="/login" className={styles.link}>Already have an account? Log In</Link>
    </div>
  );
};

export default Signup;
