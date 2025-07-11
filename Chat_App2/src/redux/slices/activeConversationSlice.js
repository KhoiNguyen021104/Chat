import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getOneConversationById } from '../../apis/apis'


const initialState = { activeConversation: null, loading: false, error: null }

export const fetchConversationRedux = createAsyncThunk(
  'activeConversation/fetchActiveConversationRedux',
  async (_id) => {
    const res =  await getOneConversationById(_id)
    return res
  }
)

export const activeConversationSlice = createSlice({
  name: 'activeConversation',
  initialState,
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchConversationRedux.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversationRedux.fulfilled, (state, action) => {
        state.activeConversation = action.payload
      })

      .addCase(fetchConversationRedux.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
})

export const { setActiveConversation } = activeConversationSlice.actions

export const activeConversationSelector = (state) => state.activeConversation

export default activeConversationSlice.reducer