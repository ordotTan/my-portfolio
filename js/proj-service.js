'use strict'
// Order of apps:
// 1.bookshop
// 2.pacman
// 3.minesweeper
// 4.Guessme
// 5.touchNums
// 6.ballBoard
var gProjects = []

var gProjIDs = [
    'bookshop',
    'pacman',
    'minesweeper',
    'guessMe',
    'touchNums',
    'ballBoard'
]

var gProjNames = [
    'Book-Shop',
    'Pac-Man',
    'Minesweeper',
    'Guess-Me',
    'Touch-the-Numbers',
    'Balls-on-Board'
]

var gProjTitles = [
    'Book-Shop',
    'Pac-Man',
    'Minesweeper',
    'Guess-Me',
    'Touch-the-Numbers',
    'Balls-on-Board'
]

var gProjDescs = [
    'Managing your book collection',
    'Play the nostalgic game of Pac-man',
    'Another classic hit from the 90\'s',
    'Challange the Jini in this variation to the "21 Questions Game"',
    'Check how fast your fingres are looking for the correct number',
    'Can you collect all the balls fast enough?'
]

var gProgLongDesc = [
    'Book-shop web application that is implemented according the the CRUD & MVC concepts, and gives the user the full solution for books inventory management: Add books (Create), list all inventory (Read) modify data (Update) and remove books (Delete).',
    'Homage to the popular Pac-man game, where you need to eat all food, before getting caught by the evit spirits.',
    'An updated version to the classic Minesweepr game, with some special features that should help you flag all the bombs, before getting exploded',
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis corrupti recusandae error sapiente exercitationem obcaecati. Architecto atque corporis, qui omnis, vel voluptatem adipisci dolor quod vero sunt dicta hic ut?',
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis corrupti recusandae error sapiente exercitationem obcaecati. Architecto atque corporis, qui omnis, vel voluptatem adipisci dolor quod vero sunt dicta hic ut',
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis corrupti recusandae error sapiente exercitationem obcaecati. Architecto atque corporis, qui omnis, vel voluptatem adipisci dolor quod vero sunt dicta hic ut'
]

var gProjDates= [
    '26-March-2020',
    '16-Match-2020',
    '19-Match-2020',
    '29-Match-2020',
    '15-Match-2020',
    '15-Match-2020'

]

// Order of apps:
// 1.bookshop
// 2.pacman
// 3.minesweeper
// 4.Guessme
// 5.touchNums
// 6.ballBoard

var gProjLabels = [
    ["CRUD", "MVC"],
    ["Matrixes", "Keyboard Events"],
    ["Matrixes", "Functional Programming"],
    ["Bootstrap", "jquery"],
    ["Matrixes", "CSS"],
    ["Matrixes", "CSS"]
]


function getProjectsForRender(){
    return gProjects
}

function createProjcets() {
    for (var i=0;i<gProjIDs.length;i++) {
        var url = 'projs/'+gProjIDs[i]+'/index.html'
        var project = _createProject(gProjIDs[i],gProjTitles[i],
            gProjNames[i], gProjDescs[i],gProgLongDesc[i],url,gProjDates[i],gProjLabels[i] )
        gProjects.push(project)
    }
}

function _createProject(id, name, title, desc, longDesc, url, publishedAt, labels) {
    return {
        id: id,
        name: name,
        title: title,
        desc: desc,
        longDesc:longDesc,
        url: url,
        publishedAt: publishedAt,
        labels: labels
    }
}