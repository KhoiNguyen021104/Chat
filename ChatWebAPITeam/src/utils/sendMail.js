import { env } from '~/config/environment'
import nodemailer from 'nodemailer'

export const sendMail = async ({
  from = env.EMAIL_USER,
  to,
  subject,
  html
}) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 465,
    secure: true,
    service: 'gmail',
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_APP_PASSWORD
    }
  })
  const message = {
    from: from,
    to: to,
    subject: subject,
    html: html
  }
  const result = await transporter.sendMail(message)
  return result
}