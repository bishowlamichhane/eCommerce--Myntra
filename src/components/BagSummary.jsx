import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { useToast } from "../hooks/useToast";
import { useSearchParams } from "react-router-dom";

const BagSummary = ({ bagItems = [], onOrderPlaced }) => {
  const CONVENIENCE_FEES = 99;
  const { currentUser } = useAuth();


  const [transactionId, setTransactionId] = useState("test-"+Date.now());
  const [paymentStatus, setPaymentStatus] = useState(null);


  const handleProceedToCheckout = () => {
    if (!currentUser) {
      return;
    }

    if (bagItems.length === 0) {
      return;
    }

    if (onOrderPlaced) {
      onOrderPlaced();
    }
  };
  let totalItem = bagItems.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );

  let totalMRP = bagItems.reduce(
    (total, item) => total + ((item.itemDetails?.original_price || 0) * (item.quantity || 0)),
    0
  );

  let totalDiscount = bagItems.reduce(
    (total, item) => {
      const originalPrice = item.itemDetails?.original_price || 0;
      const currentPrice = item.itemDetails?.current_price || 0;
      return total + ((originalPrice - currentPrice) * (item.quantity || 0));
    },
    0
  );

  let finalPayment = totalMRP - totalDiscount + CONVENIENCE_FEES;

  if (bagItems.length === 0) {
    finalPayment = 0;
    totalItem = 0;
  }



  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="bag-details-container">
        <div className="price-header">PRICE ({totalItem} Items)</div>
        <div className="price-item">
          <span className="price-item-tag">Total MRP</span>
          <span className="price-item-value">₹ {totalMRP.toFixed(2)}</span>
        </div>
        <div className="price-item">
          <span className="price-item-tag">Discount on MRP</span>
          <span className="price-item-value priceDetail-base-discount">
            -₹ {totalDiscount.toFixed(2)}
          </span>
        </div>
        <div className="price-item">
          <span className="price-item-tag">Convenience Fee</span>
          <span className="price-item-value">
            ₹ {CONVENIENCE_FEES.toFixed(2)}
          </span>
        </div>
        <hr />
        <div className="price-footer">
          <span className="price-item-tag">Total Amount</span>
          <span className="price-item-value">
            ₹{finalPayment.toFixed(2)}
          </span>
        </div>
      </div>
      {bagItems.length > 0 && (
        <button 
          className="btn-place-order" 
          onClick={handleProceedToCheckout}
        >
          <div className="css-xjhrni">
            PROCEED TO CHECKOUT
          </div>
        </button>
      )}
    </motion.div>
  );
};

export default BagSummary;
