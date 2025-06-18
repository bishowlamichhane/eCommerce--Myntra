import { auth } from "./firebase.js"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth"

// Ensure persistence is set to LOCAL
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Firebase persistence error:", error)
})

export const doCreateUserWithEmailAndPassword = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password)
}

export const doSignInWithEmailAndPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password)
}

export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider()
  return signInWithPopup(auth, provider)
}

export const doSignOut = () => {
  return signOut(auth)
}

export const doPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email)
}

export const doPasswordChange = (password) => {
  return updatePassword(auth.currentUser, password)
}

export const doSendEmailVerification = () => {
  return sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/`,
  })
}

