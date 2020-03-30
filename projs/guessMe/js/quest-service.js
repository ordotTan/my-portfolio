'use strict'

const KEY = 'questions'
var gQuestsTree;
var gCurrQuest;
var gPrevQuest = null;

function createQuestsTree() {
    var questions = loadFromStorage(KEY)
    if (!questions) {
        gQuestsTree = createQuest('Male?');
        gQuestsTree.yes = createQuest('Is it Gandhi?','Gandhi');
        gQuestsTree.no = createQuest('Is it Rita?','Rita');
        gCurrQuest = gQuestsTree;
        gPrevQuest = null;
        _saveQuests()
    } else {
        gQuestsTree = questions
        gCurrQuest = questions
        gPrevQuest = null;
    }
}

function createQuest(txt,entity) {
    return {
        txt: txt,
        entity: entity,
        yes: null,
        no: null
    }
}

function isChildless(node) {
    return (node.yes === null && node.no === null)
}

function moveToNextQuest(res) {
    gPrevQuest = gCurrQuest
    gCurrQuest = gCurrQuest[res]

}

function addGuess(newQuestTxt, newGuessTxt, lastRes) {
    var newGuessFull = 'Is it '+newGuessTxt+'?'
    var newQuest = createQuest(newQuestTxt)
    var newGuess = createQuest(newGuessFull,newGuessTxt)
    newQuest.yes = newGuess
    newQuest.no = gCurrQuest
    gPrevQuest[lastRes] = newQuest
    _saveQuests()

}

function getCurrQuest() {
    return gCurrQuest
}

function initQuestionsTree() {
    gCurrQuest = gQuestsTree;
}



function _saveQuests() {
    saveToStorage(KEY, gQuestsTree)
}
