const PACMAN = '&#9786;';
const SUPER_PACMAN = '😊';
const SUPER_FREQ = 5000

var gPacman;
var gSuperInterval
var gPacmanStartRow = 4;
var gPacmanStartCol = 4;

function createPacman(board) {
  gPacman = {
    location: {
      i: gPacmanStartRow,
      j: gPacmanStartCol
    },
    isSuper: false,
    image: PACMAN,
    image_path: `imgs/pcman_right`,
  };
  board[gPacman.location.i][gPacman.location.j] = gPacman.image;

}

function movePacman(eventKeyboard) {
  if (!gGame.isOn) return;
  // console.log('eventKeyboard:', eventKeyboard);

  var nextLocation = getNextLocation(eventKeyboard);
  // User pressed none-relevant key in the keyboard
  if (!nextLocation) return;

  var nextCell = gBoard[nextLocation.i][nextLocation.j];

  // Hitting a WALL, not moving anywhere
  if (nextCell === WALL) return;

  //If pacman eats a SUPER_FOOD when he is already isSuper, don’t eat!
  if (nextCell === POWER_FOOD && gPacman.isSuper) return;

  // Hitting FOOD? update score
  if (nextCell === FOOD) {
    updateScore(1);
    gFoodCount--
    document.querySelector('header h4 span').innerText = gFoodCount;
  }

  else if (nextCell === POWER_FOOD) {
    gPacman.isSuper = true;
    clearInterval(gSuperInterval)
    gPacman.image = SUPER_PACMAN
    renderCell(gPacman.location, getPacmanHTML(gPacman.isSuper))
    document.querySelector('header h4 span').innerText = gFoodCount;
    gSuperInterval = setTimeout(function () {
      gPacman.isSuper = false;
      gPacman.image = PACMAN
      renderCell(gPacman.location, getPacmanHTML(gPacman.isSuper))
      //resetGhosts()
    }, SUPER_FREQ);
  }
  else if (nextCell === CHERRY) updateScore(10);
  else if (nextCell === GHOST) {
    if (!gPacman.isSuper) {
      gameOver(false)
      return;
    }
    else { //Super Pac man is eating the ghost
      removeGhost(nextLocation)
    }
  }

  // Update the model to reflect movement
  gBoard[gPacman.location.i][gPacman.location.j] = EMPTY;
  // Update the DOM
  renderCell(gPacman.location, EMPTY);

  // Update the pacman MODEL to new location  
  gPacman.location = nextLocation;

  gBoard[gPacman.location.i][gPacman.location.j] = gPacman.image;
  // Render updated model to the DOM
  //renderCell(gPacman.location, gPacman.image);
  renderCell(gPacman.location, getPacmanHTML())

  if (gFoodCount === 0) gameOver(true)
}

function getNextLocation(keyboardEvent) {
  var nextLocation = {
    i: gPacman.location.i,
    j: gPacman.location.j
  };

  switch (keyboardEvent.code) {
    case 'ArrowUp':
      nextLocation.i--;
      gPacman.image_path = gPacman.isSuper? 'imgs/pcman_up_super' : 'imgs/pcman_up'
      break;
    case 'ArrowDown':
      nextLocation.i++;
      gPacman.image_path = gPacman.isSuper? 'imgs/pcman_down_super' : 'imgs/pcman_down'
      break;
    case 'ArrowLeft':
      nextLocation.j--;
      gPacman.image_path = gPacman.isSuper? 'imgs/pcman_left_super' : 'imgs/pcman_left'
      break;
    case 'ArrowRight':
      nextLocation.j++;
      gPacman.image_path = gPacman.isSuper? 'imgs/pcman_right_super' : 'imgs/pcman_right'
      break;
    default: return null;
  }
  return nextLocation;
}


// there is never use of isStatic
function getPacmanHTML(isSuper,isStatic) {
  var str=''
  var suffix='.png'
  if (isSuper) str='_super'
  var strHTML = `<span><img src="${gPacman.image_path}${str}${suffix}" height="20px"></span>`
  return strHTML
}
