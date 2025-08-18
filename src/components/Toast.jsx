import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { toastActions } from "../store/toastSlice";

const Toast = () => {
  const dispatch = useDispatch();
  const { message, isVisible, type } = useSelector((state) => state.toast);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        dispatch(toastActions.hideToast());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, dispatch]);

  const getToastStyles = () => {
    const baseStyles = "px-4 py-3 text-center font-medium border-2 bg-white rounded-md shadow-sm";
    
    switch (type) {
      case "success":
        return `${baseStyles} border-green-500 text-green-700`;
      case "error":
        return `${baseStyles} border-red-500 text-red-700`;
      case "warning":
        return `${baseStyles} border-yellow-500 text-yellow-700`;
      default:
        return `${baseStyles} border-gray-800 text-gray-800`;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 w-96 mx-4"
        >
          <div className={getToastStyles()}>
            <p className="text-sm">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
