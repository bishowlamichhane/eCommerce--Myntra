import { useDispatch, useSelector } from "react-redux";
import { bagAction } from "../store/BagSlice";

const HomeItem = ({ item }) => {
  const dispatch = useDispatch();
  const bagItems = useSelector((store) => store.bag);

  const elementFound = bagItems.indexOf(item.id) >= 0;

  const handleAdded = (itemId) => {
    dispatch(bagAction.addToBag(itemId));
  };

  const handleRemoved = (itemId) => {
    dispatch(bagAction.removeFromBag(itemId));
  };

  return (
    <div className="item-container">
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
      {elementFound ? (
        <button
          className="btn-remove-bag btn btn-danger"
          onClick={() => handleRemoved(item.id)}
        >
          Remove from Bag
        </button>
      ) : (
        <button
          className="btn-add-bag btn btn-success"
          onClick={() => handleAdded(item.id)}
        >
          Add to Bag
        </button>
      )}
    </div>
  );
};

export default HomeItem;
