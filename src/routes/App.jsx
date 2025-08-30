import { Outlet } from "react-router-dom";
import FooterComponent from "../components/FooterComponent";
import HeaderComponent from "../components/HeaderComponent";
import FetchItems from "../components/FetchItems";
import Toast from "../components/Toast";
import LoadingSpinner from "../components/LoadingSpinner";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import { useSelector } from "react-redux";
const App = () => {
  const { currentUser } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const fetchStatus = useSelector((store) => store.fetchStatus);
  const items = useSelector((store) => store.items);

  useEffect(() => {
    // Set isVisible to true when component mounts
    setIsVisible(true);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <HeaderComponent items={items} />
      <Toast />
      <FetchItems />
      {fetchStatus.currentlyFetching ? <LoadingSpinner /> : <Outlet />}
      <FooterComponent />
    </motion.div>
  );
};

export default App;
