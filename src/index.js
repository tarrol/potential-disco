const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const game_logic = require("../scripts/game_logic");

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer);

// function tick() {}

app.use(express.static("public"));

// app.get("/", (req, res) => {
//   res.send("Hello, world!");
// });

// app.get("/generate-room", (req, res) => {
//   share = generateRoom(6);
//   // res.render
// });

// app.get("/landingPage", (req, res) => {
//   // res.render("landingPage");
// });

// app.get("/:room([A-Za-z0-9]{6})", function (req, res) {
//   share = req.params.room;
//   // res.render();
// });

function generateRoom(length) {
  var haystack =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var room = "";

  for (var i = 0; i < length; i++) {
    room += haystack.charAt(Math.floor(Math.random() * 62));
  }

  return room;
}
let games = {};
let rooms = [];
// let roomNo;
// let clientNo = 0;

io.sockets.on("connection", (socket) => {
  // console.log("user connected", socket.id);
  socket.on("join", (data) => {
    // if there is already a room with player 1
    if (data.room in game_logic.games) {
      let game = game_logic.games[data.room];
      // if there is already player 2 of that room
      if (typeof game.player2 != "undefined") {
        return;
      }
      // otherwise join room as player 2
      console.log("player 2 has logged on");
      socket.join(data.room);
      rooms.push(data.room);
      socket.pid = 2;
      socket.hash = generateRoom(8);
      game.player2 = socket;

      // sets opponents for player 1 and player 2
      socket.opponent = game.player1;
      game.player1.opponent = socket;
      socket.emit("assign", { pid: socket.pid, hash: socket.hash });

      // begins game at turn 1
      game.turn = 1;
      socket.broadcast.to(data.room).emit("game start");
    } else {
      // join new room as player 1
      console.log("player 1 has joined");
      if (rooms.indexOf(data.room) <= 0) {
        socket.join(data.room);
      }
      socket.room = data.room;
      socket.pid = 1;
      socket.hash = generateRoom(8);
      // game logic begins
      game_logic.games[data.room] = {
        player1: socket,
        moves: 0,
        board: [
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
        ],
      };
      rooms.push(data.room);
      socket.emit("assign", { pid: socket.pid, hash: socket.hash });
    }

    socket.on("makeMove", (data) => {
      let game = game_logic.games[socket.room];
      if ((data.hash = socket.hash && game.turn == socket.pid)) {
        var move_made = game_logic.make_move(socket.room, cata.co1, socket.pid);
      }
    });
  });

  socket.on("disconnect", () => {
    if (socket.room in game_logic.games) {
      delete game_logic.games[socket.room];
      socket.send("stop");
      console.log("room closed: " + socket.room);
    } else {
      console.log("disconnected");
    }
  });
});

httpServer.listen(3001);
