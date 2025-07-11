import { StatusCodes } from "http-status-codes";
import { messageFileService } from "~/services";

const create = async (req, res, next) => {
  try {
    const reqBody = JSON.parse(req.body.file_info)
    const messageFile = await messageFileService.create(reqBody, req.files);
    return res.status(StatusCodes.CREATED).json(messageFile);
  } catch (error) {
    next(error);
  }
};

const messageFile = {
  create,
};

export default messageFile;