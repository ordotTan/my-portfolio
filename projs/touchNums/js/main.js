'use strict'
var gLevel = 4; // 
var gInputNumbers = [] // use to simulate 1-Level numbers in
var gNumbers = [] // The radnom numbers array
var gCurrentNumber
var gInterval
var gStartTime

function init() {
    clearInterval(gInterval);
    document.querySelector('.mil-seconds').innerText = 'Game Time: 0.000 seconds'
    document.querySelector('.result').innerText = ''
    document.querySelector('.help-button').style.display = 'block'
    document.querySelector('.nextNumber').style.display = 'block'
    gCurrentNumber = 1;
    document.querySelector('.help-button').innerText = 'Locate ' + gCurrentNumber
    gNumbers = createNumbers(gLevel)
    renderBoard()
}

function setDiffulty(elInput) {
    if (elInput.value === 'Beginner') gLevel = 4
    else if (elInput.value === 'Easy') gLevel = 16
    else if (elInput.value === 'Hard') gLevel = 25
    else if (elInput.value === 'Extreme!') gLevel = 36
    init();
}

function checkNumber(elCell, number) {
    if (number === gCurrentNumber) {
        gCurrentNumber++
        document.querySelector('.help-button').innerText = 'Locate ' + gCurrentNumber
        elCell.classList.add('marked-cell')
        if (gCurrentNumber === 2) {
            gStartTime = Date.now();
            gInterval = setInterval(() => {
                var dif = Date.now() - gStartTime;
                var elMlSeconds = document.querySelector('.mil-seconds');
                elMlSeconds.innerText = 'Game Time: ' + dif / 1000 + ' seconds';
                if (gCurrentNumber > gLevel) {
                    clearInterval(gInterval)
                    document.querySelector('.help-button').style.display = 'none'
                    document.querySelector('.result').innerText = 'You won!'
                    document.querySelector('.nextNumber').style.display = 'none'
                    document.querySelector('.nextNumber').style.display = 'none'
                }
            }, 1);

        }
    }
}

function renderBoard() {
    var tempNumbers = gNumbers.slice()
    var number
    var rowCount = Math.sqrt(gLevel);
    var elBoard = document.querySelector('.board')
    var htmlStr = ''
    for (var j = 0; j < rowCount; j++) {
        htmlStr += '<tr>'
        for (var i = 0; i < rowCount; i++) {
            number = tempNumbers.pop()
            htmlStr += `<td onclick="checkNumber(this,${number})">${number}</td>`
        }
        htmlStr += '</tr>'
    }
    elBoard.innerHTML = htmlStr
}

function createNumbers(number) {
    var numbers = []
    for (var i = 0; i < number; i++) {
        gInputNumbers[i] = i + 1;
    }
    for (var i = 0; i < number; i++) {
        var currNumber = drawNum();
        numbers[i] = currNumber
    }
    return numbers
}

function drawNum() {
    var rndIdx = getRandomInt(0, gInputNumbers.length)
    var splicedNums = gInputNumbers.splice(rndIdx, 1); //Making sure to remove the item we selected from the list of item
    return splicedNums[0]
}



function handleKey(ev) {
    // TODO: close the modal if escape is pressed
    if (ev.key === 'h') getHelp()
}

function getHelp() {

    var elCells = document.querySelectorAll('td')
    for (var i = 0; i < elCells.length; i++) {
        var currCell = elCells[i]
        if (parseInt(currCell.innerText) === gCurrentNumber) {
            var cellToMark = currCell
            cellToMark.classList.add('help-cell')
            setTimeout(function () {
                cellToMark.classList.remove('help-cell')
            }, 600);
        }
    }

}