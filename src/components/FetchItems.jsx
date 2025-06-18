import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { collectionGroup, getDocs } from "firebase/firestore";
import { itemsAction } from "../store/itemsSlice";
import { fetchAction } from "../store/fetchStatusSlice";
import { db } from "../firebase/firebase";
import LoadingSpinner from "./LoadingSpinner";

const FetchItems = () => {
  const fetchStatus = useSelector((store) => store.fetchStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    if (fetchStatus.fetchDone) return;

    const fetchData = async () => {
      try {
        dispatch(fetchAction.markFetchingStarted());

        // This will search *all* `products` subcollections across Firestore
        const querySnapshot = await getDocs(collectionGroup(db, "products"));
        const itemsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        dispatch(itemsAction.addInitialItems(itemsData));
        dispatch(fetchAction.markFetchDone());
      } catch (error) {
        console.error("Failed to fetch items:", error);
      } finally {
        dispatch(fetchAction.markFetchingFinished());
      }
    };

    fetchData();
  }, [fetchStatus.fetchDone, dispatch]);

  if (fetchStatus.isFetching) {
    return <LoadingSpinner />;
  }

  return <div></div>;
};

export default FetchItems;
