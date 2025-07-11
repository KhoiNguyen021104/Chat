import { StatusCodes } from "http-status-codes"
import { conversationMembersModel, conversationModel } from "~/models"
import { cloudinaryProvider } from "~/providers/cloudinary"
import ApiError from "~/utils/apiErrors"
import { CLOUDINARY_FOLDER, TYPE_CONVERSATION } from "~/utils/constants"

const create = async (reqBody, group_avatar) => {
  try {
    if (reqBody.type === TYPE_CONVERSATION.PERSONAL) {
      const isExist = await conversationModel.findOneByMembers(reqBody)
      if (isExist) throw new ApiError(StatusCodes.BAD_REQUEST, 'Conversation already exist')
    }
    const { members } = reqBody
    const owner = reqBody.owner || null
    delete reqBody.members
    delete reqBody.owner
    let uploadedAvatar = null
    if (reqBody.type === TYPE_CONVERSATION.GROUP) {
      uploadedAvatar = await cloudinaryProvider.uploadSingleFile(group_avatar, CLOUDINARY_FOLDER.AVATAR.GROUP);
      console.log('🚀 ~ create ~ uploadedAvatar:', uploadedAvatar)
      reqBody.group_avatar = uploadedAvatar
    }
    const conversation = await conversationModel.create(reqBody)
    if (conversation.id) {
      const conversation_members = await Promise.all(
        members?.map(member =>
          conversationMembersModel.create({
            conversation_id: conversation.id,
            user_id: member,
            role: conversation.type === TYPE_CONVERSATION.GROUP
              && owner && owner === member ? 'owner' : 'member'
          })
        )
      )
      conversation.members = conversation_members
      if (reqBody.type === TYPE_CONVERSATION.GROUP && uploadedAvatar) {
        conversation.group_avatar = uploadedAvatar
      }
      return conversation
    }
  } catch (error) {
    throw error
  }
}

const findOneById = async (_id) => {
  try {
    const conversation = await conversationModel.findOneById(_id)
    return conversation
  } catch (error) {
    throw error
  }
}

const findAllByUserId = async (userId, page) => {
  try {
    const conversations = await conversationModel.findAllByUserId(userId, page)
    return conversations
  } catch (error) {
    throw error
  }
}

const update = async (id, updateData) => {
  try {
    const resUpdated = await conversationModel.update(id, updateData)
    return resUpdated
  } catch (error) {
    throw error
  }
}

const conversation = {
  create,
  findOneById,
  findAllByUserId,
  update
}

export default conversation