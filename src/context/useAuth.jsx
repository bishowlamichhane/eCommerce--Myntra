import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Fetch additional user data from Firestore
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            // Combine Firebase Auth data with Firestore data
            setCurrentUser({
              uid: user.uid,
              email: user.email,
              emailVerified: user.emailVerified,
              name: userData.name || user.displayName,
              role: userData.role,
              photoURL: user.photoURL,
              createdAt: userData.createdAt,
            });
          } else {
            // If no Firestore document, use just Firebase Auth data
            setCurrentUser({
              uid: user.uid,
              email: user.email,
              emailVerified: user.emailVerified,
              name: user.displayName,
              role: null,
              photoURL: user.photoURL,
            });
          }
        } catch (error) {
          console.error("Error fetching user data from Firestore:", error);
          // Fallback to just Firebase Auth data
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            emailVerified: user.emailVerified,
            name: user.displayName,
            role: null,
            photoURL: user.photoURL,
          });
        }
      } else {
        // User is signed out
        setCurrentUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    loading,
    isAuthenticated: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
