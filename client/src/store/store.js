import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./slice/userSlice"
import turfDetailReducer from "./slice/turfDetailSlice"
import turfReducer from "./slice/turfSlice"
import bookingReducer from "./slice/BookingSlice"
import paymentReducer from "./slice/paymentSlice"
import myBookingReducer from "./slice/myBookingSlice"

const store = configureStore({
  reducer: {
    user: userReducer,
    turfDetail: turfDetailReducer,
    turfs: turfReducer,
    booking: bookingReducer,
    payment: paymentReducer,
    myBooking: myBookingReducer
  }
})

export default store
