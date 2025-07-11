import { combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"

// slices
import appReducer from './slices/app'
import userReducer from './slices/userSlice'
import registerInfoReducer from './slices/registerInfoSlice'
import activeConversationReducer from './slices/activeConversationSlice'
import messagesReducer from './slices/messagesSlice'
import receiverReducer from './slices/receiverSlice'

const rootPersistConfig = {
  key: "root",
  storage,
  keyprefix: "redux-"
}

const rootReducer = combineReducers({
  app: appReducer,
  user: userReducer,
  registerInfo: registerInfoReducer,
  activeConversation: activeConversationReducer,
  messages: messagesReducer,
  receiver: receiverReducer
})

export { rootPersistConfig, rootReducer }
