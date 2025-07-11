/* eslint-disable no-console */
import Joi from "joi"
import { StatusCodes } from "http-status-codes"
import ApiError from "~/utils/apiErrors"
import { TYPE_MESSAGE } from "~/utils/constants"

const create = async (req, res, next) => {
  try {
    const objectValidate = {
      conversation_id: Joi.number().integer().positive().required(),
      sender_id: Joi.number().integer().positive().required(),
      type: Joi.string().valid(
        TYPE_MESSAGE.TEXT,
        TYPE_MESSAGE.DOCUMENT,
        TYPE_MESSAGE.MEDIA,
        TYPE_MESSAGE.LINK,
        TYPE_MESSAGE.EMOJI,
      ).required(),
    };
    if (req.body.type === TYPE_MESSAGE.TEXT) {
      objectValidate.content = Joi.string().min(1).max(1000).required();
    } else {
      objectValidate.content = Joi.string().optional().allow('');
    }
    const correctCondition = Joi.object(objectValidate);
    await correctCondition.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
  }
};


const findOneById = async (req, res, next) => {
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

// const findAllByUserId = async (req, res, next) => {
//   const correctCondition = Joi.object({
//     userId: Joi.string()
//       .required()
//       .pattern(OBJECT_ID_RULE)
//       .message(OBJECT_ID_RULE_MESSAGE).required()
//   })
//   try {
//     await correctCondition.validateAsync(req.params, { abortEarly: false })
//     next()
//   } catch (error) {
//     next(
//       new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
//     )
//   }
// }

const findAllByConversationId = async (req, res, next) => {
  const correctCondition = Joi.object({
    conversation_id: Joi.number().integer().positive().required(),
  })
  try {
    await correctCondition.validateAsync(req.params)
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

// const updateSeenAllMessageInOneConversation = async (req, res, next) => {
//   const correctCondition = Joi.object({
//     conversationId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
//     userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
//   })
//   try {
//     await correctCondition.validateAsync({ ...req.params, ...req.body }, { abortEarly: false })
//     next()
//   } catch (error) {
//     next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
//   }
// }

const update = async (req, res, next) => {
  const correctCondition = Joi.object({
    id: Joi.number().integer().positive().required(),
    is_pinned: Joi.boolean(),
    is_revoked: Joi.boolean(),
    is_sender_deleted: Joi.boolean(),
    is_receiver_deleted: Joi.boolean()
  })
  try {
    await correctCondition.validateAsync({ ...req.params, ...req.body }, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

// const uploadFile = async (req, res, next) => {
//   const correctCondition = Joi.object({
//     _id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required()
//   })
//   try {
//     await correctCondition.validateAsync({ ...req.params }, { abortEarly: false })
//     next()
//   } catch (error) {
//     next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
//   }
// }

// const updateMessageFiles = async (req, res, next) => {
//   const correctCondition = Joi.object({
//     _id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
//     files: Joi.array().items(
//       Joi.object({
//         url: Joi.string(),
//         type: Joi.string(),
//         name: Joi.string(),
//         size: Joi.number(),
//       }
//       )
//     )
//   })
//   try {
//     await correctCondition.validateAsync({ ...req.params, ...req.body }, { abortEarly: false })
//     next()
//   } catch (error) {
//     next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
//   }
// }

const message = {
  create,
  findOneById,
  findAllByConversationId,
  // findAllByUserId,
  // updateSeenAllMessageInOneConversation,
  // uploadFile,
  // updateMessageFiles,
  update
}

export default message
