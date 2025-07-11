import { StatusCodes } from "http-status-codes";
import { deletedMessageService } from "~/services";

const create = async (req, res, next) => {
  try {
    const deletedMessage = await deletedMessageService.create(req.body);
    return res.status(StatusCodes.CREATED).json(deletedMessage);
  } catch (error) {
    next(error);
  }
};

const deleteOne = async (req, res, next) => {
  try {
    const resDeleted = await deletedMessageService.deleteOne(req.params.id);
    return res.status(StatusCodes.OK).json(resDeleted);
  } catch (error) {
    next(error);
  }
};

const deletedMessage = {
  create,
  deleteOne
};

export default deletedMessage;