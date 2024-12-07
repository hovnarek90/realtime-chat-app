const express = require("express");
const socket = require("socket.io");
const http = require("http");
const cors = require("cors");

const { addUser, removeUser, getUser, getUsersInRoom } = require("./uses");
const PORT = process.env.PORT || 5000;
const router = require("./router");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(
    `User connected: ${socket.id} (Total users: ${io.engine.clientsCount})`
  );

  socket.on("join", ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });
    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    socket.emit("message", {
      user: "admin",
      text: `Welcome ${user.username} to room ${user.room}!`,
    });

    socket.broadcast.to(user.room).emit("message", {
      user: "admin",
      text: `${user.username} has joined the room.`,
    });

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    if (user) {
      io.to(user.room).emit("message", { user: user.username, text: message });
    }
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.username} has left.`,
      });
    }
    console.log(
      `User disconnected: ${socket.id} (Total users: ${io.engine.clientsCount})`
    );
  });
});

app.use(router);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
