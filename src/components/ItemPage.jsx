import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { bagAction } from "../store/bagSlice";

const ItemPage = () => {
  const { id } = useParams();
  const items = useSelector((store) => store.items);
  const foundItem = items.filter((item) => item.id === id)[0];
  const dispatch = useDispatch();
  const bagItems = useSelector((store) => store.bag);

  const elementFound = bagItems.some((bagItem) => bagItem.itemId === id);
  const [quantity, setQuantity] = useState(() => {
    if (elementFound) {
      const itemInBag = bagItems.find((bagItem) => bagItem.itemId === id);
      return itemInBag ? itemInBag.quantity : 1;
    } else {
      return 1;
    }
  });

  useEffect(() => {
    if (elementFound) {
      const itemInBag = bagItems.find((bagItem) => bagItem.itemId === id);
      setQuantity(itemInBag ? itemInBag.quantity : 1);
    } else {
      setQuantity(1);
    }
  }, [elementFound, bagItems, id]);

  console.log(foundItem);
  if (!foundItem) {
    return <div>Item not found</div>;
  }

  const handleAdded = (itemId) => {
    const itemToAdd = { itemId, quantity };
    dispatch(bagAction.addToBag(itemToAdd));
  };

  const handleRemoved = (itemId) => {
    dispatch(bagAction.removeFromBag(itemId));
  };

  return (
    <div
      className="item-page-container"
      style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}
    >
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
          <h1 style={{ fontSize: "24px", marginBottom: "10px" }}>
            {foundItem.item_name}
          </h1>
          <p style={{ color: "#666", marginBottom: "20px" }}>
            {foundItem.company}
          </p>

          <div style={{ marginBottom: "20px" }}>
            <span style={{ fontSize: "20px", fontWeight: "bold" }}>
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
            <p style={{ fontWeight: "bold" }}>
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
            {elementFound ? (
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
      </div>
    </div>
  );
};

export default ItemPage;
