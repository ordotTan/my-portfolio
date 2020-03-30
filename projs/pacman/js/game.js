'use strict';
const WALL = '#';
const FOOD = '.';
const POWER_FOOD = '⭕';
const EMPTY = ' ';
const CHERRY = '🍒';
const CHERRY_FREQ = 5000

var gBoard;
var gFoodCount
var gCherryInterval
var gBoardSize = 10

var gGame = {
  score: 0,
  isOn: false
};

function init() {
  // CR: usually its better to add class to an element rather than going through 3 nodes of elements
  document.querySelector('header h3 span').innerText = 0;
  document.querySelector('header h4 span').innerText = 0;
  document.querySelector('button').style.display = 'none'
  gFoodCount = 0;
  gBoard = buildBoard();
  document.querySelector(".modal").style.display = 'none'

  createPacman(gBoard);
  createGhosts(gBoard);
  gCherryInterval = setInterval(generateCherry, CHERRY_FREQ)
  printMat(gBoard, '.board-container');
  renderCell(gPacman.location,getPacmanHTML())
  gGame.isOn = true;
  gFoodCount-- //as the pacman take a spot of 1 food
  document.querySelector('header h4 span').innerText = gFoodCount;


}

function buildBoard() {
  var board = [];
  for (var i = 0; i < gBoardSize; i++) {
    board.push([]);
    for (var j = 0; j < gBoardSize; j++) {
      board[i][j] = FOOD;
      gFoodCount++;

      if (i === 0 || i === gBoardSize - 1 ||
        j === 0 || j === gBoardSize - 1 ||
        (j === 3 && i > 4 && i < gBoardSize - 2)) {

        board[i][j] = WALL;
        gFoodCount--
      }
    }
  }
  // placing the power food in 4 cornder of the board.
  board[1][1] = POWER_FOOD;
  board[1][board.length - 2] = POWER_FOOD;
  board[board.length - 2][1] = POWER_FOOD;
  board[board.length - 2][board.length - 2] = POWER_FOOD;
  gFoodCount -= 4
  document.querySelector('header h4 span').innerText = gFoodCount;
  return board;
}

function updateScore(value) {
  // Update both the model and the dom for the score
  gGame.score += value;
  document.querySelector('header h3 span').innerText = gGame.score;
}


function getFreeCells() {
  var freeCells = []
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      var currCell = gBoard[i][j]
      if (currCell === EMPTY) freeCells.push({ i, j })
    }
  }
  return freeCells
}
// CR: awesome! great logic
function generateCherry() {
  var optionalCells = getFreeCells()
  var rndIdx = getRandomIntInclusive(0, optionalCells.length - 1)
  var rndCell = optionalCells[rndIdx]
  if (!rndCell) return;
  gBoard[rndCell.i][rndCell.j] = CHERRY
  renderCell(rndCell, CHERRY)
}

function gameOver(isWin) {
  document.querySelector('button').innerText = 'Start Game'
  gGame.isOn = false;
  clearInterval(gIntervalGhosts);
  gIntervalGhosts = null;
  clearInterval(gCherryInterval)
  gCherryInterval = null;
  showModal(isWin);
}


// CR: good generic function!
function showModal(modalForWin) {
  var elModal = document.querySelector(".modal");
  elModal.style.display = 'block'
  var resString = (modalForWin) ? `Well Done ` : 'Try again..'
  elModal.innerHTML = `${resString} <button onclick="init()">Play again</button>`
}




