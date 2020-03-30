const GHOST = '&#9781;';
const GHOST_FREQ = 500

var gIntervalGhosts;
var gDeadGhostInterval
var gGhosts;
var gGhostIdx = 101
var gGhostsBaseRow = 2;
var gGhostsBaseCol = 2;


function createGhost(board) {
    var ghost = {
        id: gGhostIdx++,
        location: {
            i: gGhostsBaseRow,
            j: gGhostsBaseCol
        },
        currCellContent: FOOD,
        color: getRandomColor()

    };
    gGhosts.push(ghost);
    board[ghost.location.i][ghost.location.j] = GHOST;
}


function createGhosts(board) {
    gGhosts = [];

    // empty the gGhosts array, create some ghosts
    createGhost(board)
    createGhost(board)
   // createGhost(board)
   // createGhost(board)
    gGhostsBackup = gGhosts.slice()
    //  and run the interval to move them

    gIntervalGhosts = setInterval(moveGhosts, GHOST_FREQ)
}

function removeGhost(location) { // when PCMAN eats a ghost
    for (var i = 0; i < gGhosts.length; i++) {
        if (gGhosts[i].location.i === location.i && gGhosts[i].location.j === location.j) {
            var deletedGhost = gGhosts.splice(i, 1)
            if (deletedGhost[0].currCellContent === FOOD) { //handle the case when the ghost is on food token
                updateScore(1)
                gFoodCount--
                document.querySelector('header h4 span').innerText = gFoodCount;
                deletedGhost[0].currCellContent = EMPTY
            }
        }
    }
    gDeadGhostInterval = setTimeout(function () {
        gGhosts.push(deletedGhost[0])
      }, SUPER_FREQ);
}


// CR: each ghost should have its own "timer" of 5 seconds --> Fixed it :) 
// function resetGhosts() {
//     gGhosts.push(...gDeletedGhosts)
//     gDeletedGhosts = []
// }

function moveGhosts() {
    for (var i = 0; i < gGhosts.length; i++) {
        var ghost = gGhosts[i];

        // Create the moveDiff
        var moveDiff = getMoveDiff();
        var nextLocation =
        {
            i: ghost.location.i + moveDiff.i,
            j: ghost.location.j + moveDiff.j
        }
        var nextCell = gBoard[nextLocation.i][nextLocation.j]
        // if WALL - give up
        if (nextCell === WALL) return
        // if POWER_FOOD - give up
        if (nextCell === POWER_FOOD) return
        // if GHOST - give up
        if (nextCell === GHOST) return
        // if SUPER_PACMAN - give up
        if (nextCell === SUPER_PACMAN) return
        // if PACMAN - gameOver
        if (nextCell === PACMAN) {
            if (!gPacman.isSuper) {
                gameOver(false)
                return
            }
            else return
        }

        // set back what we stepped on: update Model, DOM
        gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent
        renderCell(ghost.location, ghost.currCellContent)

        // move the ghost
        ghost.location = nextLocation

        // keep the contnet of the cell we are going to
        ghost.currCellContent = gBoard[nextLocation.i][nextLocation.j]

        // move the ghost and update model and dom
        gBoard[ghost.location.i][ghost.location.j] = GHOST
        renderCell(ghost.location, getGhostHTML(ghost))
        // console.table(gBoard);
    }
}
function getMoveDiff() {
    var randNum = getRandomIntInclusive(0, 100)
    if (randNum < 25) {
        return { i: 0, j: 1 }
    } else if (randNum < 50) {
        return { i: -1, j: 0 }
    } else if (randNum < 75) {
        return { i: 0, j: -1 }
    } else {
        return { i: 1, j: 0 }
    }
}

function getGhostHTML(ghost) {
    var color = (gPacman.isSuper) ? '#2D0FF0' : ghost.color
    var strHTML = `<span style="color:${color}">${GHOST}</span>`
    return strHTML
}