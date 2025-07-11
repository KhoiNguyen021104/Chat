import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/apiErrors";

const create = async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().email(),
    display_name: Joi.string(),
    avatar: Joi.string(),
    provider: Joi.string(),
    username: Joi.string(),
    password: Joi.string(),
    status: Joi.string().valid("offline", "online").default("offline"),
    otp: Joi.string(),
    otp_expire: Joi.date(),
    is_verified: Joi.boolean(),
  });

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
  }
};

const login = async (req, res, next) => {
  const correctCondition = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
  }
};

const findOneById = async (req, res, next) => {
  const correctCondition = Joi.object({
    id: Joi.number().integer().positive().required(),
  });
  try {
    await correctCondition.validateAsync(req.params, { abortEarly: false });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
  }
};

const update = async (req, res, next) => {
  const correctCondition = Joi.object({
    id: Joi.number().integer().positive().required(),
    email: Joi.string().email(),
    display_name: Joi.string(),
    avatar: Joi.string(),
    bio: Joi.string(),
    password: Joi.string(),
    new_password: Joi.string(),
    current_password: Joi.string(),
    status: Joi.string().valid("offline", "online"),
    otp: Joi.string(),
  });
  try {
    await correctCondition.validateAsync({ ...req.params, ...req.body }, { abortEarly: false });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
  }
};

const user = {
  create,
  login,
  findOneById,
  update,
};

export default user;
