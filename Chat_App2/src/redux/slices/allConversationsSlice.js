import { getAllConversationsByUserId } from '@/apis/apis';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = { allConversations: [], loading: false, error: null }

export const fetchAllConversationsRedux = createAsyncThunk(
  'allConversations/fetchAllConversationsByUserId',
  async (userId) => {
    const res =  await getAllConversationsByUserId(userId)
    return res
  }
)

export const allsConversationsSlice = createSlice({
  name: 'allConversations',
  initialState,
  reducers: {
    setAllConversations: (state, action) => {
      state.allConversations = action.payload
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAllConversationsRedux.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllConversationsRedux.fulfilled, (state, action) => {
        state.allConversations = action.payload
      })

      .addCase(fetchAllConversationsRedux.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
})

export const { setAllConversations } = allsConversationsSlice.actions

export const allConversationsSelector = (state) => state.allConversations

export default allsConversationsSlice.reducer