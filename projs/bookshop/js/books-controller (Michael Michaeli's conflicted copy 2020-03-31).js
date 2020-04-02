'use strict'

const SORT_ASC = '⬆️'
const SORT_DESC = '⬇️'

var gBookId

function onInit() {
    document.querySelector('.price-update-modal').hidden = true
   // document.querySelector('.add-book-input').hidden = true
    createBooks()
    renderBooks()
    renderPaging()
    handlePagination()
}

function renderBooks() {
    var books = getBooksForRender()
    var strHtmls = books.map(getBookHTML)
    document.querySelector('.books-content').innerHTML = strHtmls.join('')
    doTrans();
    handleSortIcons();
}

function getBookHTML(book, idx) {
    return `<tr><td>${idx + 1}</td><td>${book.id}</td><td>${book.name}</td><td>${+book.price}</td><td>${+book.rating}</td>
        <td class="actions">
            <button type="button" class="btn btn-primary" onclick="renderBookDetails('${book.id}')" data-trans="readBook">Read</button>
            <button type="button" class="btn btn-primary" onclick="onUpdateBook('${book.id}')" data-trans="updateBook">Update</button>
            <button data-trans="deleteBook" type="button" class="btn btn-primary" onclick="onSetBookIDtoDelete('${book.id}')"  data-toggle="modal" data-target="#deleteBookConfirm">Delete</button> 
        </td>
    </tr> 
    `
}


function onSetBookIDtoDelete(bookId) {
    gBookId = bookId
}


function renderBookDetails(bookId) {
    const elModal = document.querySelector('.book-details-modal')
    const book = getBookbyID(bookId)

    //Handle starting rate
    const elIncRateButton = elModal.querySelector('.inc-rate-btn')
    const ellowerRateButton = elModal.querySelector('.lower-rate-btn')
    elIncRateButton.classList.remove('disabled-button')
    ellowerRateButton.classList.remove('disabled-button')
    if (book.rating === 10)
        elIncRateButton.classList.add('disabled-button')
    if (book.rating === 0)
        ellowerRateButton.classList.add('disabled-button')

    //Render the modal
    document.querySelector('.price-update-modal').hidden = true
    elModal.querySelector('input[name="book-id"]').value = bookId
    elModal.hidden = false
    var imgPath = book.imgURL ? book.imgURL : 'defaultBook.jpg'
    elModal.querySelector('img').src = 'img/' + imgPath
    elModal.querySelector('img').title = book.name
    elModal.querySelector('.book-rate').innerText = book.rating
    elModal.querySelector('p').innerText = book.desc
    elModal.querySelector('h2').innerText = book.name
    elModal.querySelector('h3').innerText = 'Price: ' + book.price + '$'
}


function renderPaging() {
    var elPaging = document.querySelector('.page-numbers');
    var numOfPages = getNumOfPages()
    var strHTML = ''
    for (var i = 0; i < numOfPages; i++) {
        strHTML += `<button onclick="onSwitchToPage(this,${i + 1})">${i + 1}</button>`
    }
    elPaging.innerHTML = strHTML
}

function onSwitchToPage(button, pageNum) {
    var elPageButtons = document.querySelectorAll('.page-numbers button');
    elPageButtons.forEach(button => button.classList.remove('active-page'))
    button.classList.add('active-page')
    switchPage(pageNum - 1)
    handlePagination()
    renderBooks()
}

function onNextPage() {
    var elCurrentPage = document.querySelector('.active-page')
    var elNextPage = document.querySelector('.active-page + button')
    elCurrentPage.classList.remove('active-page')
    elNextPage.classList.add('active-page')
    nextPage(elCurrentPage.innerText)
    handlePagination()
    renderBooks()
}

function onPrevPage() {
    var elCurrentPage = document.querySelector('.active-page')
    var currPage = elCurrentPage.innerText
    var elPrevPage = document.querySelector(`.page-numbers button:nth-child(${currPage - 1})`)
    elCurrentPage.classList.remove('active-page')
    elPrevPage.classList.add('active-page')
    prevPage(currPage - 1)
    handlePagination()
    renderBooks()
}

function handlePagination() {
    const currPageIndex = +getCurrPageIndex()
    const totalPages = getNumOfPages()
    if (totalPages === 0) return

    var elCurrPage = document.querySelector(`.page-numbers button:nth-child(${currPageIndex + 1})`)
    elCurrPage.classList.add('active-page')
    if (currPageIndex === 0)
        document.querySelector('.prev-page-button').classList.add('disabled-button')
    else
        document.querySelector('.prev-page-button').classList.remove('disabled-button')

    if (parseInt(currPageIndex) >= totalPages - 1)
        document.querySelector('.next-page-button').classList.add('disabled-button')
    else
        document.querySelector('.next-page-button').classList.remove('disabled-button')
}

function onCloseBookDetailsModal() {
    document.querySelector('.book-details-modal').hidden = true
}
function onClosePriceUpdate() {
    document.querySelector('.price-update-modal').hidden = true
}

function onRateClick(rateInc) {
    const elModal = document.querySelector('.book-details-modal')
    const elBookId = elModal.querySelector('input[name="book-id"]')
    const elIncRateButton = elModal.querySelector('.inc-rate-btn')
    const ellowerRateButton = elModal.querySelector('.lower-rate-btn')

    elIncRateButton.classList.remove('disabled-button')
    ellowerRateButton.classList.remove('disabled-button')

    updateBook(elBookId.value, 'rating', rateInc)
    const newRate = getBookbyID(elBookId.value).rating
    elModal.querySelector('.book-rate').innerText = newRate
    //Handle new rate
    if (newRate === 10) {
        elIncRateButton.classList.add('disabled-button')
    }
    if (newRate === 0) {
        ellowerRateButton.classList.add('disabled-button')
    }
    renderBooks()
}

function onUpdateBook(bookId) {
    onCloseBookDetailsModal()
    const elModal = document.querySelector('.price-update-modal')
    const book = getBookbyID(bookId)
    const elBookId = elModal.querySelector('input[name="book-id"]')
    elBookId.value = bookId
    elModal.hidden = false
    elModal.querySelector('input[name="price"]').value = book.price
    elModal.querySelector('input[name="price"]').focus();
    elModal.querySelector('.book-to-update').innerText = book.name

}


function onPriceUpdate() {
    const elBookId = document.querySelector('.price-update-modal input[name="book-id"]')
    const elPriceInput = document.querySelector('.price-update-modal input[name="price"]')
    updateBook(elBookId.value, 'price', elPriceInput.value)
    document.querySelector('.price-update-modal').hidden = true
    elBookId.value = ''
    elPriceInput.value = ''
    renderBooks()
}


function renderConfirmDeleteModal(bookId) {
    var elModal = document.querySelector('#deleteBookConfirm');
    elModal.hidden = false
    console.log(elModal)
    //$('#deleteBookConfirm').modal('show')
}

function onRemoveBook(bookId) {
    // var isConfirm = confirm('Are you sure?')
    //if (isConfirm) {
    removeBook(bookId)
    renderBooks()
    renderPaging()
    handlePagination()
    // }
}

function onAddBook() {
    const elNameInput = document.querySelector('.input[name="name"]')
    const elPriceInput = document.querySelector('.input[name="price"]')
    addBook(elNameInput.value, elPriceInput.value)
    elNameInput.value = ''
    elPriceInput.value = ''
    renderBooks()
    renderPaging()
    handlePagination()
}

function onSort(sortBy) {

    var sortType = getSortType()
    if (sortType === 1) { //Now it's in ASC mode. Need to set DESC mode
        setSortType(sortBy, -1)
    }
    else { //Now it's in DESC mode. Need to set ASC mode
        setSortType(sortBy, 1)
    }
    renderBooks();
}


function handleSortIcons() {
    var sortBy = getSortBy()
    var sortType = getSortType()
    var elSortType = document.querySelector('.sort-' + sortBy);
    if (sortType === -1) { //Now it's in ASC mode. Need to set DESC mode
        elSortType.classList.add('active-sort')
        elSortType.innerText += SORT_DESC
    }
    else { //Now it's in DESC mode. Need to set ASC mode
        elSortType.classList.add('active-sort')
        elSortType.innerText += SORT_ASC
    }

}

function onShowAddBookToggle() {
    var buttonText = document.querySelector('.add-book-button').innerText
    if (buttonText === 'Add New Book') {
        document.querySelector('.add-book-input').hidden = false
        document.querySelector('.add-book-button').innerText = 'Close'
    }
    else {
        document.querySelector('.add-book-input').hidden = true
        document.querySelector('.add-book-button').innerText = 'Add New Book'

    }
}

function onSetItemsPerPage() {
    var items = document.querySelector('input[name="items-per-page"]').value
    if (items <= 0) return
    setItemsPerPage(items)
    renderBooks()
    renderPaging()
    handlePagination()
}