'use strict'

function getCellElement(i, j) {
    var className = '.cell-' + i + '-' + j
    var elCell = document.querySelector(className)
    return elCell
}


function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}