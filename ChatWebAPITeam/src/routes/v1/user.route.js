import express from "express";
import { userController } from "~/controllers";
import { authMiddleware } from "~/middlewares/authMiddleware";
import { multerUploadMiddleWare } from "~/middlewares/multerUploadMiddleware";
import verifyGGTokenMiddleware from "~/middlewares/verifyGGTokenMiddleware";
import { userValidation } from "~/validations";

const Router = express.Router();

Router.route('/')
  .get(userController.getAll)
  .post(userValidation.create, userController.create)

Router.route('/login')
  .post(userValidation.login, userController.login)

Router.route('/login/google')
  .post(verifyGGTokenMiddleware, userValidation.create, userController.loginGoogle)

Router.route('/logout')
  .delete(userController.logout)

Router.route('/refresh_token')
  .put(userController.refreshToken)

Router.route('/access')
  .get(authMiddleware.isAuthorized, userController.access)

Router.route('/:id')
  .get(userValidation.findOneById, userController.findOneById)
  .put(multerUploadMiddleWare.upload.array('avatar', 1), userValidation.update, userController.update)



export const userRoute = Router;
