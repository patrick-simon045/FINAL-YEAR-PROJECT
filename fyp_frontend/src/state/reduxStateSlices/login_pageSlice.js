import { createSlice } from "@reduxjs/toolkit";

export const loginPageSlice = createSlice({
  name: "login",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    loginUser: (state) => {
      state.isLoggedIn = true;
    },
    logoutUser: (state) => {
      state.isLoggedIn = false;
    },
  },
});

export const { loginUser, logoutUser } = loginPageSlice.actions;

export default loginPageSlice.reducer;
