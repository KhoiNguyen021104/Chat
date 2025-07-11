import express from "express";
import { messageController } from "~/controllers";
import { messageValidation } from "~/validations";

const Router = express.Router();

Router.route('/')
  .post(messageValidation.create, messageController.create)

Router.route('/conversation/:conversation_id')
  .get(messageValidation.findAllByConversationId, messageController.findAllByConversationId)

Router.route('/:id')
  .get(messageValidation.findOneById, messageController.findOneById)
  .put(messageValidation.update, messageController.update)

export const messageRoute = Router;
