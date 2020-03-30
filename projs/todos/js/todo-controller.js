'use strict';

console.log('Todos Starting');

function onInit() {
    renderTodos();
}

function renderTodos() {

    var todos = getTodosForDisplay();
    var totalCount = getTotalCount()
    var totalActive = getActiveCount()
    var totalDone = getDoneCount()


    if (totalActive === 0) {
        document.querySelector('.todo-list').innerHTML = 'No active Todos'
    }

    if (totalDone === 0) {
        document.querySelector('.todo-list').innerHTML = 'No done Todos'
    }
    
    if (totalCount === 0) {
        document.querySelector('.todo-list').innerHTML = 'No Todos. Why not add a few?'
        return
    }

    if (todos.length > 0) {
        var strHTMLs = todos.map(getTodoHTML)
        document.querySelector('.todo-list').innerHTML = strHTMLs.join('');
    }

    document.querySelector('.total-todos').innerText = totalCount
    document.querySelector('.active-todos').innerText = totalActive
    document.querySelector('.done-todos').innerText = totalDone

}

function getTodoHTML(todo) {

    var strHTML = ''
    const className = (todo.isDone) ? 'done' : '';
    var classTodoUregency
    if (todo.importance === 1) classTodoUregency = 'todo-causal'
    else if (todo.importance === 2) classTodoUregency = 'todo'
    else classTodoUregency = 'todo-urgent'

    strHTML += `<li class="${className} ${classTodoUregency}" onclick="onToggleTodo('${todo.id}')">
    ${todo.txt}
    <div class="buttons">
    <button class="removeButton" onclick="onRemoveTodo(event, '${todo.id}')"><i class="fas fa-times"></i>

    </button>`

    var upHTML = `<button onclick="onMoveClick(event, '${todo.id}',-1)"><i class="fas fa-arrow-up"></i></button>`
    var downHTML = `<button onclick="onMoveClick(event, '${todo.id}',1)"><i class="fas fa-arrow-down"></i></button>`
    var todoPos = getTodoPosition(todo.id)
    if (todoPos === 0) strHTML += downHTML
    else if (todoPos === getTotalCount() - 1) strHTML += upHTML
    else strHTML += downHTML + upHTML

    strHTML += `</div></li>`
    return strHTML
}

function onRemoveTodo(event, todoId) {
    event.stopPropagation();
    var isConfirm = confirm('Are you sure?')
    if (isConfirm) {
        removeTodo(todoId)
        renderTodos();
    }
}

function onAddTodo() {
    var txt = prompt('What todo? What priority?', 'Todo desc,3');
    while (txt.length === 0) {
        txt = prompt('What todo? What priority?', 'Todo desc,3');
    }
    addTodo(txt)
    renderTodos();

}

function onToggleTodo(todoId) {
    toggleTodo(todoId)
    renderTodos();
}

function onFilterChange(filterBy) {
    setFilter(filterBy);
    renderTodos();
}

function onSortChange(sortBy) {
    setSort(sortBy);
    renderTodos();
}

function onMoveClick(event, todoId, direction) {
    event.stopPropagation();
    moveTodo(todoId, direction)
    renderTodos();
}