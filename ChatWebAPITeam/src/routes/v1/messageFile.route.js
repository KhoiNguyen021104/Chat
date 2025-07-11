import express from "express";
import { messageFileController } from "~/controllers";
import { multerUploadMiddleWare } from "~/middlewares/multerUploadMiddleware";
import { messageFileValidation } from "~/validations";

const Router = express.Router();

Router.route('/')
  .post(
    multerUploadMiddleWare.upload.array('message_file', 5),
    messageFileValidation.create,
    messageFileController.create
  )
export const messageFileRoute = Router;
