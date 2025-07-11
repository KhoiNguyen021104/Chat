/* eslint-disable no-console */
import Joi from "joi"
import { StatusCodes } from "http-status-codes"
import ApiError from "~/utils/apiErrors"
import { STATUS_FRIEND } from "~/utils/constants"

const create = async (req, res, next) => {
  const correctCondition = Joi.object({
    sender_id: Joi.number().integer().positive().required(),
    receiver_id: Joi.number().integer().positive().required(),
    status: Joi.number().valid(
      STATUS_FRIEND.ACCEPTED,
      STATUS_FRIEND.PENDING,
      STATUS_FRIEND.REJECTED)
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    )
  }
}

const getAllByUserId = async (req, res, next) => {
  const correctCondition = Joi.object({
    userId: Joi.number().integer().positive().required(),
  })
  try {
    await correctCondition.validateAsync(req.params, { abortEarly: false })
    next()
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    )
  }
}

const update = async (req, res, next) => {
  const correctCondition = Joi.object({
    status: Joi.number().valid(
      STATUS_FRIEND.ACCEPTED,
      STATUS_FRIEND.REJECTED,
    ),
    is_blocked: Joi.boolean(),
    user_id: Joi.number().integer().positive().required()
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    )
  }
}

const findOneBetweenTwoUsers = async (req, res, next) => {
  const correctCondition = Joi.object({
    user1: Joi.number().integer().positive().required(),
    user2: Joi.number().integer().positive().required()
  })
  try {
    await correctCondition.validateAsync(req.query, { abortEarly: false })
    next()
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    )
  }
}

const friendship = {
  create,
  getAllByUserId,
  update,
  findOneBetweenTwoUsers
}

export default friendship
