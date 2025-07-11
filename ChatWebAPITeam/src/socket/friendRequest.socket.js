import { getIO } from "./socket";

export const emitFriendRequest = (receiverId, requestData) => {
  try {
    const io = getIO();
    io.to(receiverId).emit("receiveFriendRequest", requestData);
  } catch (error) {
    throw new Error(error.message);
  }
};


export const emitReplyFriendRequest = (receiverId, replyData) => {
  try {
    const io = getIO();
    io.to(receiverId).emit("replyFriendRequest", replyData);
  } catch (error) {
    throw new Error(error.message);
  }
};
