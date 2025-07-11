import { StatusCodes } from "http-status-codes";
import { messageReactionService } from "~/services";

const create = async (req, res, next) => {
  try {
    const messageReaction = await messageReactionService.create(req.body);
    return res.status(StatusCodes.CREATED).json(messageReaction);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const resUpdated = await messageReactionService.update(req.params.id, req.body);
    return res.status(StatusCodes.CREATED).json(resUpdated);
  } catch (error) {
    next(error);
  }
};

const deleteOne = async (req, res, next) => {
  try {
    const resDeleted = await messageReactionService.deleteOne(req.params.id);
    return res.status(StatusCodes.OK).json(resDeleted);
  } catch (error) {
    next(error);
  }
};

const messageReaction = {
  create,
  update,
  deleteOne
};

export default messageReaction;