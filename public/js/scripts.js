$(() => {
  let socket = io.connect(),
    player = {},
    mc = $(".my_color"),
    oc = $(".opponent_color"),
    your_turn = false,
    url = window.location.href.split("/"),
    room = url[url.length - 1];

  let text = {
    my_turn: "Your turn",
    opponent_turn: "Waiting for opponent",
    win: "You win!",
    lose: "You lost.. Try harder next time.",
    draw: "Its a draw. Both of you are losers..",
  };

  init();

  socket.on("assign", function (data) {
    player.pid = data.pid;
    player.hash = data.hash;
    if (player.pid == "1") {
      mc.addClass("red");
      oc.addClass("yellow");
      player.color = "red";
      player.oppColor = "yellow";
    } else {
      $(".status").html(text.opponent_turn);
      mc.addClass("yellow");
      oc.addClass("red");
      oc.addClass("display");
      player.color = "yellow";
      player.oppColor = "red";
    }
  });

  socket.on("winner", function (data) {
    oc.removeClass("display");
    mc.removeClass("display");
    change_turn(false);
    if (data.winner.winner == player.pid) {
      $(".status").html(text.win);
    } else {
      $(".status").html(text.lose);
    }
  });

  socket.on("draw", function () {
    oc.removeClass("display");
    mc.removeClass("display");
    change_turn(false);
    $(".status").html(text.draw);
  });

  socket.on("start", function (data) {
    change_turn(true);
    mc.addClass("display");
  });

  socket.on("stop", function (data) {
    init();
    reset_board();
  });

  socket.on("move_made", function (data) {
    setPiece(data.col + 1, true);
    change_turn(true);
    mc.addClass("display");
    oc.removeClass("display");
  });

  socket.on("opponent_move", function (data) {
    if (!your_turn) {
      oc.css("left", parseInt(data.col) * 100);
    }
    console.debug(data);
  });

  $(".cols > .col").click(function () {
    if (parseInt($(this).attr("data-in-col")) < 6) {
      if (your_turn) {
        let col = $(this).index() + 1;
        setPiece(col);
        socket.emit("setPiece", { col: col - 1, hash: player.hash });
        change_turn(false);
        mc.removeClass("display");
        oc.addClass("display");
      }
    }
  });

  function init() {
    socket.emit("join", { room: room });
    $(".status").html("Give the url to a friend to play!");
  }

  function setPiece(col, other) {
    if (!other) other = false;
    let col_elm = $(".cols > .col#col_" + col);
    let current_in_col = parseInt(col_elm.attr("data-in-col"));
    col_elm.attr("data-in-col", current_in_col + 1);
    let color = other ? player.oppColor : player.color;
    let new_coin = $(
      '<div class="coin ' +
        color +
        '" id="coin_' +
        (5 - current_in_col) +
        "" +
        (col - 1) +
        '"></div>'
    );
    col_elm.append(new_coin);
    new_coin.animate(
      {
        top: 100 * (4 - current_in_col + 1),
      },
      0
    );
  }

  function change_turn(my_turn) {
    if (my_turn) {
      your_turn = true;
      $(".status").html(text.my_turn);
    } else {
      your_turn = false;
      $(".status").html(text.opponent_turn);
    }
  }

  function reset_board() {
    $(".cols .col").attr("data-in-col", "0").html("");
    mc.removeClass("yellow red");
    oc.removeClass("yellow red");
    mc.removeClass("display");
    oc.removeClass("display");
    $(".status").html("");
  }
});
