import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allTurfs: [], 
};

const turfSlice = createSlice({
  name: "turfs",
  initialState,
  reducers: {
    setTurfs: (state, action) => {
      state.allTurfs = action.payload; 
    },
  },
});

export const { setTurfs } = turfSlice.actions;
export default turfSlice.reducer;
