import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  date: '',
  slots: [],
  teamName: '',
  turfId: null,
  costPerHour: 0 
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setBookingField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    resetBooking: (state) => {
      state.date = '';
      state.slots = [];
      state.teamName = '';
      state.turfId = null;
    }
  }
});

export const { setBookingField, resetBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
