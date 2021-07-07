import { createSlice } from "@reduxjs/toolkit";

export const accountSlice = createSlice({
  name: "account",
  initialState: {
    accountBalance: 1000,
  },
  reducers: {
    increaseByOneHundred: (state) => {
      state.accountBalance += 100;
    },
    decreaseByOneHundred: (state) => {
      state.accountBalance -= 100;
    },
    increaseByAmount: (state, action) => {
      state.accountBalance += action.payload;
    },
    decreaseByAmount: (state, action) => {
      state.accountBalance -= action.payload;
    },
  },
});

export const {
  increaseByAmount,
  decreaseByAmount,
  increaseByOneHundred,
  decreaseByOneHundred,
} = accountSlice.actions;

export default accountSlice.reducer;
