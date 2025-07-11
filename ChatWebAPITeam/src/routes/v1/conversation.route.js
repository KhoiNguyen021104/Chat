import express from "express";
import { conversationController } from "~/controllers";
import { multerUploadMiddleWare } from "~/middlewares/multerUploadMiddleware";
import { conversationValidation } from "~/validations";

const Router = express.Router();

Router.route('/')
  .post(
    multerUploadMiddleWare.upload.single('group_avatar'),
    conversationValidation.create,
    conversationController.create
  )

Router.route('/:id')
  .get(conversationValidation.findOneById, conversationController.findOneById)
  .put(conversationValidation.update, conversationController.update)

Router.route('/user/:user_id')
  .get(conversationValidation.findAllByUserId, conversationController.findAllByUserId)


export const conversationRoute = Router;
