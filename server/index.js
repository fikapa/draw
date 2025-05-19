const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  socket.on("draw", (data) => {
    socket.broadcast.emit("draw", data);
  });
});

server.listen(10000);

const drawingHistory = [];

io.on("connection", (socket) => {
  // When a new client connects, send all past drawing data
  socket.emit("drawingHistory", drawingHistory);

  socket.on("draw", (data) => {
    drawingHistory.push(data); // Save the line data
    socket.broadcast.emit("draw", data); // Broadcast to others
  });
});
