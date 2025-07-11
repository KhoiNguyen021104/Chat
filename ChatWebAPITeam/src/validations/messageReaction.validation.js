/* eslint-disable no-console */
import Joi from "joi"
import { StatusCodes } from "http-status-codes"
import ApiError from "~/utils/apiErrors"

const create = async (req, res, next) => {
  const correctCondition = Joi.object({
    message_id: Joi.number().integer().positive().required(),
    user_id: Joi.number().integer().positive().required(),
    reaction: Joi.string().required(),
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const update = async (req, res, next) => {
  const correctCondition = Joi.object({
    id: Joi.number().integer().positive().required(),
    reaction: Joi.string().required(),
  })
  try {
    await correctCondition.validateAsync({ ...req.params, ...req.body }, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const deleteOne = async (req, res, next) => {
  const correctCondition = Joi.object({
    id: Joi.number().integer().positive().required(),
  })
  try {
    await correctCondition.validateAsync(req.params)
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const messageReaction = {
  create,
  update,
  deleteOne
}

export default messageReaction
