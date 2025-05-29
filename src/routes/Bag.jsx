import { useSelector } from "react-redux";
import BagItemsObj from "../components/BagItemsObj";
import BagSummary from "../components/BagSummary";

const Bag = () => {
  const bagItems = useSelector((store) => store.bag);

  const items = useSelector((store) => store.items);
  const finalItems = items.filter((item) => {
    const itemInBag = bagItems.find((bagItem) => bagItem.itemId === item.id);
    return itemInBag !== undefined;
  });

  return (
    <main>
      <div className="bag-page">
        <div className="bag-items-container">
          {finalItems.map((item) => {
            const bagItem = bagItems.find(
              (bagItem) => bagItem.itemId === item.id
            );
            const quantity = bagItem ? bagItem.quantity : 0;

            return (
              <BagItemsObj item={item} key={item.id} quantity={quantity} />
            );
          })}
        </div>
        <div className="bag-summary">
          <BagSummary bagItems={bagItems} items={items} />
        </div>
      </div>
    </main>
  );
};

export default Bag;
