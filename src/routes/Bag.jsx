import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import { getUserBag } from "../firebase/firebase";
import BagItemsObj from "../components/BagItemsObj";
import BagSummary from "../components/BagSummary";

const Bag = () => {
  const { currentUser } = useAuth();
  const [bagItems, setBagItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBagItems = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const items = await getUserBag(currentUser.uid);
        setBagItems(items);
        setError(null);
      } catch (err) {
        console.error("Error fetching bag items:", err);
        setError("Failed to load bag items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBagItems();
  }, [currentUser]);

  const handleItemRemoved = (itemId) => {
    setBagItems(prevItems => prevItems.filter(item => item.productId !== itemId));
  };

  if (loading) {
    return <div className="loading">Loading your bag...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!currentUser) {
    return <div className="error">Please login to view your bag</div>;
  }

  return (
    <main>
      <div className="bag-page">
        <div className="bag-items-container">
          {bagItems.length === 0 ? (
            <div className="empty-bag">Your bag is empty</div>
          ) : (
            bagItems.map((item) => (
              <BagItemsObj
                key={item.id}
                item={item}
                quantity={item.quantity}
                onItemRemoved={handleItemRemoved}
              />
            ))
          )}
        </div>
        <div className="bag-summary">
          <BagSummary bagItems={bagItems} />
        </div>
      </div>
    </main>
  );
};

export default Bag;
