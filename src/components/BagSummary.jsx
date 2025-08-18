import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { createOrder, clearUserBag } from "../firebase/firebase";
import { useToast } from "../hooks/useToast";

const BagSummary = ({ bagItems = [], onOrderPlaced }) => {
  const CONVENIENCE_FEES = 99;
  const { currentUser } = useAuth();
  console.log(currentUser)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const { showWarning, showSuccess, showError } = useToast();

  const handleOrder = async () => {
    if (!currentUser) {
      showWarning("Please login to place an order");
      return;
    }

    if (bagItems.length === 0) {
      showWarning("Your bag is empty");
      return;
    }

    if (isPlacingOrder) {
      return; // Prevent multiple clicks
    }

    setIsPlacingOrder(true);

    try {
      // Calculate order summary
      const totalItems = bagItems.reduce((total, item) => total + (item.quantity || 0), 0);
      const totalMRP = bagItems.reduce((total, item) => total + ((item.itemDetails?.original_price || 0) * (item.quantity || 0)), 0);
      const totalDiscount = bagItems.reduce((total, item) => {
        const originalPrice = item.itemDetails?.original_price || 0;
        const currentPrice = item.itemDetails?.current_price || 0;
        return total + ((originalPrice - currentPrice) * (item.quantity || 0));
      }, 0);
      const finalAmount = totalMRP - totalDiscount + CONVENIENCE_FEES;

      // Prepare order data
      const orderData = {
        items: bagItems.map(item => ({
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          priceAtPurchase: item.priceAtPurchase,
          companyId: item.companyId,
          itemDetails: item.itemDetails,
          addedAt: item.addedAt
        })),
        totalItems,
        totalMRP,
        totalDiscount,
        convenienceFee: CONVENIENCE_FEES,
        finalAmount,
        additionalInfo: {
          customerEmail: currentUser.email,
          customerName: currentUser.name
        }
      };

      // Create order in Firebase
      const orderId = await createOrder(currentUser.uid, orderData);
      
      // Clear the bag after successful order placement
      await clearUserBag(currentUser.uid);
      
      // Notify parent component to update UI
      if (onOrderPlaced) {
        onOrderPlaced();
      }
      
      showSuccess(`Order placed successfully! Order ID: ${orderId}`);
        
      // TODO: Redirect to order confirmation page or orders page
      
    } catch (error) {
      console.error("Error placing order:", error);
      showError("Failed to place order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };
  // Calculate totals directly from bagItems which now contain all necessary information
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

  // Handle case where bag is empty
  if (bagItems.length === 0) {
    finalPayment = 0;
    totalItem = 0;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
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
          onClick={handleOrder}
          disabled={isPlacingOrder}
          style={{
            opacity: isPlacingOrder ? 0.7 : 1,
            cursor: isPlacingOrder ? 'not-allowed' : 'pointer'
          }}
        >
          <div className="css-xjhrni">
            {isPlacingOrder ? 'PLACING ORDER...' : 'PLACE ORDER'}
          </div>
        </button>
      )}
    </motion.div>
  );
};

export default BagSummary;
