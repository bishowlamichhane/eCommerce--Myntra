import { createSlice } from "@reduxjs/toolkit";

const toastSlice = createSlice({
    name: "toast",
    initialState: {
        message: "",
        isVisible: false,
        type: "info"
    },
    reducers: {
        showToast: (state, action) => {
            state.message = action.payload.message;
            state.type = action.payload.type || "info";
            state.isVisible = true;
        },
        hideToast: (state) => {
            state.isVisible = false;
            state.message = "";
        }
    }
});

export const toastActions = toastSlice.actions;
export default toastSlice;
