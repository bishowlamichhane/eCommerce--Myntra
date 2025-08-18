import { configureStore } from "@reduxjs/toolkit";
import itemsSlice from "./itemsSlice";
import fetchStatusSlice from "./fetchStatusSlice";
import bagSlice from "./bagSlice";
import userSlice from "./userSlice";
import toastSlice from "./toastSlice";

const myntraStore = configureStore({
    reducer: {
        items: itemsSlice.reducer,
        fetchStatus: fetchStatusSlice.reducer,
        bag: bagSlice.reducer,
        user: userSlice.reducer,
        toast: toastSlice.reducer
    }
}
);


export default myntraStore;