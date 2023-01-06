// const { setPiece } = require("./game_logic");

$(document).ready(function () {
  var socket = io.connect(),
    player = {};
  (yc = $("player1-color")), (oc = $("player2-color")), (your_turn = false);
  url = window.location.href.split("/");
  room = url[url.length - 1];
  // room = 1234;

  // some example prompts to display during turns
  let text = {
    yt: "Your Turn",
    nyt: "Waiting for opponent",
    prompt_h2: "Waiting for opponent",
    prompt_p: "Give the url to a friend to play a game",
    prompt_h2_win: "You won the game!",
    prompt_p_win: "Give the url to a friend to play a game",
    prompt_h2_lose: "You lost the game!",
    prompt_p_lose: "Give the url to a friend to play another game",
    prompt_h2_draw: "Its a draw, you're both losers..",
    prompt_p_draw: "Give the url to a friend to play another game",
  };

  const init = () => {
    socket.emit("join", { room: room });
    $(".prompt input").html(window.location.href);
    $(".prompt h2").html(text.prompt_h2);
    $(".prompt p").html(text.prompt_p);
    $(".status").html("");
  };

  init();

  socket.on("assign", (data) => {
    console.log("assign emitted");
    player.pid = data.pid;
    player.hash = data.hash;
    console.log("player id: ", player.pid, player.hash);

    if (player.pid == "1") {
      yc.addClass("red");
      oc.addClass("yellow");
      player.color = "red";
      player.opponent = "yellow";

      $(".prompt").removeClass("hidden");
    } else {
      $(".status").html(text.nyt);
      yc.addClass("yellow");
      oc.addClass("red");
      oc.addClass("display");
      player.color = "yellow";
      player.opponent = "red";
    }
  });

  socket.on("winner", (data) => {
    oc.removeClass("display");
    yc.removeClass("display");
    change_turn(false);
    for (var i = 0; i < 4; i++) {
      // highlight the winning set of 4
    }

    if (data.winner == player.pid) {
      $(".prompt h2").val(text.prompt_h2_win);
      $(".prompt p").val(text.prompt_p_win);
    } else {
      $(".prompt h2").val(text.prompt_h2_lose);
      $(".prompt p").val(text.prompt_p_lose);
    }
    // hide prompts after certain time for rest of prompts
  });

  socket.on("draw", () => {
    oc.removeClass("display");
    yc.removeClass("display");
    change_turn(false);
    $(".prompt h2").val(text.prompt_h2_draw);
    $(".prompt p").val(text.prompt_p_draw);
  });

  socket.on("start", (data) => {
    change_turn(true);
    yc.addClass("display");
    oc.addClass("display");
    $(".prompt").addClass("hidden");
  });

  socket.on("stop", (data) => {
    init();
    reset_board();
  });

  // socket.on("move_made", (data) => {
  //   console.log("move_made called");
  //   setPiece();
  //   change_turn(true);
  //   // yc.addClass("display");
  //   // oc.removeClass("display");
  // });

  socket.on("opponent_move", (data) => {
    if (!your_turn) {
      // not finished yet
    }
    console.log(data);
  });

  // data is undefined here
  socket.on("move_made", function (data) {
    console.log("move_made", data);
    // setPiece(data);
  });

  //
  // const make_move = (col) => {};

  $(".tile").click(() => {
    console.log("tile clicked");
    setPiece(this);
    socket.emit("set_piece");
    change_turn(false);
  });

  // add event handlers for clicking on tiles, give tiles css class names

  const change_turn = (yt) => {
    if (yt) {
      your_turn = true;
      $(".status").val(text.yt);
    } else {
      your_turn = false;
      $(".status").val(text.nyt);
    }
  };

  $(".prompt input").click(() => {
    $(this).select();
  });

  const reset_board = () => {
    board = [];
    yc.removeClass("yellow red");
    oc.removeClass("yellow red");
    yc.removeClass("display");
    oc.removeClass("display");
  };

  // function setPiece() {
  //   if (gameOver) {
  //     return;
  //   }

  //   socket.emit("set_piece");
  //   console.log("set_piece emitted");

  //   // set move_made false
  //   let move_made = false;

  //   //get coords of that tile clicked
  //   let coords = this.id.split("-");
  //   let coords = this.id;
  //   let r = parseInt(coords[0]);
  //   let c = parseInt(coords[1]);

  //   // figure out which row the current column should be on
  //   r = currColumns[c];

  //   if (r < 0) {
  //     // board[r][c] != ' '
  //     return;
  //   }

  //   board[r][c] = currPlayer; //update JS board
  //   let tile = document.getElementById(r.toString() + "-" + c.toString());
  //   if (currPlayer == playerRed) {
  //     tile.classList.add("red-piece");
  //     currPlayer = playerYellow;
  //   } else {
  //     tile.classList.add("yellow-piece");
  //     currPlayer = playerRed;
  //   }

  //   r -= 1; //update the row height for that column
  //   currColumns[c] = r; //update the array

  //   // set move_made true
  //   move_made = true;

  //   checkWinner();
  // }

  // function setGame() {
  //   board = [];
  //   currColumns = [5, 5, 5, 5, 5, 5, 5];

  //   for (let r = 0; r < rows; r++) {
  //     let row = [];
  //     for (let c = 0; c < columns; c++) {
  //       // JS
  //       row.push(" ");
  //       // HTML
  //       let tile = document.createElement("div");
  //       tile.id = r.toString() + "-" + c.toString();
  //       tile.classList.add("tile");
  //       tile.addEventListener("click", setPiece);
  //       document.getElementById("board").append(tile);
  //     }
  //     board.push(row);
  //   }
  // }
  window.onload = function () {
    document.body.onclick = function (e) {
      console.log("click");
      console.log(targetDomObject);

      e = window.event || e;
      var targetDomObject = e.target || e.srcElement;

      if (
        targetDomObject &&
        targetDomObject.classList &&
        targetDomObject.classList.contains("tile")
      ) {
        let targetData = targetDomObject;
        console.log(targetData);
      }
      socket.emit("set_piece");
    };

    setGame();
  };
});
