import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { bagAction } from "../store/bagSlice";
import { useAuth } from "../context/useAuth";
import { addToUserBag, removeFromUserBag } from "../firebase/firebase";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";

const ItemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const items = useSelector((store) => store.items) || [];
  const foundItem = items.filter((item) => item.id === id)[0];
  const dispatch = useDispatch();
  const bagItems = useSelector((store) => store.bag) || [];
  const { currentUser } = useAuth();

  console.log('ItemPage Render - bagItems:', bagItems, 'ID:', id);

  const [isInBag, setIsInBag] = useState(false); 
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const itemInBag = bagItems.find((bagItem) => bagItem.itemId === id);
    setIsInBag(itemInBag !== undefined);
    if (itemInBag) {
      setQuantity(itemInBag.quantity);
    } else {
      setQuantity(1);
    }
    console.log('useEffect - bagItems changed. isInBag:', isInBag, 'Quantity:', itemInBag?.quantity || 1);
  }, [bagItems, id]);

  console.log(foundItem);
  if (!foundItem) {
    return <div>Item not found</div>;
  }

  const handleAdded = async (itemId, updatedQuantity) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    try {
      const finalQuantity = updatedQuantity !== undefined ? updatedQuantity : quantity;
      const productData = {
        productId: itemId,
        companyId: foundItem.company || 'default',
        quantity: finalQuantity,
        priceAtPurchase: foundItem.current_price || 0,
        itemDetails: {
          name: foundItem.item_name || '',
          image: foundItem.image || '',
          company: foundItem.company || '',
          current_price: foundItem.current_price || 0,
          original_price: foundItem.original_price || 0,
          discount_percentage: foundItem.discount_percentage || 0
        }
      };

      await addToUserBag(currentUser.uid, productData);

      const itemToAdd = { itemId, quantity: finalQuantity };
      dispatch(bagAction.addToBag(itemToAdd));
      console.log('handleAdded - Dispatched addToBag:', itemToAdd);
    } catch (error) {
      console.error("Error adding item to bag:", error);
    }
  };

  const handleRemoved = async (itemId) => {
    if (!currentUser) return;

    try {
      await removeFromUserBag(currentUser.uid, itemId);

      dispatch(bagAction.removeFromBag(itemId));
    } catch (error) {
      console.error("Error removing item from bag:", error);
    }
  };

  return (
    <div>
      <button style={{ marginBottom: "20px"  ,marginLeft:"20px", display:"flex" , alignItems:"center" , gap:"5px "}} onClick={()=>navigate('/')}><MdKeyboardDoubleArrowLeft/>Back home</button>
    <div className="item-page-container" style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ display: "flex", gap: "40px" }}>
        <div style={{ flex: "1", height: "400px", overflow: "hidden" }}>
          <img
            src={`/${foundItem.image}`}
            alt={foundItem.item_name}
            style={{
              width: "100%",
              borderRadius: "8px",
              height: "400px",
              objectFit: "contain",
            }}
          />
        </div>
        <div style={{ flex: "1" }}>
          <h1 style={{ fontSize: "20px", marginBottom: "10px" }}>
            {foundItem.item_name}
          </h1>
          <p style={{ color: "#666", marginBottom: "20px" }}>
            {foundItem.company}
          </p>

          <div style={{ marginBottom: "20px" }}>
            <span style={{ fontSize: "16px", fontWeight: "bold" }}>
              Rs {foundItem.current_price}
            </span>
            <span
              style={{
                textDecoration: "line-through",
                color: "#999",
                marginLeft: "10px",
              }}
            >
              Rs {foundItem.original_price}
            </span>
            <span style={{ color: "#ff905a", marginLeft: "10px" }}>
              {foundItem.discount_percentage}% OFF
            </span>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <p style={{ fontWeight: "normal" }}>
              Rating: {foundItem.rating?.stars || 0} ⭐
            </p>
            <p>Reviews: {foundItem.rating?.count || 0}</p>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <p style={{ fontWeight: "bold" }}>Return Period</p>
            <p>{foundItem.return_period} days return available</p>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <p style={{ fontWeight: "bold" }}>Delivery</p>
            <p>Delivery by {foundItem.delivery_date}</p>
          </div>

          <div className="action-area">
            {isInBag ? (
              <button
                className="btn-remove-bag btn btn-danger"
                onClick={() => handleRemoved(id)}
              >
                Remove from Bag
              </button>
            ) : (
              <>
                <button
                  className="btn-add-bag btn btn-success"
                  onClick={() => {
                    handleAdded(id);
                  }}
                >
                  Add to Bag
                </button>
                <div className="quantity-controls-container">
                  <button
                    className="quantity-btn quantity-btn-left"
                    onClick={() => {
                      if (quantity > 1) {
                        const newQuantity = quantity - 1;
                        handleAdded(id, newQuantity);
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
                    onClick={() => {
                      const newQuantity = quantity + 1;
                      handleAdded(id, newQuantity);
                    }}
                  >
                    +
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ItemPage;
