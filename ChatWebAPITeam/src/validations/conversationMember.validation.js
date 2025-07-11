/* eslint-disable no-console */
import Joi, { any } from "joi";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/apiErrors";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";
import { TYPE_CONVERSATION } from "~/utils/constants";

const create = async (req, res, next) => {
  const correctCondition = Joi.object({
    conversation_id: Joi.number().integer().positive().required(),
    user_id: Joi.number().integer().positive().required(),
    role: Joi.string().valid('owner', 'member'),
  });

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    );
  }
};

// const findAllByConversationId = async (req, res, next) => {
//   const correctCondition = Joi.object({
//     conversation_id: Joi.number().integer().positive().required(),
//   });
//   try {
//     await correctCondition.validateAsync(req.params, { abortEarly: false });
//     next();
//   } catch (error) {
//     next(
//       new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
//     );
//   }
// };

// const findAllByUserId = async (req, res, next) => {
//   const correctCondition = Joi.object({
//     userId: Joi.string()
//       .required()
//       .pattern(OBJECT_ID_RULE)
//       .message(OBJECT_ID_RULE_MESSAGE).required(),
//     page: Joi.number().default(1),
//   });
//   try {
//     await correctCondition.validateAsync({
//       ...req.params,
//       ...req.query
//     }, { abortEarly: false });
//     next();
//   } catch (error) {
//     next(
//       new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
//     );
//   }
// };

const conversationMember = {
  create,
  // findAllByConversationId,
  // findAllByUserId,
};

export default conversationMember