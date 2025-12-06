import { createSlice } from '@reduxjs/toolkit'

const myBookingSlice = createSlice({
  name: 'myBookings',
  initialState: {
    myBookings: {
      active: [],
      past: []
    }
  },
  reducers: {
    setMyBookings: (state, action) => {
      state.myBookings = action.payload
    },
    updateBookingStatus: (state, action) => {
      const updated = action.payload
      const activeIndex = state.myBookings.active.findIndex(b => b.id === updated.id)
      if (activeIndex !== -1) {
        state.myBookings.active[activeIndex] = updated
        return
      }
      const pastIndex = state.myBookings.past.findIndex(b => b.id === updated.id)
      if (pastIndex !== -1) {
        state.myBookings.past[pastIndex] = updated
        return
      }
    },
    updateAvlGrp: (state, action) => {
      const bookingId = action.payload

      const updateList = (list) => {
        const index = list.findIndex(b => b.id === bookingId)
        if (index !== -1) {
          list[index].groupAvailable = true
        }
      }

      updateList(state.myBookings.active)
      updateList(state.myBookings.past)
    },
    clearMyBookings: (state) => {
      state.myBookings = { active: [], past: [] }
    }
  }
})

export const { setMyBookings, updateBookingStatus, clearMyBookings ,updateAvlGrp} = myBookingSlice.actions
export default myBookingSlice.reducer
