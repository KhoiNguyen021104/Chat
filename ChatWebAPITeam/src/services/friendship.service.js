// import { conversationsModel } from '~/models/conversationsModel'
import { StatusCodes } from 'http-status-codes'
import { friendshipModel, userModel } from '~/models'
import ApiError from '~/utils/apiErrors'
import { STATUS_FRIEND } from '~/utils/constants'
import { getNow } from '~/utils/formatters'

const create = async (reqBody) => {
  try {
    const isExistSender = await userModel.findOneById(reqBody.sender_id)
    const isExistReceiver = await userModel.findOneById(reqBody.receiver_id)
    if (!isExistSender || !isExistReceiver) throw new ApiError(StatusCodes.BAD_REQUEST, "User does not exist")
    const friend_request = await friendshipModel.findOneBetweenTwoUsers(reqBody.sender_id, reqBody.receiver_id)
    if (friend_request) {
      if (reqBody.sender_id === friend_request.sender_id) {
        if (friend_request.status === STATUS_FRIEND.REJECTED) {
          const updatedAt = friend_request.updatedAt ? new Date(friend_request.updatedAt).getTime() : null
          const now = Date.now()
          if (updatedAt) {
            const diffInMs = now - updatedAt
            const diffInHours = diffInMs / (1000 * 60 * 60)

            if (diffInHours <= 12) {
              const message = `You need to wait ${diffInHours < 1
                ? `${Math.ceil(diffInHours * 60)} more minute(s)`
                : `${Math.ceil(diffInHours)} more hour(s)`
                } before sending another friend request.`
              throw new ApiError(StatusCodes.BAD_REQUEST, message)
            }
          }
        }
        throw new ApiError(StatusCodes.BAD_REQUEST, "You have already sent a friend request to this user.")
      }
      if (friend_request.receiver_id === reqBody.sender_id) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "You have received a friend request from this user.")
      }
    }
    return await friendshipModel.create(reqBody)
  } catch (error) {
    throw error
  }
}

const getAllByUserId = async (userId, reqQuery) => {
  try {
    const user = await userModel.findOneById(userId)
    if (!user) return { message: 'User does not exist' }
    const friendships = await friendshipModel.getAllByUserId(userId, reqQuery)
    return friendships
  } catch (error) {
    throw error
  }
}

const update = async (id, updateData) => {
  try {
    const user = await userModel.findOneById(updateData.user_id)
    if (!user) throw new ApiError(StatusCodes.BAD_REQUEST, 'User does not exist')
    const friendship = await friendshipModel.findOneById(id)
    if (!friendship || (Array.isArray(friendship) && friendship?.length === 0)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Friendship does not exist')
    }
    if (updateData?.status) {
      if (updateData.user_id !== friendship.receiver_id) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'You can not reply to yourself')
      }
      if ((friendship.status === STATUS_FRIEND.ACCEPTED ||
        friendship.status === STATUS_FRIEND.REJECTED)
      ) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'This friend request has been replied')
      }
    }
    // if (updateData.status) {
    //   if (updateData.status !== STATUS_FRIEND.BLOCKED) {
    //     updateData.action_by_user_id = updateData.user_id
    //   } else {
    //     updateData.is_blocked = 1
    //   }
    // }
    updateData.action_by_user_id = updateData.user_id
    delete updateData.user_id
    const res = await friendshipModel.update(id, updateData)
    return res
  } catch (error) {
    throw error
  }
}

const findOneBetweenTwoUsers = async (reqQuery) => {
  try {
    const isExistUser1 = await userModel.checkExist(reqQuery.user1)
    if (!isExistUser1) throw new ApiError(StatusCodes.BAD_REQUEST, "User does not exist")
    const isExistUser2 = await userModel.checkExist(reqQuery.user1)
    if (!isExistUser2) throw new ApiError(StatusCodes.BAD_REQUEST, "User does not exist")
    const friendship = await friendshipModel.findOneBetweenTwoUsers(reqQuery.user1, reqQuery.user2)
    return friendship
  } catch (error) {
    throw error
  }
}

const friendships = {
  create,
  getAllByUserId,
  update,
  findOneBetweenTwoUsers
}

export default friendships
