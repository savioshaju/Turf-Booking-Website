import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  email: "",
  card: {
    name: "",
    number: "",
    expiry: "",
    cvv: ""
  }
}

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setPaymentField: (state, action) => {
      const { field, value } = action.payload
      if (field.startsWith("card.")) {
        const key = field.split(".")[1]
        state.card[key] = value
      } else {
        state[field] = value
      }
    },
    resetPayment: (state) => {
      state.email = ""
      state.card = { name: "", number: "", expiry: "", cvv: "" }
    }
  }
})

export const { setPaymentField, resetPayment } = paymentSlice.actions
export default paymentSlice.reducer
