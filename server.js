const { createServer } = require("http");
const { Server } = require("socket.io");
const express = require("express");
const path = require("path");

const formatMessage = require("./utils/messages");
const {
  getCurrentUser,
  userJoin,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const PORT = process.env.PORT || 3000;

const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    socket.emit("message", formatMessage("admin", "Welcome to my chat app"));

    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage("admin", `${username} has joined the chat`)
      );

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  socket.on("chatMessage", (message) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, message));
  });

  socket.on("disconnect", () => {
    const user = getCurrentUser(socket.id);
    if (user) {
      userLeave(user.id);
      io.to(user.room).emit(
        "message",
        formatMessage("admin", `${user.username} has left the chat`)
      );

      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
