'use strict'
const MINE = '💣'
const FLAG = '🚩'

//The model
var gCellId = 101
var gBoard
var gIsFirstMove = true
var gStartTime
var gTimeInterval

var gGame = {
    isON: false,
    shownCount: 0,
    markedCount: 0,
    markedMines: 0,
    seconds: 0,
    autoPlaceMines: true,
    currentHintUsed: false,
    placedMined: 0

}
var gLevel = {
    size: 4,
    mines: 2,
    levelName: 'easy'
}

var gPlayer = {
    hintCount: 3,
    liveCount: 3,
    safeClickCount: 3,
    hintActive: false
}


//todo // CR: too big of a function, break into few smaller functions
//todo - treak the "live" in a more generic way, so it will be easier to add/remove lifes
function initGame() {
    gBoard = buildBoard(gLevel.size)
    displayRecords(gLevel.levelName)
    gPlayer.safeClickCount = 3
    if (gTimeInterval) {
        clearInterval(gTimeInterval)
        gTimeInterval = null
    }
    document.querySelector('.myButton').classList.add('btn-disabled')
    document.querySelector('.myButton').classList.remove('safe-cell-btn')
    document.querySelector('.myButton').innerText = `${gPlayer.safeClickCount} safe-clicks remaining`
    document.querySelector('.flag-counter').innerText = gLevel.mines
    document.querySelector('.seconds').innerText = '0 seconds'
    document.querySelector('.life1').src = "img/heart.png"
    document.querySelector('.life2').src = "img/heart.png"
    document.querySelector('.life3').src = "img/heart.png"
    document.querySelector('.hint-label').style.display = 'none'
    document.querySelector('.hint-label').innerText = ''

    var hints = document.querySelectorAll('.hint')
    for (var i = 0; i < hints.length; i++) {
        hints[i].src = "img/bulb.png"
        hints[i].classList.remove('hint-disabled')
        hints[i].classList.add('hint-active')
    }
    document.querySelector('.user-message').style.display = 'none'
    document.querySelector('.smiley').src = 'img/smiley_normal.png'
    gIsFirstMove = true
    gGame.currentHintUsed = false
    gGame.markedMines = 0
    gGame.markedCount = 0
    gGame.seconds = 0
    gGame.shownCount = 0
    gGame.placedMined = 0
    gPlayer.hintCount = 3
    gPlayer.liveCount = 3
    gPlayer.hintActive = false;
    renderBoard(gBoard)
    disableContextMenu();
    if (!gGame.autoPlaceMines) {
        manualPlaceMines()
    }
    if (gLevel.mines === 0 || gLevel.mines === null ) {  //protect from 0 mines set in manual mode
        gGame.isON = false
        return
    }  
    gGame.isON = true
}

function displayRecords(levelName) {
    //Check if we have game records in the browser's localStorage, and update it if not
    var recordType = levelName + 'Record'
    var elRecordClass = '.best-time-' + gLevel.levelName
    var Record = localStorage.getItem(recordType);
    if (!Record) {
        document.querySelector(elRecordClass).innerText = 'No record yet'
    }
    else {
        document.querySelector(elRecordClass).innerText = '(Record: ' + Record + ' sec.)';
    }
}


function disableContextMenu() { // disable right click from all table cells.
    var elCells = document.querySelectorAll('td')
    for (var i = 0; i < elCells.length; i++) {
        elCells[i].addEventListener('contextmenu', function (e) {
            e.preventDefault();
        }, false);
    }
}


//todo CR: repeating some code with few value changes can be in one function

function setDiffulty(elDifficultyInput) {

    if (elDifficultyInput.value === 'Beginner') {
        gLevel.size = 4
        gLevel.mines = 2
        gLevel.levelName = 'easy'
        document.querySelector('.best-time-easy').style.display = 'block'
        document.querySelector('.best-time-medium').style.display = 'none'
        document.querySelector('.best-time-hard').style.display = 'none'
    }
    else if (elDifficultyInput.value === 'Medium') {
        gLevel.size = 8
        gLevel.mines = 12
        gLevel.levelName = 'medium'
        document.querySelector('.best-time-easy').style.display = 'none'
        document.querySelector('.best-time-medium').style.display = 'block'
        document.querySelector('.best-time-hard').style.display = 'none'
    }
    else if (elDifficultyInput.value === 'Expert') {
        gLevel.size = 12
        gLevel.mines = 30
        gLevel.levelName = 'hard'
        document.querySelector('.best-time-easy').style.display = 'none'
        document.querySelector('.best-time-medium').style.display = 'none'
        document.querySelector('.best-time-hard').style.display = 'block'
    }
    initGame();
}

function markSafeCell() {
    if (gIsFirstMove) return
    if (!gGame.isON) return
    if (gPlayer.safeClickCount === 0) return
    gPlayer.safeClickCount--
    document.querySelector('.myButton').innerText = `${gPlayer.safeClickCount} safe-clicks remaining`
    if (gPlayer.safeClickCount === 0) {
        document.querySelector('.myButton').classList.add('btn-disabled')
        document.querySelector('.myButton').classList.remove('safe-cell-btn')
    }
    var cells = []
    var id = 0
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j]
            if (!currCell.isMine && !currCell.isMarked && !currCell.isShown) {
                cells[id] = ({ id: id, i: i, j: j }) //coords of all safe cells
                id++
            }
        }
    }
    var randomIndex = getRandomIntInclusive(0, cells.length - 1)
    var mineCell = cells.splice(randomIndex, 1)
    if (mineCell.length === 0) {
        document.querySelector('.user-message').innerText = 'No more safe cell!'
    }
    else {
        renderSafeCell(mineCell[0].i, mineCell[0].j, true)
        setTimeout(function () {
            renderSafeCell(mineCell[0].i, mineCell[0].j, false)
        }, 1000);

    }

}

function renderSafeCell(cellI, cellJ, isShow) {
    var elCell = getCellElement(cellI, cellJ)
    if (isShow) elCell.classList.add('safe-cell')
    else elCell.classList.remove('safe-cell')
}


function getHint(elHint) {
    if (!gGame.isON) return
    var elCells = document.querySelectorAll('.cell')
    for (var i = 0; i < elCells.length; i++) {
        elCells[i].style.cursor = 'help'
    }
    gPlayer.hintActive = true;
    gPlayer.hintCount--;
    elHint.src = 'img/bulb_off.png'
    elHint.onclick = ''
    elHint.classList.add('hint-disabled')
    elHint.classList.remove('hint-active')
    document.querySelector('.hint-label').style.display = 'block'
    document.querySelector('.hint-label').innerText = 'Take a sneak-peek into one cell and its surrondings'
}


function renderHint(cellI, cellJ, isShow) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue; //Check illegel rows
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard.length) continue; //Check illegel cols
            var elCell = getCellElement(i, j)
            if (gBoard[i][j].isMarked) continue
            if (isShow) elCell.classList.add('revealed')
            else elCell.classList.remove('revealed')
        }
    }
}

function finishGame(isWin) {
    document.querySelector('.myButton').classList.remove('safe-cell-btn')
    document.querySelector('.myButton').classList.add('btn-disabled')
    var hints = document.querySelectorAll('.hint')
    for (var i = 0; i < hints.length; i++) {
        hints[i].src = "img/bulb_off.png"
        hints[i].classList.add('hint-disabled')
        hints[i].classList.remove('hint-active')
    }
    document.querySelector('.user-message').style.display = 'block'
    gGame.isON = false
    if (isWin) {// Game Won!
        var winSound = new Audio("sound/tada.wav");
        winSound.play();
        document.querySelector('.smiley').src = 'img/smiley_happy.png'
        document.querySelector('.user-message').innerText = 'Well Done!!'
        checkRecords()
        return
    } //Game over protocol.... 
    setTimeout(function () {
        var loseSound = new Audio("sound/game_over.wav");
        loseSound.play();
    }, 1000);

    document.querySelector('.smiley').src = 'img/smiley_sad.png'
    document.querySelector('.user-message').innerText = 'Game Over. Better luck next time...'
    for (var i = 0; i < gBoard.length; i++) { //Show remaining mines
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMine) {
                var elCell = document.querySelector(`.cell-${i}-${j}`)
                gBoard[i][j].isShown = true
                elCell.classList.add('mine');
            }
        }
    }
}

function checkRecords() {

    var gameType = gLevel.levelName
    var record = localStorage.getItem(gameType + 'Record');
    var inputs = (document.querySelectorAll('.difficulty-picker'))
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].checked) break
    }
    if (gGame.seconds < record || record === null) {
        localStorage.setItem(gameType + 'Record', gGame.seconds);
        document.querySelector('.best-time-' + gameType).innerHTML = '(Record: ' + gGame.seconds + ' sec)';
    }
}

function startTimer() {
    gStartTime = Date.now();
    gTimeInterval = setInterval(() => {
        var gameTime = parseInt((Date.now() - gStartTime) / 1000)
        gGame.seconds = gameTime + 1 //adding 1 sec to compensate for the last interval
        var elMlSeconds = document.querySelector('.seconds');
        elMlSeconds.innerText = gameTime + ' seconds';
        if (!gGame.isON) {
            clearInterval(gTimeInterval)
            gTimeInterval = null
        }
    }, 1000);
}
//todo CR: too big of a function, break into few smaller functions, you are not using the model for rendering
//todo - consider having renderCell function to help here
function cellClicked(elCell, i, j) {
    var cell = gBoard[i][j]
    if (!gGame.isON) return
    if (cell.isMarked) return
    if (cell.isShown) return
    if (gGame.currentHintUsed) return // protection from "abusing" single hint for multiple time
    var audioClick = new Audio("sound/click.wav");
    audioClick.play();

    if (!gGame.autoPlaceMines && gGame.placedMined < gLevel.mines) { //Manual mines mode
        if (gBoard[i][j].isMine) return
        gBoard[i][j].isMine = true
        elCell.innerHTML = MINE
        elCell.classList.add('revealed') //temporary reveal...
        gGame.placedMined++
        if (gGame.placedMined === gLevel.mines) {//finished placing mines. hide them all and render the board
            setTimeout(function () {
                renderBoard(gBoard)
            }, 1000);

        }
        return
    }

    if (gIsFirstMove) {  //Handle first move case
        startTimer()
        document.querySelector('.myButton').classList.add('safe-cell-btn')
        document.querySelector('.myButton').classList.remove('btn-disabled')
        cell.isFirst = true
        if (gGame.autoPlaceMines) placeMines(gLevel.mines)
        setMinesNegsCount(gBoard)
        renderBoard(gBoard)
        disableContextMenu();
        elCell = getCellElement(i, j) // getting updated "elCell" element post mine placement 
        gIsFirstMove = false
    }

    if (gPlayer.hintActive) { //Handle click post "hint" request
        gGame.currentHintUsed = true
        renderHint(i, j, true)
        var elCells = document.querySelectorAll('.cell')
        for (var cellIndex = 0; cellIndex < elCells.length; cellIndex++) {
            elCells[cellIndex].style.cursor = 'pointer'
        }
        setTimeout(function () {
            renderHint(i, j, false)
            gPlayer.hintActive = false
            gGame.currentHintUsed = false
            document.querySelector('.hint-label').style.display = 'none'
        }, 1000);
        return;
    }

    if (cell.isMine) { //Clicked on a mine
        var quakeInterval = setInterval(explode, 100);
        setTimeout(function () {
            clearInterval(quakeInterval)
            quakeInterval = null
            document.querySelector('.board').classList.remove('rotated-left')
        }, 1200);
        var explosion = new Audio("sound/explosion.wav");
        explosion.play();
        var currentLife = '.life' + gPlayer.liveCount
        document.querySelector(currentLife).src = "img/broken_heart.png"
        gPlayer.liveCount--
        if (gPlayer.liveCount === 0) {
            elCell.classList.add('mine-touch')
            finishGame(false)
        }
        else {
            document.querySelector('.user-message').style.display = 'block'
            document.querySelector('.user-message').innerText = 'Oops.. You landed on a mine. Try again'
            setTimeout(function () {
                if (gGame.isON) document.querySelector('.user-message').style.display = 'none'
            }, 3000);
        }
    } else if (cell.minesAroundCount > 0) { //reveal a single number
        gBoard[i][j].isShown = true
        gGame.shownCount++
        var classToAdd = 'neg' + cell.minesAroundCount
        elCell.classList.add(classToAdd)
    } else { //need to expend..
        expendedReveal(i, j)
    }
    checkGameOver()
}

function expendedReveal(cellI, cellJ) {
    //"stop" conditions to the
    if (cellI < 0 ||
        cellJ < 0 ||
        cellI === gBoard.length ||
        cellJ === gBoard.length ||
        gBoard[cellI][cellJ].isMine ||
        gBoard[cellI][cellJ].isShown) {
        return
    }
    //Handle current Cell
    var currentElement = getCellElement(cellI, cellJ)
    if (currentElement.innerText === FLAG && gBoard[cellI][cellJ].minesAroundCount === 0 && !gBoard[cellI][cellJ].isMine) { //removing "floating" flags 
        gBoard[cellI][cellJ].isMarked = false
        currentElement.innerText = ''
        gGame.markedCount--
        document.querySelector('.flag-counter').innerText = gLevel.mines - gGame.markedCount
    }
    var classToAdd = 'neg' + gBoard[cellI][cellJ].minesAroundCount
    currentElement.classList.add(classToAdd)
    gBoard[cellI][cellJ].isShown = true
    gGame.shownCount++
    // Stop also when getting to cell with some negs. We do it after the set of initial "stop" conditions, as we want to open this cell as well
    if (gBoard[cellI][cellJ].minesAroundCount > 0) {
        return
    }
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            expendedReveal(i, j)
        }
    }
}

function cellMarked(elCell, i, j, clickEvent) {
    clickEvent.preventDefault()//Cancel context-menu 
    if (!gGame.isON) return
    if (gIsFirstMove) return // can't put flags before game starts
    var currCell = gBoard[i][j]
    if (currCell.isShown) return
    var audioClick = new Audio("sound/click.wav");
    audioClick.play();
    if (currCell.isMarked) {
        gGame.markedCount--
        if (currCell.isMine) gGame.markedMines--
        elCell.innerText = currCell.isMine ? MINE : currCell.minesAroundCount //reverting to what belwo the flag
        currCell.isMarked = false
        elCell.classList.remove('revealed') //hide the cell again
    }
    else {
        gGame.markedCount++;
        if (currCell.isMine) gGame.markedMines++
        elCell.innerText = FLAG
        currCell.isMarked = true
        elCell.classList.add('revealed')
        checkGameOver() //Marking can be a winning condition (marking the last mine)
    }
    document.querySelector('.flag-counter').innerText = gLevel.mines - gGame.markedCount
}

function checkGameOver() {
    if (gGame.markedCount === gGame.markedMines &&
        gGame.shownCount === (gLevel.size ** 2) - gGame.markedMines &&
        gGame.markedMines > 0) finishGame(true)
}


function toggleMinePlacment(elMinesPlaceInput) {

    gGame.autoPlaceMines = elMinesPlaceInput.value === 'Auto' ? true : false
    //Need to render the booard according to the new difficuly level
    var inputs = (document.querySelectorAll('.difficulty-picker'))
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].checked) {
            setDiffulty(inputs[i])
        }
    }
}

function placeMines(numOfBombs) {
    if (!gGame.autoPlaceMines) manualPlaceMines()
    else { //auto place mines in random places
        var cells = []
        var id = 0
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard.length; j++) {
                cells[id] = ({ id: id, i: i, j: j })
                id++
            }
        }
        for (var i = 0; i < numOfBombs; i++) {
            var randomIndex = getRandomIntInclusive(0, cells.length - 1)
            var mineCell = cells.splice(randomIndex, 1)
            var cell = gBoard[mineCell[0].i][mineCell[0].j]
            if (cell.isFirst) i-- //making sure not to put the mine on the first clicked cell
            else cell.isMine = true
        }
    }
}

function manualPlaceMines() {
    var numOfMines = +prompt('How many mines you want to plant?')
    while (numOfMines < 1 || numOfMines > gBoard.length ** 2) {
        if (numOfMines === 0) break
        numOfMines = +prompt('Can\'t fit on current board.. How many mines you want to plant?')
    }
    gLevel.mines = numOfMines
    document.querySelector('.flag-counter').innerText = gLevel.mines
}

function createCell(minesAroundCount = 0, isShown = false, isMine = false, isMarked = false, isFirst = false) {
    var cell = {
        id: gCellId++,
        minesAroundCount: minesAroundCount,
        isShown: isShown,
        isMine: isMine,
        isMarked: isMarked,
        isFirst: isFirst
    }
    return cell
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            var NegCount = countNegMines(i, j, board)
            board[i][j].minesAroundCount = NegCount
        }
    }
}


function countNegMines(cellI, cellJ, mat) {
    var minesAroundCellCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue; //Check illegel rows
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue; //Ignore the middle cell
            if (j < 0 || j >= mat.length) continue; //Check illegel cols
            if (mat[i][j].isMine) minesAroundCellCount++;
        }
    }
    return minesAroundCellCount;
}

function renderBoard(board) {
    var strHtml = ''
    for (var i = 0; i < board.length; i++) {
        strHtml += '<tr>'
        for (var j = 0; j < board.length; j++) {
            var currCell = (board[i][j])
            var className = 'cell cell-' + i + '-' + j;
            var cellContent = currCell.isMine ? MINE : currCell.minesAroundCount
            strHtml += `<td  onclick="cellClicked(this,${i},${j})" oncontextmenu="cellMarked(this,${i}, ${j}, event)" class="${className}">${cellContent}</td>`
        }
        strHtml += '</tr>'
    }
    document.querySelector('.board').innerHTML = strHtml
}

function explode() {
    var elBoard = document.querySelector('.board')
    elBoard.classList.toggle('rotated-left')
}

function buildBoard(size) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            board[i][j] = createCell()
        }
    }
    return board;
}