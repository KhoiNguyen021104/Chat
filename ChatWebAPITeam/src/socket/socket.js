import { Server } from "socket.io";
import { messageModel } from "~/models";
import { userService } from "~/services";
import { TYPE_MESSAGE } from "~/utils/constants";

let io;
const userSockets = new Map();
const initSocket = (server, corsOptions) => {
  io = new Server(server, { cors: corsOptions });

  io.on("connection", async (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("registerUser", async (userId) => {
      await userService.update(userId, { status: 'online' })
      if (!userSockets.has(userId)) {
        userSockets.set(userId, new Set());
      }
      userSockets.get(userId).add(socket.id);
      socket.join(userId);
      console.log(`User ${userId} registered with socket ${socket.id}`);
    });

    socket.on("joinConversation", async ({ userId, conversationId }) => {
      socket.join(conversationId);
      console.log(`User ${userId} joined conversation ${conversationId}`);
    });

    socket.on("sendNewConversation", (conversation) => {
      if (conversation.members) {
        conversation.members.forEach(member => {
          socket.to(member.user_id).emit("receiveNewConversation", conversation);
        });
      }
    });

    socket.on("sendMessage", async ({ message, receiverId }) => {
      const newMessage = await messageModel.findOneById(message.id);
      if (newMessage) {
        if (newMessage.type === TYPE_MESSAGE.MEDIA || message.type === TYPE_MESSAGE.DOCUMENT) {
          if (newMessage.files.length <= 0) {
            newMessage.blobUrls = message.blobUrls;
            newMessage.bufferFiles = message.bufferFiles;
          }
        }
        const receiverSocketIds = userSockets.get(receiverId)
        console.log('🚀 ~ socket.on ~ receiverSocketIds:', receiverSocketIds)
        if (receiverSocketIds) {
          for (const socketId of receiverSocketIds?.values()) {
            io.to(socketId).emit("receiveMessage", newMessage);
          }
        }
        // io.to(message.conversation_id).emit("receiveMessage", newMessage);
        io.to(message.conversation_id).emit("receiveLastMessage", newMessage);
        io.to(message.conversation_id).emit("sortConversation", newMessage);
      }
    });

    socket.on('sendFriendRequest', (friendRequest) => {
      const receiverSocketIds = userSockets.get(receiverId)
      if (receiverSocketIds) {
        for (const socketId of receiverSocketIds?.values()) {
          io.to(socketId).emit("receiveFriendRequest", friendRequest);
        }
      }
    })

    socket.on('replyFriendRequest', (friendRequest) => {
      const receiverSocketIds = userSockets.get(receiverId)
      if (receiverSocketIds) {
        for (const socketId of receiverSocketIds?.values()) {
          io.to(socketId).emit("replyFriendRequest", friendRequest);
        }
      }
    })

    socket.on("sendMessageReader", (messageReader) => {
      io.to(messageReader?.conversation_id).emit("receiveMessageReader", messageReader);
    });

    socket.on("sendReaction", (message) => {
      io.to(message?.conversation_id).emit("receiveReaction", message);
    });

    socket.on("revokeMessage", (message) => {
      io.to(message?.conversation_id).emit("revokeMessage", message);
    });

    socket.on("removeMessage", (message) => {
      io.to(message?.conversation_id).emit("removeMessage", message);
    });

    socket.on("sendSignalOnline", async (friendId) => {
      io.emit("receiveSignalOnline", friendId);
    });

    socket.on("sendSignalOffline", async (friendId) => {
      io.emit("receiveSignalOffline", friendId);
    });

    socket.on("blockUser", ({ friendship, conversationId }) => {
      console.log('🚀 ~ socket.on ~ friendship:', friendship)
      console.log('🚀 ~ socket.on ~ conversationId:', conversationId)
      io.to(conversationId).emit("blockUser", { friendship, conversationId });
    })

    socket.on("disconnect", async () => {
      let disconnectedUser = null;
      for (const [userId, sockets] of userSockets.entries()) {
        if (sockets.has(socket.id)) {
          sockets.delete(socket.id);
          if (sockets.size === 0) {
            userSockets.delete(userId);
            disconnectedUser = userId;
          }
          break;
        }
      }

      if (disconnectedUser) {
        console.log(`User disconnected: ${disconnectedUser}`);
        await userService.update(disconnectedUser, {
          status: 'offline'
        })
        io.emit("receiveSignalOffline", disconnectedUser);
      }

      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};


const getIO = () => {
  if (!io) {
    throw new Error("Socket.io has not been initialized");
  }
  return io;
};

export { initSocket, getIO, userSockets };
