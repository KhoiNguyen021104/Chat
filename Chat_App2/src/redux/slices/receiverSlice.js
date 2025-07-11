import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getUserByIdAPI } from '../../apis/apis'

const initialState = { receiver: null, loading: false, error: null }

export const fetchReceiverRedux = createAsyncThunk(
  'receiver/fetchReceiverRedux',
  async (receiverId) => {
    return await getUserByIdAPI(receiverId)
  }
)

export const receiverSlice = createSlice({
  name: 'receiver',
  initialState,
  reducers: {
    setReceiver: (state, action) => {
      state.receiver = action.payload
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchReceiverRedux.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReceiverRedux.fulfilled, (state, action) => {
        state.receiver = action.payload
      })

      .addCase(fetchReceiverRedux.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
})

export const { setReceiver } = receiverSlice.actions

export const receiverSelector = (state) => state.receiver

export default receiverSlice.reducer