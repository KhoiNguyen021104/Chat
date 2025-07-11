import express from "express";
import { deletedMessageController } from "~/controllers";
import { deletedMessageValidation } from "~/validations";

const Router = express.Router();

Router.route('/')
  .post(deletedMessageValidation.create, deletedMessageController.create)

Router.route('/:id')
  .delete(deletedMessageValidation.deleteOne, deletedMessageController.deleteOne)
export const deletedMessageRoute = Router;
