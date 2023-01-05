$(document).ready(function () {
  let socket = io.connect(),
    player = {};
  (yc = $("player1-color")), (oc = $("player2-color")), (your_turn = false);
  url = window.location.href.split("/");
  room = url[url.length - 1];

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

  init();

  socket.on("assign", (data) => {
    player.pid = data.pid;
    player.hash = data.hash;
    if (player.pid == "1") {
      yc.addClass("red");
      oc.addClass("yellow");
      player.color = "red";
      player.opponent = "yellow";

      $(".prompt").removeClass("hidden");
    } else {
      $(".status").value(text.nyt);
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
      $(".prompt h2").value(text.prompt_h2_win);
      $(".prompt p").value(text.prompt_p_win);
    } else {
      $(".prompt h2").value(text.prompt_h2_lose);
      $(".prompt p").value(text.prompt_p_lose);
    }
    // hide prompts after certain time for rest of prompts
  });

  socket.on("draw", () => {
    oc.removeClass("display");
    yc.removeClass("display");
    change_turn(false);
    $(".prompt h2").value(text.prompt_h2_draw);
    $(".prompt p").value(text.prompt_p_draw);
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

  socket.on("move_made", (data) => {
    make_move(data.col + 1, true);
    change_turn(true);
    yc.addClass("display");
    oc.removeClass("display");
  });

  socket.on("opponent_move", (data) => {
    if (!your_turn) {
      // not finished yet
    }
    console.log(data);
  });

  const init = () => {
    socket.emit("join", { room: room });
    $(".prompt input").value(window.location.href);
    $(".prompt h2").html(text.prompt_h2);
    $(".prompt p").html(text.prompt_p);
    $(".status").html("");
  };

  //
  const make_move = (col) => {};

  // add event handlers for clicking on columns, give columns css class names

  const change_turn = (yt) => {
    if (yt) {
      your_turn = true;
      $(".status").value(text.yt);
    } else {
      your_turn = false;
      $(".status").value(text.nyt);
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
});
