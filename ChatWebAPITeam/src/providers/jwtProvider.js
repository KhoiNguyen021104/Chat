import JWT from 'jsonwebtoken'

/**
 * + userInfo:
 * + secretSignature(privateKey): dạng random string
 * + tokenLife: thời gian sống của token
 */
const generateToken = async (userInfo, secretSignature, tokenLife) => {
  try {
    return JWT.sign(userInfo, secretSignature, { algorithm: 'HS256', expiresIn: tokenLife })
  } catch (error) {
    throw new Error(error)
  }
}

const verifyToken = async (token, secretSignature ) => {
  try {
    return JWT.verify(token, secretSignature)
  } catch (error) {
    throw new Error(error)
  }
}

export const JWTProvider = {
  generateToken,
  verifyToken
}
