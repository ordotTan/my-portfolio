'use strict';

// NOTE: This is a global used only in the controller
var gLastRes = null;

$(document).ready(init);

function init() {
    $('#endGame').modal('hide')
    createQuestsTree();
}

function onStartGuessing() {
    $('.box img').attr('src', 'img/layout/think.png')
    $('.game-start').hide()
    $('.quest').css('display', 'block')
    renderQuest();
}

function renderQuest() {
    var quest = getCurrQuest()
    $('.quest h1').text(quest.txt)

}

function onUserResponse(res) {

    if (isChildless(getCurrQuest())) {   // If this node has no children
        if (res === 'yes') { //Game over 
            $('#endGame').modal('show')
            $('.quest').css('display', 'none')
            $('h5').text('I knew it! you thought of '+gCurrQuest.entity)
            $('.box img').attr('src', 'img/layout/win.png')
            setTimeout(function () {
                $('.box img').attr('src', 'img/layout/logo2.png')
                onRestartGame();
            }, 2500);
            return;
        } else {  // Learning new question
            $('.spinner-border').hide()
            $('.quest').css('display', 'none')
            $('.new-quest').css('display', 'block')
            $('.box img').attr('src', 'img/layout/logo2.png')

        }
    } else { // moving to next question in the tree
        gLastRes = res
        moveToNextQuest(res);
        renderQuest();
    }
}

function onAddGuess(ev) {
    ev.preventDefault();
    $('.spinner-border').show()
    $('.form-horizontal').hide()
    $('.new-quest h2').text('Getting smarter...')
    $('.box img').attr('src', 'img/layout/memorize.png')
    var newGuess = $('#newGuess').val()
    var newQuestion = $('#newQuest').val()
    addGuess(newQuestion, newGuess, gLastRes)
    $('#newGuess').val('')
    $('#newQuest').val('')
    $('.spinner-border').show()
    setTimeout(function () {
        $('.box img').attr('src', 'img/layout/logo2.png')
        $('.new-quest h2').text('Make me Smarter!')
        $('.form-horizontal').show()
        $('.spinner-border').hide()
        onRestartGame();
    }, 2500);

}


function onRestartGame() {
    $('.new-quest').hide();
    $('.game-start').show();
    initQuestionsTree()
    gLastRes = null;
}