import bcrypt from 'bcrypt'
import crypto from 'crypto'
import ApiError from './apiErrors'

const saltRounds = 10

export async function hashPassword(password) {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    return hashedPassword
  } catch (err) {
    console.error(err)
  }
}

export async function comparePassword(password, hashedPassword) {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword)
    return isMatch
  } catch (err) {
    console.error(err)
  }
}

export const generateOTP = () => {
  const otp = crypto.randomInt(1000, 10000);
  return otp.toString();
}


export const getFields = (data) => {
  if (typeof data !== 'object' || data === null) {
    throw new ApiError('Input must be an object')
  }
  return Object.keys(data).map(field => `${field} = ?`).join(", ");
}

export const getValues = (data) => {
  if (typeof data !== 'object' || data === null) {
    throw new ApiError('Input must be an object')
  }
  return Object.values(data)
}

export const randomString = (length = 10) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};