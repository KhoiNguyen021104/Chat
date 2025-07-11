import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getAllMessagesByConversationIdAPI } from '../../apis/apis'


const initialState = { messages: {}, loading: false, error: null }

export const fetchMessagesOfActiveConversationRedux = createAsyncThunk(
  'messages/fetchMessagesOfActiveConversationRedux',
  async ({ conversationId, page = 1 }) => {
    const res = await getAllMessagesByConversationIdAPI(conversationId, page)
    if (res) {
      const data = {
        ...res,
        messages: res?.messages?.reverse()
      }
      return data
    }
    return null
  }
)


export const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload
    },
    pushMessage: (state, action) => {
      state.messages.messages = [...state.messages.messages, action.payload];
    },
    unShiftMessage: (state, action) => {
      state.messages.messages = [action.payload, ...state.messages.messages];
    },
    appendMessage: (state, action) => {
      state.messages.messages = [...action.payload, ...state.messages.messages];
    },
    readMessage: (state, action) => {
      const messages = state.messages?.messages.map((msg) =>
        msg.id === action.payload.message_id
          ? {
            ...msg,
            readers: [
              ...msg.readers.filter(
                (m) => m.user_id !== action.payload.user_id
              ),
              action.payload,
            ],
          }
          : msg
      )
      state.messages.messages = messages;
    },
    replaceMessage: (state, action) => {
      const messages = state.messages.messages.map((msg) =>
        msg.id === action.payload.id
          ? action.payload
          : msg
      )
      state.messages.messages = messages
    },
    updateMessageReactions: (state, action) => {
      state.messages = state.messages.map(msg => {
        if (msg === action.payload._id) {
          msg.reactions = action.payload.reactions
        }
      })
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchMessagesOfActiveConversationRedux.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessagesOfActiveConversationRedux.fulfilled, (state, action) => {
        state.messages = action.payload
      })

      .addCase(fetchMessagesOfActiveConversationRedux.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
})

export const {
  setMessages,
  pushMessage,
  unShiftMessage,
  appendMessage,
  readMessage,
  replaceMessage,
  updateMessageReactions
} = messagesSlice.actions

export const messagesSelector = (state) => state.messages

export default messagesSlice.reducer