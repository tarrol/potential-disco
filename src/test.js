const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer);

// function tick() {}

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("socket", socket.id);
  // socket.emit("serverToClient", "Hello, Client!");
  // socket.on("clientToServer", (data) => {
  //   console.log(data);
  // });
});

httpServer.listen(3001);
console.log("listening on 3001");
