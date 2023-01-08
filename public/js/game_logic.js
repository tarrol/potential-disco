let games = {};

// sets your player piece with socket room no, col parameter and current pid turn in mind
let setPiece = function (room, col, pid) {
  let board = this.games[room].board;
  let move_made = false;
  for (let i = board.length - 1; i >= 0; i--) {
    if (board[i][col] == 0) {
      board[i][col] = pid;
      move_made = true;
      break;
    }
  }
  return move_made;
};

let checkWinner = function (board) {
  let found = 0,
    // winner default false on game reset
    winner = false,
    data = {},
    person = 0;

  // win conditions for horizontal, vertical, diagonal left, diagonal right
  for (let row = 0; row < board.length; row++) {
    if (winner) break;
    found = 0;
    person = 0;
    for (let col = 0; col < board[row].length; col++) {
      let selected = board[row][col];
      if (selected !== 0) found = person != selected ? 1 : found + 1;
      person = selected;
      if (found >= 4) {
        winner = person;
      }
      if ((col > 2 && found == 0) || found >= 4) break;
    }
  }

  if (!winner) {
    for (col = 0; col < board[0].length; col++) {
      if (winner) break;
      found = 0;
      person = 0;
      for (row = 0; row < board.length; row++) {
        let selected = board[row][col];
        if (selected !== 0) found = person != selected ? 1 : found + 1;
        person = selected;
        if (found >= 4) {
          winner = person;
        }
        if ((row > 1 && found == 0) || found >= 4) break;
      }
    }
  }

  if (!winner) {
    for (col = 0; col < board[0].length - 3; col++) {
      if (winner) break;
      for (row = 0; row < board.length - 3; row++) {
        let first_val = board[row][col];
        if (first_val == 0) continue;
        if (
          first_val === board[row + 1][col + 1] &&
          first_val === board[row + 2][col + 2] &&
          first_val === board[row + 3][col + 3]
        ) {
          winner = first_val;
          break;
        }
      }
    }
  }

  if (!winner) {
    for (col = board[0].length - 1; col > 2; col--) {
      if (winner) break;
      for (row = 0; row < board.length - 3; row++) {
        let first_val = board[row][col];
        if (first_val == 0) continue;
        if (
          first_val === board[row + 1][col - 1] &&
          first_val === board[row + 2][col - 2] &&
          first_val === board[row + 3][col - 3]
        ) {
          winner = first_val;
          break;
        }
      }
    }
  }

  if (winner) {
    data.winner = winner;
    return data;
  }
  return false;
};

module.exports = { games, setPiece, checkWinner };
