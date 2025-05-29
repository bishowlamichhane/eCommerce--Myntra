import { useSelector } from "react-redux";

const BagSummary = ({ bagItems, items }) => {
  const CONVENIENCE_FEES = 99;

  // Create a new array that combines item details with quantity from bagItems
  const itemsWithQuantity = bagItems
    .map((bagItem) => {
      // Find the full item details from the items list
      const itemDetails = items.find((item) => item.id === bagItem.itemId);
      // If itemDetails are found, return a new object combining details and quantity
      if (itemDetails) {
        return { ...itemDetails, quantity: bagItem.quantity };
      }
      return null; // Return null or handle cases where item details might be missing
    })
    .filter((item) => item !== null); // Filter out any null entries

  let totalItem = itemsWithQuantity.reduce(
    (total, item) => total + item.quantity,
    0
  );
  let totalMRP = 0;
  let totalDiscount = 0;

  itemsWithQuantity.forEach((item) => {
    totalMRP += item.original_price * item.quantity; // Calculate MRP based on quantity
    totalDiscount += (item.original_price - item.current_price) * item.quantity; // Calculate discount based on quantity
  });

  let finalPayment = totalMRP - totalDiscount + CONVENIENCE_FEES;

  // Handle case where bag is empty (no itemsWithQuantity)
  if (itemsWithQuantity.length === 0) {
    finalPayment = 0; // No payment if bag is empty
    totalItem = 0; // No items if bag is empty
  }

  return (
    <div>
      <div className="bag-details-container">
        {/* Display total number of items based on quantity sum */}
        <div className="price-header">PRICE ({totalItem} Items)</div>
        <div className="price-item">
          <span className="price-item-tag">Total MRP</span>
          <span className="price-item-value">₹ {totalMRP.toFixed(2)}</span>{" "}
          {/* Format to 2 decimal places */}
        </div>
        <div className="price-item">
          <span className="price-item-tag">Discount on MRP</span>
          <span className="price-item-value priceDetail-base-discount">
            -₹ {totalDiscount.toFixed(2)} {/* Format to 2 decimal places */}
          </span>
        </div>
        <div className="price-item">
          <span className="price-item-tag">Convenience Fee</span>
          <span className="price-item-value">
            ₹ {CONVENIENCE_FEES.toFixed(2)}
          </span>{" "}
          {/* Format to 2 decimal places */}
        </div>
        <hr />
        <div className="price-footer">
          <span className="price-item-tag">Total Amount</span>
          <span className="price-item-value">
            ₹{finalPayment.toFixed(2)}
          </span>{" "}
          {/* Format to 2 decimal places */}
        </div>
      </div>
      {/* Only show place order button if there are items in the bag */}
      {itemsWithQuantity.length > 0 && (
        <button className="btn-place-order">
          <div className="css-xjhrni">PLACE ORDER</div>
        </button>
      )}
    </div>
  );
};

export default BagSummary;
