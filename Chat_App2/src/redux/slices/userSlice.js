import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    }
  },
})

export const { setUser } = userSlice.actions

export const userSelector = (state) => state.user?.user

export default userSlice.reducer