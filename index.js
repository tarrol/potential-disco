const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const game_logic = require("./scripts/game_logic");

require("dotenv").config();

const path = require("path");
const session = require("express-session");
const exphbs = require("express-handlebars");
// const helpers = require("./utils/helpers");

const sequelize = require("./config");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer);

app.use(express.static("public"));

const sess = {
  secret: "Super secret secret",
  cookie: {
    maxAge: 300000,
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

function generateRoom(length) {
  let haystack =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let room = "";

  for (let i = 0; i < length; i++) {
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

    socket.on("setPiece", (data) => {
      let game = game_logic.games[socket.room];
      if ((data.hash = socket.hash && game.turn == socket.pid)) {
        let move_made = game_logic.setPiece(socket.room, data.col, socket.pid);
        if (move_made) {
          game.moves = parseInt(game.moves) + 1;
          socket.broadcast
            .to(socket.room)
            .emit("move_made", { pid: socket.pid, col: data.col });
          game.turn = socket.opponent.pid;
          let winner = game_logic.checkWinner(game.board);
          // if(winner)
        }
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

// httpServer.listen(3001);

sequelize
  .sync()
  .then(() =>
    httpServer.listen(3001, () => console.log("App listening on port 3001"))
  )
  .catch((err) => console.error(err));