import { StatusCodes } from "http-status-codes";
import { conversationMembersService } from "~/services";

const create = async (req, res, next) => {
  try {
    const conversation = await conversationMembersService.create(req.body);
    res.status(StatusCodes.CREATED).json(conversation);
  } catch (error) {
    next(error);
  }
};

// const findOneById = async (req, res, next) => {
//   try {
//     const conversation = await conversationMembersService.findOneById(req.params._id);
//     return res.status(StatusCodes.OK).json(conversation);
//   } catch (error) {
//     next(error);
//   }
// };

// const findAllByUserId = async (req, res, next) => {
//   try {
//     const conversation = await conversationMembersService.findAllByUserId(req.params.userId, req.query.page);
//     return res.status(StatusCodes.OK).json(conversation);
//   } catch (error) {
//     next(error);
//   }
// };

// const findOneBetweenTwoUser = async (req, res, next) => {
//   try {
//     const userIds = [req.query.userId1, req.query.userId2]
//     const conversation = await conversationMembersService.findOneBetweenTwoUser(userIds);
//     return res.status(StatusCodes.OK).json(conversation);
//   } catch (error) {
//     next(error);
//   }
// };

const conversationMembers = {
  create,
  // findOneById,
  // findAllByUserId,
  // findOneBetweenTwoUser
};


export default conversationMembers;