import { createSlice } from "@reduxjs/toolkit";
//bag slice 


const bagSlice = createSlice({
    name: "bag",
    initialState: [],
    reducers: {
        addToBag: (state, action) => {
            state.push(action.payload)

        },
        removeFromBag: (state, action) => {
            return state.filter((bagItem) => bagItem.itemId !== action.payload)
        }
    }
});
export const bagAction = bagSlice.actions;
export default bagSlice;




