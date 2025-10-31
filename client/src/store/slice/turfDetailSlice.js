import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  turfs: {}
}

const turfDetailSlice = createSlice({
  name: 'turfDetail',
  initialState,
  reducers: {
    setTurfDetail: (state, action) => {
      const { id, data } = action.payload
      state.turfs[id] = data
    }
  }
})

export const { setTurfDetail } = turfDetailSlice.actions
export default turfDetailSlice.reducer
