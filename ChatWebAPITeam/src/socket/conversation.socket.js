import { getIO, userSockets } from "./socket";

const emitNewConversation = (userId, conversation) => {
  try {
    const io = getIO();
    const socketIds = userSockets.get(userId)
    if (socketIds) {
      for (const socketId of socketIds?.values()) {
        io.to(socketId).emit("receiveNewConversation", conversation);
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export const conversationSocket = {
  emitNewConversation
}