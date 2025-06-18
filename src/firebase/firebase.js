// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider } from "firebase/auth/web-extension";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, doc, setDoc, deleteDoc, getDoc, getDocs, query, where } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

const analytics = getAnalytics(app);

// Add item to user's bag
export const addToUserBag = async (userId, productData) => {
  try {
    const bagRef = collection(db, "users", userId, "bag");
    const docRef = await addDoc(bagRef, {
      ...productData,
      addedAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding item to bag:", error);
    throw error;
  }
};

// Remove item from user's bag
export const removeFromUserBag = async (userId, productId) => {
  try {
    const bagRef = collection(db, "users", userId, "bag");
    const q = query(bagRef, where("productId", "==", productId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docToDelete = querySnapshot.docs[0];
      await deleteDoc(docToDelete.ref);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error removing item from bag:", error);
    throw error;
  }
};

// Get user's bag items
export const getUserBag = async (userId) => {
  try {
    const bagRef = collection(db, "users", userId, "bag");
    const querySnapshot = await getDocs(bagRef);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting user bag:", error);
    throw error;
  }
};

export const addProduct = async (productData) => {
  try {
    const docRef = await addDoc(collection(db, "users", 'tkSYv5nSKyQVspQRejzbDTxHAG72', "company", 'FOe0IF59zF20NOOVECBH', "products"), productData);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};



