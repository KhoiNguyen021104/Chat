/* eslint-disable no-console */
import Joi, { any } from "joi";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/apiErrors";
import { TYPE_CONVERSATION } from "~/utils/constants";

const create = async (req, res, next) => {
  let condition = {
    type: Joi.string().valid(TYPE_CONVERSATION.PERSONAL, TYPE_CONVERSATION.GROUP).required(),
    members: Joi.array().items(Joi.number().integer().positive()).min(2),
    group_name: Joi.string().max(50),
    group_avatar: Joi.string(),
  }
  let validateData = { ...req.body }
  if (!req.body.type) {
    condition = {
      ...condition,
      members: Joi.array().items(Joi.number().integer().positive()).min(3).required(),
      owner: Joi.number().integer().positive().required()
    }
    validateData = JSON.parse(req.body.group_info)
  }
  const correctCondition = Joi.object(condition);
  try {
    await correctCondition.validateAsync(validateData, { abortEarly: false });
    next();
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    );
  }
};

const findOneById = async (req, res, next) => {
  const correctCondition = Joi.object({
    id: Joi.number().integer().positive().required()
  });
  try {
    await correctCondition.validateAsync(req.params);
    next();
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    );
  }
};

const findAllByUserId = async (req, res, next) => {
  const correctCondition = Joi.object({
    user_id: Joi.number().integer().positive().required(),
  });
  try {
    await correctCondition.validateAsync(req.params);
    next();
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    );
  }
};

const update = async (req, res, next) => {
  const correctCondition = Joi.object({
    id: Joi.number().integer().positive().required(),
    group_name: Joi.string().max(50),
    group_avatar: Joi.string(),
    last_message_id: Joi.number().integer().positive()
  });
  try {
    await correctCondition.validateAsync(req.params);
    next();
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    );
  }
}

const conversation = {
  create,
  findOneById,
  findAllByUserId,
  update
};

export default conversation