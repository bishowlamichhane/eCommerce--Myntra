import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { itemsAction } from "../store/itemsSlice";
import { fetchAction } from "../store/fetchStatusSlice";
import { collection, getDocs } from "firebase/firestore";

import LoadingSpinner from "./LoadingSpinner";
import { db } from "../firebase";

const FetchItems = () => {
  const fetchStatus = useSelector((store) => store.fetchStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    if (fetchStatus.fetchDone) return;

    const fetchData = async () => {
      try {
        dispatch(fetchAction.markFetchingStarted());

        const itemsRef = collection(db, "items");
        const querySnapShot = await getDocs(itemsRef);
        const itemsData = querySnapShot.docs.map((doc) => ({
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
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  return <div></div>;
};

export default FetchItems;
