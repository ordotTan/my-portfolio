'use strict'

var gProjects = []

var gProjIDs = [
    'bookshop',
    'pacman',
    'minesweeper'
]

var gProjNames = [
    'Book-Shop',
    'Pac-Man',
    'Minesweeper'
]

var gProjTitles = [
    'Book-Shop',
    'Pac-Man',
    'Minesweeper'
]

var gProjDescs = [
    'Managing your book collection',
    'Play the nostalgic game of Pac-man',
    'Another Classic from the 90\'s'
]

var gProjDates= [
    '25-March-2020',
    '15-Match-2020',
    '18-Match-2020'
]

var gProjLabels = [
    ["CRUD", "MVC"],
    ["Matrixes", "keyboard events"],
    ["Matrixes", "Javascript"]
]


function getProjectsForRender(){
    return gProjects
}

function createProjcets() {
    for (var i=0;i<gProjIDs.length;i++) {
        var url = '../projs/'+gProjIDs[i]+'/index.html'
        var project = _createProject(gProjIDs[i],gProjTitles[i],
            gProjNames[i], gProjDescs[i],url,gProjDates[i],gProjLabels[i] )
        gProjects.push(project)
    }
}

function _createProject(id, name, title, desc, url, publishedAt, labels) {
    return {
        id: id,
        name: name,
        title: title,
        desc: desc,
        url: url,
        publishedAt: publishedAt,
        labels: labels
    }
}