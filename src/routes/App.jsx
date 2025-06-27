import { Outlet, useNavigate } from "react-router-dom";
import FooterComponent from "../components/FooterComponent";
import HeaderComponent from "../components/HeaderComponent";
import FetchItems from "../components/FetchItems";

import LoadingSpinner from "../components/LoadingSpinner";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import { Firestore, getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../firebase/firebase";
import { useDispatch, useSelector } from "react-redux";
import { userAction } from "../store/userSlice";
const App = () => {
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const { currentUser, loading: authLoading } = useAuth();
  const dispatch = useDispatch();

  const [isVisible, setIsVisible] = useState(false);
  const fetchStatus = useSelector((store) => store.fetchStatus);
  const items = useSelector((store) => store.items);

  useEffect(() => {
    // Set isVisible to true when component mounts
    setIsVisible(true);
  }, []);

  const fetchUserData = async (userId) => {
    try {
      console.log("Fetching user from firestore", userId);
      const userDocRef = doc(firestore, "users", userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        console.log("User data found: ", userDoc.data());
        const userData = userDoc.data();
        setUserData(userDoc.data());
        dispatch(userAction.addUser(userDoc.data()))
        return userData;
      }
      return null;
    } catch (error) {
      console.log("Error fetching data", error);
      return null;
    }
  };

  useEffect(() => {
    if (currentUser) {
      console.log("User from AuthContext", currentUser.uid);
      if (!userData || userData.uid !== currentUser.uid) {
        fetchUserData(currentUser.uid);
      }
    } else {
      setUserData([]);
    }
  }, [currentUser]);

  const handleSignOut = async () => {
    try {
      console.log("Logging out...");
      await signOut(auth);
      localStorage.removeItem("firebase_token");
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 1.0 }}
    >
      <HeaderComponent items={items} />
      <FetchItems />
      {fetchStatus.currentlyFetching ? <LoadingSpinner /> : <Outlet />}
      <FooterComponent />
    </motion.div>
  );
};

export default App;
