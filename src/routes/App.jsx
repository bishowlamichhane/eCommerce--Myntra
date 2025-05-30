import { Outlet } from "react-router-dom";
import FooterComponent from "../components/FooterComponent";
import HeaderComponent from "../components/HeaderComponent";
import FetchItems from "../components/FetchItems";
import { useSelector } from "react-redux";
import LoadingSpinner from "../components/LoadingSpinner";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const App = () => {
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
