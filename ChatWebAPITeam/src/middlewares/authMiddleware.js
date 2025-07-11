/* eslint-disable no-console */
import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'

import { JWTProvider } from '~/providers/jwtProvider'


const isAuthorized = async (req, res, next) => {
  const accessTokenFromCookie = req.cookies?.accessToken

  if (!accessTokenFromCookie) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized! (Access Token not found)' })
    return
  }

  try {
    const accessTokenDecoded = await JWTProvider.verifyToken(
      accessTokenFromCookie,
      env.ACCESS_TOKEN_SECRET_SIGNATURE
    )
    req.jwtDecoded = accessTokenDecoded
    next()
  } catch (error) {
    console.log('Error from middleware: ', error)
    if (error.message?.includes('jwt expired')) {
      res.status(StatusCodes.GONE).json({ message: 'Need to refresh token' })
      return
    }
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized! Please login' })
  }
}

export const authMiddleware = {
  isAuthorized
}