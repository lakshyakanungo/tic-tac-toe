var origBoard;
// [0,1,2,3,4,5,6,7,8] numbers originally
// [0,1,2,'O',...]
const huPlayer = "O";
const aiPlayer = "X";
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2],
];
//all the winning combos possible

const cells = document.querySelectorAll(".cell");

startGame();

function startGame() {
  document.querySelector(".endgame").style.display = "none";
  origBoard = Array.from(Array(9).keys());
  //[0,1,2,3,4,5,6,7,8]
  //   console.log(origBoard);
  for (var i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    cells[i].style.removeProperty("background-color");
    cells[i].addEventListener("click", turnClick, false);
  }
}
function turnClick(square) {
  // console.log(square.target.id); //cell id
  // TODO : play only if cell available and play for AI also

  if (typeof origBoard[square.target.id] == "number") {
    turn(square.target.id, huPlayer);
    if (!checkTie()) turn(bestSpot(), aiPlayer);
  }
}

function turn(squareId, player) {
  origBoard[squareId] = player;
  // at id 2 if '0'
  //origBoard [0,1,2,'0',4,'X',...]
  document.getElementById(squareId).innerText = player;
  let gameWon = checkWin(origBoard, player);
  if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
  //huplayer '0' aiplayer 'X'
  // [0,1,'0','0',4,'0','X',7,8]
  let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []); //we will get the indexes of the cells where current player has played
  let gameWon = null;

  //now check in the winCombos arrays if the plays indexes cover fully any of the winning combo
  for (let [index, win] of winCombos.entries()) {
    if (win.every((elem) => plays.indexOf(elem) > -1)) {
      //game won
      gameWon = { index: index, player: player };
      //returning index of winning combo and the player who has won the game
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  //colouring the cells after winning the game according to the player who has won
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player == huPlayer ? "blue" : "red";
  }
  //removing the event listener so that we are not able to click on any cells after the game has ended
  for (var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", turnClick, false);
  }

  declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");
}

function declareWinner(who) {
  //who -> you won! or you lose
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
  return origBoard.filter((s) => typeof s == "number");
}

function bestSpot() {
  return emptySquares()[0];
}

function checkTie() {
  if (emptySquares().length == 0) {
    for (var i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "green";
      cells[i].removeEventListener("click", turnClick, false);
    }
    declareWinner("Tie Game!");
    return true;
  }
  return false;
}
