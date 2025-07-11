/* eslint-disable no-useless-catch */
/* eslint-disable no-console */

import { StatusCodes } from "http-status-codes";
import { messageFileModel } from "~/models";
import ApiError from "~/utils/apiErrors";

const create = async (reqBody, files) => {
  try {
    const messageFiles = await Promise.all(files.map((file, index) => messageFileModel.create(reqBody[index], file)));
    if (!messageFiles) if (!isExist) throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Create failed!")
    return messageFiles;
  } catch (error) {
    throw error;
  }
};

const messageFile = {
  create,
};

export default messageFile;