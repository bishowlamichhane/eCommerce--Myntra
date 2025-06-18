import { useDispatch, useSelector } from "react-redux";
import { bagAction } from "../store/bagSlice";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import { addToUserBag, removeFromUserBag, getUserBag } from "../firebase/firebase";

const HomeItem = ({ item }) => {
  const dispatch = useDispatch();
  const { currentUser } = useAuth();
  const [bagItems, setBagItems] = useState([]);
  const [elementFound, setElementFound] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Fetch bag items when component mounts or currentUser changes
  useEffect(() => {
    const fetchBagItems = async () => {
      if (currentUser) {
        try {
          const items = await getUserBag(currentUser.uid);
          setBagItems(items);
          const found = items.some((bagItem) => bagItem.productId === item.id);
          setElementFound(found);
          
          if (found) {
            const itemInBag = items.find((bagItem) => bagItem.productId === item.id);
            setQuantity(itemInBag ? itemInBag.quantity : 1);
          } else {
            setQuantity(1);
          }
        } catch (error) {
          console.error("Error fetching bag items:", error);
        }
      }
    };

    fetchBagItems();
  }, [currentUser, item.id]);

  const navigate = useNavigate();

  const handleAdded = async (itemId) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    try {
      const productData = {
        productId: itemId,
        companyId: item.company || 'default',
        quantity: quantity,
        priceAtPurchase: item.current_price || 0,
        itemDetails: {
          name: item.item_name || '',
          image: item.image || '',
          company: item.company || '',
          current_price: item.current_price || 0,
          original_price: item.original_price || 0,
          discount_percentage: item.discount_percentage || 0
        }
      };

      // Add to Firestore
      await addToUserBag(currentUser.uid, productData);
      
      // Update local state
       setBagItems(prev => [...prev, { ...productData, id: Date.now() }]);
      setElementFound(true);
    } catch (error) {
      console.error("Error adding item to bag:", error);
    }
  };

  const itemClicked = (itemId) => {
    navigate(`/item/${itemId}`);
  };

  const handleRemoved = async (itemId) => {
    if (!currentUser) return;

    try {
      // Remove from Firestore
      await removeFromUserBag(currentUser.uid, itemId);
      
      // Update local state
      setBagItems(prev => prev.filter(item => item.productId !== itemId));
      setElementFound(false);
      setQuantity(1);
    } catch (error) {
      console.error("Error removing item from bag:", error);
    }
  };

  return (
    <div className="item-container">
      <div onClick={() => itemClicked(item.id)} style={{ cursor: "pointer" }}>
        <img className="item-image" src={item.image} alt="item image" />

        <div className="rating">
          {/* Use optional chaining to check if rating exists */}
          {item.rating?.count || 0} | {item.rating?.stars || 0} ⭐
        </div>
        <div className="company-name">{item.company}</div>
        <div className="item-name">{item.item_name}</div>
        <div className="price">
          <span className="current-price">Rs {item.current_price}</span>
          <span className="original-price">Rs {item.original_price}</span>
          <span className="discount">{item.discount_percentage}% OFF</span>
        </div>
      </div>
      <div className="action-area">
        {elementFound ? (
          <button
            className="btn-remove-bag btn btn-danger"
            onClick={() => handleRemoved(item.id)}
          >
            Remove from Bag
          </button>
        ) : (
          <>
            <button
              className="btn-add-bag btn btn-success"
              onClick={() => {
                handleAdded(item.id);
              }}
            >
              Add to Bag
            </button>
            <div className="quantity-controls-container">
              <button
                className="quantity-btn quantity-btn-left"
                onClick={() => {
                  if (quantity > 1) {
                    setQuantity((prev) => prev - 1);
                  }
                }}
              >
                -
              </button>
              <input
                className="quantity-input"
                value={quantity}
                type="number"
                readOnly
              />
              <button
                className="quantity-btn quantity-btn-right"
                onClick={() => setQuantity((prev) => prev + 1)}
              >
                +
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomeItem;
