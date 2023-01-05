$(document).ready(function () {
  var socket = io.connect(),
    player = {};
  (yc = $("player1-color")), (oc = $("player2-color")), (your_turn = false);
  url = window.location.href.split("/");
  room = url[url.length - 1];
});
