'use strict';

const KEY = 'theTodos';

var gTodos = _createTodos();
var gFilterBy = 'all';
var gSortBy = 'time';


function getTodosForDisplay() {
    sortTodos()
    if (gFilterBy === 'all') return gTodos;

    const todos = gTodos.filter(todo =>
        (todo.isDone && gFilterBy === 'done') ||
        (!todo.isDone && gFilterBy === 'active'))
    return todos;

}

function removeTodo(todoId) {
    const idx = gTodos.findIndex(todo => todo.id === todoId)
    gTodos.splice(idx, 1);
    _saveTodosToStorage()

}

function addTodo(txt) {
    var todoText = txt.split(',')[0]
    var totoImportane = parseInt(txt.split(',')[1])
    const todo = _createTodo(todoText, totoImportane);
    gTodos.unshift(todo);
    _saveTodosToStorage()
}

function getTodoPosition(todoId) {
    return gTodos.findIndex(todo => todo.id === todoId)
}

function toggleTodo(todoId) {
    const todo = gTodos.find(todo => todo.id === todoId)
    todo.isDone = !todo.isDone;
    _saveTodosToStorage()
}

function setFilter(filterBy) {
    gFilterBy = filterBy;
}

function setSort(sortBy) {
    gSortBy = sortBy;
}

function sortTodos() {
    gTodos.sort(function (todo1, todo2) {
        switch (gSortBy) {
            case 'time':
                if (todo1.createdAt < todo2.createdAt) return 1;
                if (todo1.createdAt > todo2.createdAt) return -1;
                return 0
            case 'txt':
                if (todo1.txt.toLowerCase() > todo2.txt.toLowerCase()) return 1;
                if (todo1.txt.toLowerCase() < todo2.txt.toLowerCase()) return -1;
                return 0
            case 'importance':
                if (todo1.importance < todo2.importance) return 1;
                if (todo1.importance > todo2.importance) return -1;
                break;
            case 'manual':
                break;

        }
    })
}


function moveTodo(todoId, direction) {
    gSortBy = 'manual'
    document.querySelector('.sort-dropdown').selected=true
    const currPosition = gTodos.findIndex(todo => todo.id === todoId)
    const todo = gTodos.find(todo => todo.id === todoId)
    const newPositoin = currPosition + direction
    const tempObj = gTodos[newPositoin]

    gTodos[newPositoin] = todo
    gTodos[currPosition] = tempObj

}


function getTotalCount() {
    return gTodos.length
}
function getActiveCount() {
    const activeTodos = gTodos.filter(todo => !todo.isDone)
    return activeTodos.length;
}

function getDoneCount() {
    const doneTodos = gTodos.filter(todo => todo.isDone)
    return doneTodos.length;
}

function _saveTodosToStorage() {
    saveToStorage(KEY, gTodos)
}


function _createTodos() {

    var todos = loadFromStorage(KEY)
    if (todos && todos.length) return todos;

    todos = [];
    todos.push(_createTodo('Wash your hands', 3))
    todos.push(_createTodo('Stay at home', 1))

    saveToStorage(KEY, todos)

    return todos;
}

function _createTodo(txt, importance) {
    return {
        id: makeId(),
        createdAt: Math.round((new Date()).getTime()),
        txt: txt,
        importance: importance,
        isDone: false
    }
}


function makeId(length = 5) {
    var id = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        id += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return id;
}

