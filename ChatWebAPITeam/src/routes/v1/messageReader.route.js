import express from "express";
import { messageReaderController } from "~/controllers";
import { messageReaderValidation } from "~/validations";

const Router = express.Router();

Router.route('/')
  .post(messageReaderValidation.create, messageReaderController.create)
export const messageReaderRoute = Router;
