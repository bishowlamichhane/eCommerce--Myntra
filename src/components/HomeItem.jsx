import { useDispatch, useSelector } from "react-redux";
import { bagAction } from "../store/bagSlice";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const HomeItem = ({ item }) => {
  const dispatch = useDispatch();
  const bagItems = useSelector((store) => store.bag);
  const elementFound = bagItems.some((bagItem) => bagItem.itemId === item.id);

  const [quantity, setQuantity] = useState(() => {
    if (elementFound) {
      const itemInBag = bagItems.find((bagItem) => bagItem.itemId === item.id);
      return itemInBag ? itemInBag.quantity : 1;
    } else {
      return 1;
    }
  });

  useEffect(() => {
    if (elementFound) {
      const itemInBag = bagItems.find((bagItem) => bagItem.itemId === item.id);
      setQuantity(itemInBag ? itemInBag.quantity : 1);
    } else {
      setQuantity(1);
    }
  }, [elementFound, bagItems, item.id]);

  const navigate = useNavigate();

  const handleAdded = (itemId) => {
    const itemToAdd = { itemId, quantity };
    dispatch(bagAction.addToBag(itemToAdd));
  };

  const itemClicked = (itemId) => {
    navigate(`/item/${itemId}`);
  };

  const handleRemoved = (itemId) => {
    dispatch(bagAction.removeFromBag(itemId));
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
