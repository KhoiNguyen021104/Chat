import express from "express";
import { userRoute } from "./user.route";
import { friendshipRoute } from "./friendship.route";
import { conversationRoute } from "./conversation.route";
import { conversationMembersRoute } from "./conversationMember.route";
import { messageRoute } from "./message.route";
import { messageFileRoute } from "./messageFile.route";
import { messageReactionRoute } from "./messageReaction.route";
import { messageReaderRoute } from "./messageReader.route";
import { deletedMessageRoute } from "./messageDelete.route";

const Router = express.Router();

Router.use('/user', userRoute)
Router.use('/friendship', friendshipRoute)
Router.use('/conversation', conversationRoute)
Router.use('/conversation-members', conversationMembersRoute)
Router.use('/message', messageRoute)
Router.use('/message_file', messageFileRoute)
Router.use('/message_reaction', messageReactionRoute)
Router.use('/message_reader', messageReaderRoute)
Router.use('/deleted_message', deletedMessageRoute)


export const APIs_V1 = Router;
