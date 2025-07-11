import express from "express";
import { messageReactionController } from "~/controllers";
import { messageReactionValidation } from "~/validations";

const Router = express.Router();

Router.route('/')
  .post(messageReactionValidation.create, messageReactionController.create)

Router.route('/:id')
  .put(messageReactionValidation.update, messageReactionController.update)
  .delete(messageReactionValidation.deleteOne, messageReactionController.deleteOne)
export const messageReactionRoute = Router;
