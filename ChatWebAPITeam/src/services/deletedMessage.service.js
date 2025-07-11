/* eslint-disable no-useless-catch */
/* eslint-disable no-console */

import { StatusCodes } from "http-status-codes";
import { messageModel, deletedMessageModel, userModel } from "~/models";
import ApiError from "~/utils/apiErrors";

const create = async (reqBody) => {
  try {
    const isExistMessage = await messageModel.checkExist(reqBody.message_id)
    if (!isExistMessage) throw new ApiError(StatusCodes.BAD_REQUEST, "Message does not exist")
    const isExistUser = await userModel.checkExist(reqBody.user_id)
    if (!isExistUser) throw new ApiError(StatusCodes.BAD_REQUEST, "User does not exist")
    const res = await deletedMessageModel.create(reqBody)
    return res;
  } catch (error) {
    throw error;
  }
};


const deleteOne = async (id) => {
  try {
    const isExist = await deletedMessageModel.findOneById(id)
    if (!isExist) throw new ApiError(StatusCodes.BAD_REQUEST, "Reaction does not exist")
    const res = await deletedMessageModel.deleteOne(id)
    return res;
  } catch (error) {
    throw error;
  }
};

const deletedMessage = {
  create,
  deleteOne
};

export default deletedMessage;