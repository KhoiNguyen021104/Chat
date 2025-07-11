import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  registerInfo: null
}

export const registerInfoSlice = createSlice({
  name: 'registerInfo',
  initialState,
  reducers: {
    setRegisterInfo: (state, action) => {
      state.registerInfo = action.payload
    }
  },
})

export const { setRegisterInfo } = registerInfoSlice.actions

export const registerInfoSelector = (state) => state.user?.registerInfo

export default registerInfoSlice.reducer