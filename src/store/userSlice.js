import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {},
    reducers: {
        addUser: (state, action) => {
            return action.payload
        }
    }
})
export const userAction = userSlice.actions;
export default userSlice