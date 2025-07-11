import { StatusCodes } from "http-status-codes"
import { friendshipModel } from "~/models"
import { conversationService, friendshipService } from "~/services"
import { conversationSocket } from "~/socket/conversation.socket"
import { emitFriendRequest, emitReplyFriendRequest } from "~/socket/friendRequest.socket"
import { STATUS_FRIEND, TYPE_CONVERSATION } from "~/utils/constants"

const create = async (req, res, next) => {
  try {
    let friendship = await friendshipService.create(req.body)
    return res.status(StatusCodes.CREATED).json(friendship)
  } catch (error) {
    next(error)
  }
}

const getAllByUserId = async (req, res, next) => {
  try {
    const friendships = await friendshipService.getAllByUserId(req.params.userId, req.query)
    if (Array.isArray(friendships) && friendships.length === 0) {
      return res.status(StatusCodes.NO_).json({ message: "No friend requests" })
    }
    return res.status(StatusCodes.OK).json(friendships)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const updatedResult = await friendshipService.update(req.params.id, req.body)
    if (updatedResult) {
      const friendship = await friendshipModel.findOneById(req.params.id)
      if (friendship.sender_id && req.body.status && friendship.status === STATUS_FRIEND.ACCEPTED) {
        const conversation = await conversationService.create({
          type: TYPE_CONVERSATION.PERSONAL,
          members: [friendship.sender_id, friendship.receiver_id]
        })
        if (conversation) {
          // emitReplyFriendRequest(friendship.sender_id, { friendship, conversation })
          conversationSocket.emitNewConversation(friendship.receiver_id, conversation)
        }
      }
      return res.status(StatusCodes.OK).json(friendship)
    }
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "Update failed" })
  } catch (error) {
    next(error)
  }
}

const findOneBetweenTwoUsers = async (req, res, next) => {
  try {
    const friendship = await friendshipService.findOneBetweenTwoUsers(req.query)
    return res.status(StatusCodes.CREATED).json(friendship)
  } catch (error) {
    next(error)
  }
}

const friendship = {
  create,
  getAllByUserId,
  update,
  findOneBetweenTwoUsers
}

export default friendship