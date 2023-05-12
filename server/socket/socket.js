const io = require("socket.io");
const Chat = require("../scheme/chatSchema");
const User = require("../scheme/userschema");

async function searchUsersChat(chatId) {
  const chat = await Chat.findById(chatId);

  if (!chat) {
    return [];
  }

  return chat.users.map((user) => user._id.toString());
}

function socketController(server) {
  const socket = io(server, {
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:3000",
    },
  });

  socket.on("connection", (socket) => {
    socket.on("setup", (userId) => {
      socket.join(userId);
    });

    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
    });

    socket.on("leaveChat", (chatId) => {
      socket.leave(chatId);
    });

    socket.on("renameChat", async ({ newName, chatId }) => {
      const userIds = await searchUsersChat(chatId);

      userIds.forEach((user) => {
        socket.broadcast.to(user).emit("newChatName", { newName, chatId });
      });
    });

    socket.on("removeUserChat", async ({ userId, chatId }) => {
      const userIds = await searchUsersChat(chatId);

      userIds.push(userId);

      userIds.forEach((user) => {
        socket.broadcast.to(user).emit("deleteUserChat", { userId, chatId });
      });
    });

    socket.on("addUserChat", async ({ userId, chatId }) => {
      const userIds = await searchUsersChat(chatId);

      userIds.forEach((user) => {
        socket.broadcast.to(user).emit("addUsersChat", { userId, chatId });
      });
    });

    socket.on("newMessage", async (message) => {
      try {
        const {
          chat: { _id: chatId },
        } = message;

        const userIds = await searchUsersChat(chatId);

        userIds.forEach((user) => {
          socket.broadcast.to(user).emit("message", message);
        });

        const usersInRoom = Array.from(socket.adapter.rooms.get(chatId) || []);

        const usersToAddUnreadMessages = userIds.filter(
          (user) =>
            !usersInRoom.includes(
              socket.adapter.rooms.get(user) &&
                socket.adapter.rooms.get(user).values().next().value
            )
        );

        usersToAddUnreadMessages.forEach(async (user) => {
          const existingUser = await User.findById(user);

          existingUser.unreadMessages = {
            ...existingUser.unreadMessages,
            [chatId]: (existingUser.unreadMessages[chatId] || 0) + 1,
          };

          await existingUser.save();
        });
      } catch (e) {
        console.log(e);
      }
    });

    socket.on("typingMessage", async (chatUserDate) => {
      const { chatId } = chatUserDate;

      socket.broadcast.to(chatId).emit("userTyping", chatUserDate);
    });
  });
}

module.exports = socketController;
