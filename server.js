require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { createServer } = require("http");
const { Server } = require("socket.io");
const game_logic = require("./scripts/game_logic");
const generateHash = require("./utils/generateHash");

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", require("./controllers"));

// Handlebars setting
app.set("view engine", "hbs");
app.engine(
  "hbs",
  exphbs.engine({
    extname: "hbs",
    defaultLayout: "index",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
  })
);

// commented out for testing socket connection
// app.get("/", (req, res) => {
//   res.render("main");
// });

let rooms = [];

io.sockets.on("connection", (socket) => {
  // console.log("user connected, user id:", socket.id);

  socket.on("join", (data) => {
    console.log("user connected, user id:", socket.id);
    // if there is already a room with player 1
    // if (data.room.includes(game_logic.games)) {
    if (data.room in game_logic.games) {
      let game = game_logic.games[data.room];
      // if there is already player 2 of that room, return
      if (typeof game.player2 != "undefined") {
        return;
      }
      // otherwise join room as player 2
      console.log("player 2 has logged on");
      socket.join(data.room);
      // push updated room data into the rooms array list
      rooms.push(data.room);
      // set player 2 pid
      socket.pid = 2;
      socket.hash = generateHash(8);
      game.player2 = socket;

      // sets opponents for player 1 and player 2
      socket.opponent = game.player1;
      game.player1.opponent = socket;
      // sends signal to client side to set pid and hash (on scripts.js)
      socket.emit("assign", { pid: socket.pid, hash: socket.hash });

      // begins game at turn 1
      game.turn = 1;
      // don't think this works yet
      socket.broadcast.to(data.room).emit("start");
    } else {
      // join new room as player 1
      console.log("player 1 has joined");
      // if there are no rooms, create a new one
      if (rooms.indexOf(data.room) <= 0) {
        socket.join(data.room);
      }
      // set socket room attribute (room id) to the response
      socket.room = data.room;
      // set player 1 pid to 1
      socket.pid = 1;
      socket.hash = generateHash(8);
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
      // push this room into the rooms array list
      rooms.push(data.room);
      // sends signal to client side to assign pid and hash (on scripts.js)
      socket.emit("assign", { pid: socket.pid, hash: socket.hash });
      console.log("assign called");
    }

    socket.on("set_piece", (data) => {
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
          if (winner) {
            socket.send("winner");
          }
          if (game.moves >= 42) {
            socket.send("draw");
          }
        }
      }
    });

    socket.on("my_move", (data) => {
      // socket.broadcast.to(socket.room).emit("opponent_move");
      socket.broadcast("test");
    });
  });

  socket.on("disconnect", () => {
    // if this room exists, delete the room from array
    if (socket.room in game_logic.games) {
      delete game_logic.games[socket.room];
      // send signal to socket "stop" listener (on scripts.js)
      socket.send("stop");
      console.log("room closed: " + socket.room);
    } else {
      console.log("disconnected");
    }
  });
});

sequelize
  .sync()
  .then(() =>
    httpServer.listen(3001, () => console.log("App listening on port 3001"))
  )
  .catch((err) => console.error(err));
