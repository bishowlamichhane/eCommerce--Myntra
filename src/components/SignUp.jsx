import React, { useState } from "react";
import styles from "./SignUp.module.css";
import { Link, useNavigate } from "react-router-dom";
import { doCreateUserWithEmailAndPassword } from "../firebase/auth";
import { addDoc, collection, doc, getFirestore, setDoc } from "firebase/firestore";
import bcrypt from "bcryptjs";

import { app } from "../firebase/firebase";

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const firestore = getFirestore(app);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const userCredentials = await doCreateUserWithEmailAndPassword(
        formData.email,
        formData.password
      );
      const user = userCredentials.user;
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(formData.password, salt);

      await setDoc(doc(firestore, "users", user.uid), {
        name: formData.name,
        role: "customer",
        password: hashedPassword,
        uid: user.uid,
        email: formData.email,
        createdAt: new Date().toISOString(),
      });


      

      navigate("/login");
    } catch (error) {
      console.error("Error Signing up: ", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.breadcrumb}>HOME &nbsp;/&nbsp; SIGNUP</div>
      <div className={styles.authBox}>
        <h2 className={styles.authTitle}>Create Account</h2>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="name">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={styles.formInput}
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={styles.formInput}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className={styles.formInput}
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className={styles.formInput}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <div className={styles.authSwitch}>
          Already have an account?
          <Link to="/login" className={styles.authLink}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
