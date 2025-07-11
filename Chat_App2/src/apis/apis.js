import axios from "axios"
import { API_ROOT } from "../config/constants"
import authorizedAxiosInstance from "../utils/authorizeAxios"

// Users
export const loginGoogleAPI = async (data) => {
  axios.defaults.withCredentials = true
  return (await authorizedAxiosInstance.post(`${API_ROOT}/v1/user/login/google`, data)).data
}

export const loginAPI = async (data) => {
  axios.defaults.withCredentials = true
  return (await authorizedAxiosInstance.post(`${API_ROOT}/v1/user/login`, data)).data
}

export const handleLogoutAPI = async () => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/user/logout`)
  return response.data
}

export const handleRefreshTokenAPI = async (refreshToken) => {
  return await authorizedAxiosInstance.put(`${API_ROOT}/v1/user/refresh_token`, { refreshToken })
}

export const createUserAPI = async (data) => {
  return (await authorizedAxiosInstance.post(`${API_ROOT}/v1/user`, data)).data
}

export const getUserByIdAPI = async (userId) => {
  return (await authorizedAxiosInstance.get(`${API_ROOT}/v1/user/${userId}`)).data
}

export const getAllUsersAPI = async (query = 'page=1') => {
  return (await authorizedAxiosInstance.get(`${API_ROOT}/v1/user?${query}`)).data
}

export const updateUserAPI = async (userId, updateData) => {
  return (await authorizedAxiosInstance.put(`${API_ROOT}/v1/user/${userId}`, updateData)).data
}

export const searchUserAPI = async (keyword) => {
  return (await authorizedAxiosInstance.get(`${API_ROOT}/v1/user/search?keyword=${keyword}`)).data
}

// Users


// Friends

export const createFriendAPI = async (request) => {
  return (await authorizedAxiosInstance.post(`${API_ROOT}/v1/friendship/`, request)).data
}

// export const getAllFriendsByUserIdAPI = async (userId) => {
//   return (await authorizedAxiosInstance.get(`${API_ROOT}/v1/friendship/user/${userId}`)).data
// }

export const updateFriend = async (id, updateData) => {
  return (await authorizedAxiosInstance.put(`${API_ROOT}/v1/friendship/${id}`, updateData)).data
}

export const getAllFriendShipsByUserId = async (userId, query = 'page=1') => {
  return (await authorizedAxiosInstance.get(`${API_ROOT}/v1/friendship/user/${userId}?${query}`)).data
}

export const getFriendShipBetweenTwoUsers = async (userIds) => {
  return (await authorizedAxiosInstance.get(`${API_ROOT}/v1/friendship/two-users?user1=${userIds[0]}&user2=${userIds[1]}`)).data
}

// Friends


// Conversations

export const createConversationAPI = async (conversation) => {
  return (await authorizedAxiosInstance.post(`${API_ROOT}/v1/conversation`, conversation)).data
}

export const getAllConversationsByUserId = async (userId, page = 1) => {
  return (await authorizedAxiosInstance.get(`${API_ROOT}/v1/conversation/user/${userId}?page=${page}`)).data
}

export const getOneConversationById = async (id) => {
  return (await authorizedAxiosInstance.get(`${API_ROOT}/v1/conversation/${id}`)).data
}

export const getOneConversationBetweenTwoUsers = async (userIds) => {
  return (await authorizedAxiosInstance.get(`${API_ROOT}/v1/conversation/between-two-users?userId1=${userIds[0]}&userId2=${userIds[1]}`)).data
}

export const updateConversationAPI = async (id, updateData) => {
  return (await authorizedAxiosInstance.put(`${API_ROOT}/v1/conversation/${id}`, updateData)).data
}

// Conversations


// Messages

export const createMessageAPI = async (message) => {
  return (await authorizedAxiosInstance.post(`${API_ROOT}/v1/message`, message)).data
}

export const getAllMessagesByConversationIdAPI = async (conversationId, page = 1) => {
  return (await authorizedAxiosInstance.get(`${API_ROOT}/v1/message/conversation/${conversationId}?page=${page}`)).data
}

export const getMessagesByIdAPI = async (id) => {
  return (await authorizedAxiosInstance.get(`${API_ROOT}/v1/message/${id}`)).data
}

export const updateSeenMessagesAPI = async (conversationId, userId) => {
  return (await authorizedAxiosInstance.put(`${API_ROOT}/v1/message/seen/${conversationId}`, { userId })).data
}

export const uploadFileAPI = async (messageId, formData) => {
  return (await authorizedAxiosInstance.post(`${API_ROOT}/v1/message/${messageId}/uploadFile`, formData)).data;
}

export const updateMessageFilesAPI = async (messageId, files) => {
  return (await authorizedAxiosInstance.put(`${API_ROOT}/v1/message/${messageId}/update-message-files`, { files })).data
}

export const updateMessageAPI = async (id, updateData) => {
  return (await authorizedAxiosInstance.put(`${API_ROOT}/v1/message/${id}`, updateData)).data
}
// Messages


// MessageFiles

export const createMessageFileAPI = async (files) => {
  return (await authorizedAxiosInstance.post(`${API_ROOT}/v1/message_file`, files)).data
}

// MessageFiles

// MessageFiles

export const createMessageReactionAPI = async (reaction) => {
  return (await authorizedAxiosInstance.post(`${API_ROOT}/v1/message_reaction`, reaction)).data
}

export const updateMessageReactionAPI = async (id, updateData) => {
  return (await authorizedAxiosInstance.put(`${API_ROOT}/v1/message_reaction/${id}`, updateData)).data
}

export const deleteMessageReactionAPI = async (id) => {
  return (await authorizedAxiosInstance.delete(`${API_ROOT}/v1/message_reaction/${id}`)).data
}

// MessageFiles


// MessageReaders

export const createMessageReaderAPI = async (reader) => {
  return (await authorizedAxiosInstance.post(`${API_ROOT}/v1/message_reader`, reader)).data
}

// MessageReaders


// Deleted Message

export const createDeletedMessageAPI = async (deletedMessage) => {
  return (await authorizedAxiosInstance.post(`${API_ROOT}/v1/deleted_message`, deletedMessage)).data
}

export const deleteDeletedMessageAPI = async (id) => {
  return (await authorizedAxiosInstance.delete(`${API_ROOT}/v1/deleted_message/${id}`)).data
}

// Deleted Message