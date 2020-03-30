const WALL = 'WALL';
const FLOOR = 'FLOOR';
const BALL = 'BALL';
const GAMER = 'GAMER';
const GLUE = 'GLUE';
const NEW_BALL_FREQ = 4000;
const NEW_GLUE_FREQ = 6000;
const REMOVE_GLUE_FREQ = 3000;
const GLUED_FREQ = 5000;
const GAMER_IMG = '<img src="img/gamer.png" />';
const BALL_IMG = '<img src="img/ball.png" />';
const GLUE_IMG = '<img src="img/glue.png" />';
const MAT_ROWS = 7
const MAT_COLS = 7

// THE MODEL:
var gBoard;
var gStop
var gGamerPos;

var gNewBallIntervall
var gNewGlueIntervall
var gRemoveGlueInterval

var gFreeSpacesCount
var gBallsCollectedCount = 0
var gBallsOnBoardCount = 0;
var gIsGlued

function initGame() {
	gBallsCollectedCount = 0
	gBallsOnBoardCount = 0;
	gIsGlued = false;
	gStop = false;
	document.querySelector('.result').style.display = 'none'
	document.querySelector('.balls-counter').innerText = 'Balls Collected: ' + gBallsCollectedCount
	document.querySelector('.result').innerText = ''
	document.querySelector('.restart-btn').style.display = 'none'
	gGamerPos = { i: 6, j: 3 };
	gBoard = buildBoard();
	renderBoard(gBoard);
	gFreeSpacesCount = (gBoard.length - 2) * (gBoard[0].length - 2) + 4 - 1 - gBallsOnBoardCount //+4 for the passgaes. -1 for the player
	gNewBallIntervall = setInterval(addGameElement, NEW_BALL_FREQ, BALL);
	gNewGlueIntervall = setInterval(addGameElement, NEW_GLUE_FREQ, GLUE);
	addGameElement(BALL); // first random ball

}


function buildBoard() {
	// Create the Matrix
	var board = createMat(MAT_ROWS, MAT_COLS)
	var board = new Array(MAT_ROWS);
	for (var i = 0; i < board.length; i++) {
		board[i] = new Array(MAT_COLS);
	}
	var rowPassageIdx = parseInt(board[0].length / 2)
	var colPassageIdx = parseInt(board.length / 2)
	// Put FLOOR everywhere and WALL at edges
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			// Put FLOOR in a regular cell
			var cell = { type: FLOOR, gameElement: null };

			// Place Walls at edges
			if (i === 0 || i === board.length - 1 || j === 0 || j === board[0].length - 1) {
				if (i != colPassageIdx && j != rowPassageIdx) {
					cell.type = WALL;
				}
			}
			// Add created cell to The game board
			board[i][j] = cell;
		}
	}

	// Place the gamer at selected position
	board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
	return board;
}


function addGameElement(element) {
	var i = getRandomInt(0, gBoard.length);
	var j = getRandomInt(0, gBoard[0].length);
	var foundEmptySpace = false
	while (!foundEmptySpace) {
		if (gFreeSpacesCount === 0) {
			foundEmptySpace = true
			break;
		}
		var currentLoc = gBoard[i][j]
		if (currentLoc.type === FLOOR && !currentLoc.gameElement) {
			gBoard[i][j].gameElement = element
			if (element === GLUE) {
				renderCell({ i, j }, GLUE_IMG)
				gRemoveGlueInterval = setTimeout(function () {
					gBoard[i][j].gameElement = null
					renderCell({ i, j }, '')
					gFreeSpacesCount++
				}, REMOVE_GLUE_FREQ);
			}
			else {
				renderCell({ i, j }, BALL_IMG)
				gBallsOnBoardCount++;
			}
			gFreeSpacesCount--;
			foundEmptySpace = true
		}
		else {
			i = getRandomInt(0, gBoard.length);
			j = getRandomInt(0, gBoard[0].length);
		}
	}
}

// Render the board to an HTML table
function renderBoard(board) {

	var strHTML = '';
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>\n';
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j];
			var cellClass = getClassName({ i: i, j: j })
			cellClass += (currCell.type === FLOOR) ? ' floor' : ' wall'
			strHTML += `\t<td class="cell ${cellClass}" onclick="moveTo(${i},${j})">\n`
			switch (currCell.gameElement) {
				case GAMER:
					strHTML += GAMER_IMG;
					break;
				case BALL:
					strHTML += BALL_IMG;
					break;
				case GLUE:
					strHTML += GLUE_IMG;
					break;
			}
			strHTML += '\t</td>\n';
		}
		strHTML += '</tr>\n';
	}

	var elBoard = document.querySelector('.board');
	elBoard.innerHTML = strHTML;
}

// Move the player to a specific location
function moveTo(i, j) {
	if (gIsGlued || gStop) return;

	if (i < 0 || j < 0 || i === gBoard.length || j === gBoard[0].length) {

		if (i === parseInt(gBoard.length / 2) && j === -1) j = gBoard[0].length - 1; //move left
		else if (i === parseInt(gBoard.length / 2) && j === gBoard[0].length) j = 0; //move right
		else if (j === parseInt(gBoard.length / 2) && i === -1) i = gBoard.length - 1; //move down
		else if (j === parseInt(gBoard.length / 2) && i === gBoard.length) i = 0; // move up

	}
	var targetCell = gBoard[i][j];
	if (targetCell.type === WALL) return;
	// Calculate distance to make sure we are moving to a neighbor cell
	var iAbsDiff = Math.abs(i - gGamerPos.i);
	var jAbsDiff = Math.abs(j - gGamerPos.j);

	// If the clicked Cell is one of the four allowed
	if (
		(iAbsDiff === 1 && jAbsDiff === 0) ||
		(jAbsDiff === 1 && iAbsDiff === 0) ||
		(iAbsDiff === gBoard.length - 1 && jAbsDiff === 0) ||
		(jAbsDiff === gBoard[0].length - 1 && iAbsDiff === 0)) {

		if (targetCell.gameElement === BALL) {
			var audioKick = new Audio("sound/kick.wav");
			audioKick.play();
			gFreeSpacesCount++;
			gBallsCollectedCount++;
			gBallsOnBoardCount--;
			document.querySelector('.balls-counter').innerText = 'Balls Collected: ' + gBallsCollectedCount
			if (gBallsOnBoardCount === 0) {
				var audioTada = new Audio("sound/tada.wav");
				clearInterval(gNewBallIntervall)
				clearInterval(gNewGlueIntervall)
				document.querySelector('.restart-btn').style.display = 'block'
				document.querySelector('.result').style.display = 'block'
				document.querySelector('.result').innerText = 'Game over'
				gStop = true;
				audioTada.play();
			}
		}
		if (targetCell.gameElement === GLUE) {
			gFreeSpacesCount++;
			gIsGlued = true;
			clearTimeout(gRemoveGlueInterval)
			setTimeout(function () { gIsGlued = false; }, GLUED_FREQ);
		}

		// MOVING from current position
		// Model:
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
		// Dom:
		renderCell(gGamerPos, '');

		// MOVING to selected position
		// Model:




		gGamerPos.i = i;
		gGamerPos.j = j;
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
		// DOM:
		renderCell(gGamerPos, GAMER_IMG);
	} // else console.log('TOO FAR', iAbsDiff, jAbsDiff);

}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
	var cellSelector = '.' + getClassName(location)
	var elCell = document.querySelector(cellSelector);
	elCell.innerHTML = value;
}


// Move the player by keyboard arrows
function handleKey(event) {
	if (gIsGlued || gStop) return;
	var i = gGamerPos.i;
	var j = gGamerPos.j;
	//debugger

	switch (event.key) {
		case 'ArrowLeft':
			moveTo(i, j - 1);
			break;
		case 'ArrowRight':
			moveTo(i, j + 1);
			break;
		case 'ArrowUp':
			moveTo(i - 1, j);
			break;
		case 'ArrowDown':
			moveTo(i + 1, j);
			break;

	}

}

// Returns the class name for a specific cell
function getClassName(location) {
	var cellClass = 'cell-' + location.i + '-' + location.j;
	return cellClass;
}


function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
