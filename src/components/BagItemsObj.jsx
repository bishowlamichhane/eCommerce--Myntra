import { RxCross2 } from "react-icons/rx";
import { useAuth } from "../context/useAuth";
import { removeFromUserBag } from "../firebase/firebase";
import { motion } from "framer-motion";

const BagItemsObj = ({ item, quantity, onItemRemoved }) => {
  const { currentUser } = useAuth();

  const handleDelete = async (itemId) => {
    if (!currentUser) return;

    try {
      // Remove from Firestore
      await removeFromUserBag(currentUser.uid, itemId);
      
      // Notify parent component to update the UI
      if (onItemRemoved) {
        onItemRemoved(itemId);
      }
    } catch (error) {
      console.error("Error removing item from bag:", error);
    }
  };

  return (
    <motion.div
      className="bag-item-container"
      variants={{
        hidden: { opacity: 0, y: 40 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
      }}
      initial="hidden"
      animate="show"
    >
      <div className="item-left-part">
        <img className="bag-item-img" src={item.itemDetails?.image || item.image} />
      </div>
      <div className="item-details-and-actions">
        <div className="item-right-part">
          <div className="company">{item.itemDetails?.company || item.company}</div>
          <div className="item-name">{item.itemDetails?.name || item.item_name}</div>
          <div className="price-container">
            <span className="current-price">Rs {item.itemDetails?.current_price || item.current_price}</span>
            <span className="original-price">Rs {item.itemDetails?.original_price || item.original_price}</span>
            <span className="discount-percentage">
              {item.itemDetails?.discount_percentage || item.discount_percentage}% OFF
            </span>
          </div>
          <div className="return-period">
            <span className="return-period-days">
              {item.return_period} days
            </span>{" "}
            return available
          </div>
          <div className="delivery-details">
            Delivery by
            <span className="delivery-details-days">{item.delivery_date}</span>
          </div>
        </div>
        <div className="item-action-section">
          <div className="item-quantity">x{quantity}</div>
          <div className="remove-from-cart" onClick={() => handleDelete(item.productId || item.id)}>
            <RxCross2 color="red" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BagItemsObj;
