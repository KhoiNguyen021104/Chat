import { StatusCodes } from 'http-status-codes'
import { JWTProvider } from '~/providers/jwtProvider'
import { env } from '~/config/environment'
import ms from 'ms'
import { comparePassword } from '~/utils/algorithms'
import { sendMail } from '~/utils/sendMail'
import { userService } from '~/services'
import { userModel } from '~/models'
import ApiError from '~/utils/apiErrors'

const create = async (req, res, next) => {
  try {
    const user = await userService.create(req.body)
    if (user) {
      await sendMail({
        to: user.email,
        subject: "Verify your account",
        html: `<h1>OTP: ${user.otp}<h1>
        <p>Your otp code will expire in 5 minutes</p>`
      })
    }
    res.status(StatusCodes.OK).json(user)
  } catch (error) {
    next(error)
  }
}

const loginGoogle = async (req, res, next) => {
  try {
    console.log('🚀 ~ loginGoogle ~ req.body:', req.body)
    let user = await userModel.findOneByEmail(req.body.email)
    console.log('🚀 ~ loginGoogle ~ user:', user)
    if (user && user.provider !== 'google') throw new ApiError(StatusCodes.BAD_REQUEST, "User already exist")
    user = await userService.create(req.body)
    const accessToken = await JWTProvider.generateToken(
      user,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      '1h'
    )
    const refreshToken = await JWTProvider.generateToken(
      user,
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      '14 days'
    )
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })
    // if (!user.status || user.status === 'offline') {
    //   await userModel.update(user.id, { status: 'online' })
    //   user.status = 'online'
    // }
    user.status = 'online'
    return res.status(StatusCodes.OK).json(user)
  } catch (error) {
    next(error)
    // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

const login = async (req, res, next) => {
  try {
    const user = await userModel.findOneByUserName(req.body.username)
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Your username incorrect!' })
    }
    const password = req.body.password
    const hashedPassword = user.password
    const resComparePassword = await comparePassword(password, hashedPassword)
    if (!resComparePassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Your password incorrect!' })
    }
    delete user.password
    delete user.otp
    delete user.otp_expire
    delete user.updated_at
    const accessToken = await JWTProvider.generateToken(
      user,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      '1h'
    )
    const refreshToken = await JWTProvider.generateToken(
      user,
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      '14 days'
    )
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })
    // await userModel?.update(user.id, { status: 'online' })
    user.status = 'online'
    return res.status(StatusCodes.OK).json(user)
  } catch (error) {
    next(error)
  }
}

const logout = async (req, res) => {
  try {
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    return res.status(StatusCodes.OK).json({ message: 'Logout success!' })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

const refreshToken = async (req, res) => {
  try {
    const refreshTokenFromCookie = req.cookies?.refreshToken

    const refreshTokenDecoded = await JWTProvider.verifyToken(
      refreshTokenFromCookie,
      env.REFRESH_TOKEN_SECRET_SIGNATURE
    )

    const userInfo = {
      id: refreshTokenDecoded.id,
      displayName: refreshTokenDecoded.displayName,
      email: refreshTokenDecoded.email,
      avatar: refreshTokenDecoded.avatar
    }

    const accessToken = await JWTProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      '1h'
    )
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    return res.status(StatusCodes.OK).json({ accessToken })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json('Refresh token failed')
  }
}

const access = async (req, res) => {
  try {
    const userInfo = {
      id: req.jwtDecoded.id,
      displayName: req.jwtDecoded.displayName,
      email: req.jwtDecoded.email,
      avatar: req.jwtDecoded.avatar
    }
    res.status(StatusCodes.OK).json(userInfo)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

const getAll = async (req, res, next) => {
  try {
    const users = await userService.getAll(req.query)
    res.status(StatusCodes.OK).json(users)
  } catch (error) {
    next(error)
  }
}

const findOneById = async (req, res, next) => {
  try {
    const user = await userModel.findOneById(req.params.id)
    if (!user) return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' })
    return res.status(StatusCodes.OK).json(user)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const user = await userService.update(req.params.id, req.body, req.files)
    return res.status(StatusCodes.OK).json(user)
  } catch (error) {
    next(error)
  }
}

const findUsersByKeyword = async (req, res, next) => {
  try {
    const users = await userService.findUsersByKeyword(req.query.keyword)
    return res.status(StatusCodes.OK).json(users)
  } catch (error) {
    next(error)
  }
}

const user = {
  create,
  login,
  loginGoogle,
  logout,
  refreshToken,
  access,
  getAll,
  findOneById,
  update,
  findUsersByKeyword
}


export default user