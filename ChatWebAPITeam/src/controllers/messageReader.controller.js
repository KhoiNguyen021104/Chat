import { StatusCodes } from "http-status-codes";
import { messageReaderService } from "~/services";

const create = async (req, res, next) => {
  try {
    const messageReader = await messageReaderService.create(req.body);
    return res.status(StatusCodes.CREATED).json(messageReader);
  } catch (error) {
    next(error);
  }
};

const messageReader = {
  create,
};

export default messageReader;