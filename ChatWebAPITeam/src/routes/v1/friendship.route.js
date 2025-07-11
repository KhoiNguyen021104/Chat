import express from "express";
import { friendshipController } from "~/controllers";
import { friendshipValidation } from "~/validations";

const Router = express.Router();

Router.route('/')
  .post(friendshipValidation.create, friendshipController.create)

Router.route('/user/:userId')
  .get(friendshipValidation.getAllByUserId, friendshipController.getAllByUserId)

Router.route('/two-users/')
  .get(friendshipValidation.findOneBetweenTwoUsers, friendshipController.findOneBetweenTwoUsers)

Router.route('/:id')
  .put(friendshipValidation.update, friendshipController.update)

export const friendshipRoute = Router;
