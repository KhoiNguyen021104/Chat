import { StatusCodes } from "http-status-codes"
import { userModel } from "~/models"
import { cloudinaryProvider } from "~/providers/cloudinary"
import { comparePassword, generateOTP, hashPassword, randomString } from "~/utils/algorithms"
import ApiError from "~/utils/apiErrors"
import { CLOUDINARY_FOLDER } from "~/utils/constants"
import { getNow } from "~/utils/formatters"

const create = async (reqBody) => {
  try {
    if (reqBody.email && !reqBody.provider) {
      const isExist = await userModel.findOneByEmail(reqBody.email)
      if (isExist) throw new ApiError(StatusCodes.BAD_REQUEST, "Email already exists")
    }

    if (reqBody?.username) {
      const isExist = await userModel.findOneByUserName(reqBody?.username)
      if (isExist) throw new ApiError(StatusCodes.BAD_REQUEST, "Username already exists")
    }

    if (reqBody?.password) {
      const hashedPassword = await hashPassword(reqBody?.password)
      reqBody.password = hashedPassword
    }
    const otp = generateOTP()
    const otp_expire = new Date(Date.now() + 5 * 60 * 1000)
    reqBody.otp = otp
    reqBody.otp_expire = otp_expire
    if (!reqBody.display_name) {
      reqBody.display_name = 'User' + randomString()
    }
    const user = await userModel.create(reqBody)
    user.otp = otp
    return user
  } catch (error) {
    throw error
  }
}

const getAll = async (reqQuery) => {
  console.log('🚀 ~ getAll ~ reqQuery:', reqQuery)
  try {
    if (!reqQuery.not_friend || !reqQuery.user_id) {
      console.log(1);
      return await userModel.getAll(reqQuery)
    }
    console.log(2);
    return await userModel.getAllStrangerByUserId(reqQuery.user_id, reqQuery)
  } catch (error) {
    throw error
  }
}

const update = async (id, updateData, files) => {
  try {
    const user = await userModel.findOneById(id, true)
    if (!user) throw new ApiError(StatusCodes.BAD_REQUEST, "User does not exist")
    if (files) {
      let uploadedFiles = await cloudinaryProvider.uploadMultipleFiles(files, CLOUDINARY_FOLDER.AVATAR.PERSONAL)
      if (uploadedFiles?.length > 0) {
        updateData.avatar = uploadedFiles[0]
      }
    }
    if (updateData.otp) {
      if (user.isVerified) throw new ApiError(StatusCodes.BAD_REQUEST, "User already verified")
      const date1 = new Date()
      const date2 = new Date(user.otp_expire)
      const diffInMs = Math.abs(date1.getTime() - date2.getTime())
      const diffInMinutes = diffInMs / (1000 * 60)
      if (diffInMinutes > 5) throw new ApiError(StatusCodes.BAD_REQUEST, "OTP expired")
      delete updateData.otp
      delete updateData.otp_expire
      updateData.is_verified = true
    }
    if (updateData.status) {
      if (updateData.status === 'offline') {
        updateData.last_online_at = getNow()
      }
    }
    if (updateData.new_password && updateData.current_password) {
      const isCorrectPassword = await comparePassword(updateData.current_password, user?.password)
      if (!isCorrectPassword) throw new ApiError(StatusCodes.BAD_REQUEST, "Current password is incorrect")
      const hashedPassword = await hashPassword(updateData.new_password)
      updateData.password = hashedPassword
      delete updateData.new_password
      delete updateData.current_password
    }
    const res = await userModel.update(id, updateData)
    return res
  } catch (error) {
    throw error
  }
}

const findUsersByKeyword = async (keyword) => {
  try {
    const users = await userModel.findUsersByKeyword(keyword)
    return users
  } catch (error) {
    throw error
  }
}

const user = {
  create,
  getAll,
  update,
  findUsersByKeyword
}


export default user