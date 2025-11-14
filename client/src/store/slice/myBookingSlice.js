import { createSlice } from '@reduxjs/toolkit'

const myBookingSlice = createSlice({
  name: 'myBookings',
  initialState: {
    myBookings: []
  },
  reducers: {
    setMyBookings: (state, action) => {
      state.myBookings = action.payload
    },
    updateBookingStatus: (state, action) => {
      const updated = action.payload
      const index = state.myBookings.findIndex(b => b._id === updated._id)
      if (index !== -1) state.myBookings[index] = updated
    },
    clearMyBookings: (state) => {
      state.myBookings = []
    }
  }
})

export const { setMyBookings, updateBookingStatus, clearMyBookings } = myBookingSlice.actions
export default myBookingSlice.reducer
