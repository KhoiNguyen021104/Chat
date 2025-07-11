/* eslint-disable no-useless-catch */
/* eslint-disable no-console */

import { StatusCodes } from "http-status-codes";
import { messageModel, messageReaderModel, userModel } from "~/models";
import ApiError from "~/utils/apiErrors";

const create = async (reqBody) => {
  try {
    const isExistMessage = await messageModel.checkExist(reqBody.message_id)
    if (!isExistMessage) throw new ApiError(StatusCodes.BAD_REQUEST, "Message does not exist")
    const isExistUser = await userModel.checkExist(reqBody.user_id)
    if (!isExistUser) throw new ApiError(StatusCodes.BAD_REQUEST, "User does not exist")
    const messageReader = await messageReaderModel.create(reqBody)
    return messageReader;
  } catch (error) {
    throw error;
  }
};

const messageReader = {
  create,
};

export default messageReader;