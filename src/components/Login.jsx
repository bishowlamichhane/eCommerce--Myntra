import React, { useState, useRef, useEffect } from "react";
import styles from "./Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import {
  doSignInWithEmailAndPassword,
  doSignOut,
} from "../firebase/auth";
import { useAuth } from "../context/useAuth";
import { db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

const Login = () => {
  const [error, setError] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showCustomerError, setShowCustomerError] = useState(false);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (!isSigningIn) {
      setIsSigningIn(true);
      setError("");
      setShowCustomerError(false);
      try {
        const userCredential = await doSignInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Fetch user data from Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          if (userData.role === "customer") {
            emailRef.current.value = "";
            passwordRef.current.value = "";
            navigate("/");
          } else {
            // Sign out if not a customer
            setShowCustomerError(true);

            await doSignOut();
          }
        } else {
          // If user document doesn't exist, sign out (or handle as an error)
          setShowCustomerError(true);

          await doSignOut();
        }
      } catch (error) {
        console.error("Error during login or role check:", error);
        setShowCustomerError(true);
        setError("");
      } finally {
        setIsSigningIn(false);
      }
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.breadcrumb}>HOME &nbsp;/&nbsp; ACCOUNT</div>
      <div className={styles.loginBox}>
        <h2 className={styles.loginTitle}>LOGIN</h2>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          {error && <p className="error-message">{error}</p>}
          {showCustomerError && <div className="error-message">Customer does not exist</div>}
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              ref={emailRef}
              className={styles.formInput}
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
              ref={passwordRef}
              className={styles.formInput}
              required
            />
          </div>
          <button type="submit" className={styles.submitButton} disabled={isSigningIn}>
            {isSigningIn ? "Signing In..." : "Sign in"}
          </button>
        </form>
        <div className={styles.loginSwitch}>
          Don't have an account?
          <Link to="/signup" className={styles.loginLink}>
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
