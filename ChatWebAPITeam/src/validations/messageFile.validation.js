/* eslint-disable no-console */
import Joi from "joi"
import { StatusCodes } from "http-status-codes"
import ApiError from "~/utils/apiErrors"
import { TYPE_MESSAGE } from "~/utils/constants"

const create = async (req, res, next) => {
  const correctCondition = Joi.array().items(
    Joi.object(
      {
        message_id: Joi.number().integer().positive().required(),
        file_name: Joi.string(),
        file_type: Joi.string(),
        file_size: Joi.number().positive(),
      }
    )
  )
  try {
    await correctCondition.validateAsync(JSON.parse(req.body.file_info), { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const messageFile = {
  create,
}

export default messageFile
