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

let usersInRoom = {};
io.on("connection", (socket) => {
  console.log(
    `User connected: ${socket.id} and we have ${io.engine.clientsCount} users`
  );

  socket.on("join", ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });
    if (error) return callback(error);
    // console.log(username, room);
    // if (usersInRoom[room] && usersInRoom[room].includes(username)) {
    //   return callback("Username is taken");
    // }
     
    socket.join(username.room);
    socket.emit("message", {user:"admin", text:`${user.username} has joined the room ${user.room}`});
    socket.broadcast.to(user.room).emit("message", {user:"admin", text:`${user.username} has joined the room ${user.room}`});
    // if (!usersInRoom[room]) usersInRoom[room] = [];
    // usersInRoom[room].push(username);

    socket.join(room); 
    callback();
    socket.on("sendMessage", (message, callback) => {
      const user = getUser(socket.id);
      io.to(user.room).emit("message", { user: user.username, text: message });
      callback();
    })

    // io.to(room).emit("message", `${username} has joined the room`);
  });

  socket.on("disconnect", () => {
    console.log(
      `User disconnected: ${socket.id} and we have ${io.engine.clientsCount} users left`
    );
  });
});

app.use(router);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
