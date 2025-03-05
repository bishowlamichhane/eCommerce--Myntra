import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { itemsAction } from "../store/itemsSlice";
import { fetchAction } from "../store/fetchStatusSlice";
import { items } from "../../public/items";
import LoadingSpinner from "./LoadingSpinner";
const FetchItems = () => {
  const fetchStatus = useSelector((store) => store.fetchStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    if (fetchStatus.fetchDone) return;

    const fetchData = async () => {
      try {
        dispatch(fetchAction.markFetchingStarted());

        // You could fetch dynamically here instead of static data:
        // const response = await fetch('your-api-url');
        // const data = await response.json();

        dispatch(itemsAction.addInitialItems(items));
        dispatch(fetchAction.markFetchDone());
      } catch (error) {
        console.error("Failed to fetch items:", error);
      } finally {
        dispatch(fetchAction.markFetchingFinished());
      }
    };

    fetchData();
  }, [fetchStatus, dispatch]);

  if (fetchStatus.isFetching) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  return <div></div>;
};

export default FetchItems;
