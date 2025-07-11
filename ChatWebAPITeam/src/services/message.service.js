/* eslint-disable no-useless-catch */
/* eslint-disable no-console */

import { StatusCodes } from "http-status-codes";
import { conversationModel, messageModel } from "~/models";
import ApiError from "~/utils/apiErrors";

const create = async (reqBody) => {
  try {
    const message = await messageModel.create(reqBody);
    if (!message) if (!isExist) throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Create failed!")
    await conversationModel.update(reqBody.conversationId, { last_message_id: message?.id })
    return message;
  } catch (error) {
    throw error;
  }
};

const findOneById = async (id) => {
  try {
    const message = await messageModel.findOneById(id);
    return message;
  } catch (error) {
    throw error;
  }
};

const findAllByConversationId = async (conversationId, page) => {
  try {
    const messages = await messageModel.findAllByConversationId(conversationId, page);
    return messages;
  } catch (error) {
    throw error;
  }
};

// const findAllByUserId = async (userId) => {
//   try {
//     const messages = await messageModel.findAllByUserId(userId);
//     return messages;
//   } catch (error) {
//     throw error;
//   }
// };

// const updateSeenAllMessageInOneConversation = async (data) => {
//   try {
//     const result = await messageModel.updateSeenAllMessageInOneConversation(data);
//     return result;
//   } catch (error) {
//     throw error;
//   }
// }
const update = async (id, updateData) => {
  try {
    const isExist = await messageModel.checkExist(id)
    if (!isExist) throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Message not found")
    const result = await messageModel.update(id, updateData);
    return result;
  } catch (error) {
    throw error;
  }
}


// const uploadFile = async (id, reqFiles) => {
//   try {
//     const result = await messageModel.uploadFile(id, reqFiles);
//     if (result) {
//       const resUpdated = await messageModel.update(id, { files: [...result] })

//       const io = getIO();
//       if (resUpdated) {
//         // console.log('🚀 ~ uploadFile ~ resUpdated:', resUpdated)
//         const uploadStatus = true;
//         io.to(String(resUpdated.conversationId)).emit("receiveUploadStatus", { uploadStatus, message: resUpdated });
//         return resUpdated
//       }
//     }
//     return null;
//   } catch (error) {
//     throw error;
//   }
// }

// const updateMessageFiles = async (id, files) => {
//   try {
//     const message = await messageModel.findOneById(id);
//     if (!message) throw new ApiError(StatusCodes.NOT_FOUND, "NOT FOUND")
//     if (message.type === TYPE_MESSAGE.CONTAIN_DOCUMENT) {
//       message.files = message.files?.map((f, index) => ({
//         ...f,
//         name: files[index].name,
//         size: files[index].size
//       }))
//     }

//     const result = await messageModel.update(id, message);
//     return result;
//   } catch (error) {
//     throw error;
//   }
// }

const message = {
  create,
  findOneById,
  findAllByConversationId,
  // findAllByUserId,
  // updateSeenAllMessageInOneConversation,
  update,
  // uploadFile,
  // updateDeletedByMessage
};

export default message;