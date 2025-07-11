import { conversationMembersModel } from "~/models";

const create = async (reqBody) => {
  try {
    const members = await conversationMembersModel.create(reqBody)
    return members;
  } catch (error) {
    throw error;
  }
};

// const findOneById = async (_id) => {
//   try {
//     const conversation = await conversationsModel.findOneById(_id);
//     return conversation;
//   } catch (error) {
//     throw error;
//   }
// };

// const findAllByUserId = async (userId, page) => {
//   try {
//     const conversations = await conversationsModel.findAllByUserId(userId, page);
//     return conversations;
//   } catch (error) {
//     throw error;
//   }
// };

// const findOneBetweenTwoUser = async (userIds) => {
//   try {
//     const conversation = await conversationsModel.findOneBetweenTwoUsers(userIds);
//     return conversation;
//   } catch (error) {
//     throw error;
//   }
// };

const conversationMembers = {
  create,
  // findOneById,
  // findAllByUserId,
  // findOneBetweenTwoUser
};

export default conversationMembers;
