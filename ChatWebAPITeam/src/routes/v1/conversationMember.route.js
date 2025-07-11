import express from "express";
import { conversationMembersController } from "~/controllers";
import { conversationMembersValidation } from "~/validations";

const Router = express.Router();

Router.route('/')
  .post(conversationMembersValidation.create, conversationMembersController.create)

// Router.route('/between-two-users')
//   .get(conversationMembersValidation.findOneBetweenTwoUser, conversationMembersController.findOneBetweenTwoUser)

// Router.route('/by-user/:userId')
//   .get(conversationMembersValidation.findAllByUserId, conversationMembersController.findAllByUserId)

// Router.route('/:_id')
//   .get(conversationMembersValidation.findOneById, conversationMembersController.findOneById)

export const conversationMembersRoute = Router;
