'use strict'

const SORT_ASC = '⬆️'
const SORT_DESC = '⬇️'

var gBookId

function onInit() {
    document.querySelector('.price-update-modal').hidden = true
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
    return `<tr><th scope="row">${idx + 1}</th><td>${book.id}</td><td>${book.name}</td><td>${+book.price}</td><td>${+book.rating}</td>
        <td class="actions">
            <button type="button" class="btn btn-primary" onclick="renderBookDetails('${book.id}')" data-trans="readBook">Read</button>
            <button type="button" class="btn btn-secondary" onclick="onUpdateBook('${book.id}')" data-trans="updateBook">Update</button>
            <button data-trans="deleteBook" type="button" class="btn btn-danger" onclick="onSetBookIDtoDelete('${book.id}')"  data-toggle="modal" data-target="#deleteBookConfirm">Delete</button> 
        </td>
    </tr> 
    `
}

// @CR: you send the bookId to the render function no need to save the id in the global var
function onSetBookIDtoDelete(bookId) {
    gBookId = bookId
    renderDeleteConfirmModal(bookId)
}

// @CR: never in use
function getCurrentBookID() {
    return gBookId
}

// @CR: this is a huge function of render with only one small variable to render
// @CR: you send bookId at onSetBookID.... but you dont receive it here
function renderDeleteConfirmModal() {
    const bookIdToDelete = getBookbyID(gBookId)
    const bookName=bookIdToDelete.name
    const modalHTML = `<div class="modal fade" id="deleteBookConfirm" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-sm" role="document">
        <div class="modal-content">
        <div class="modal-header modal-bg-color">
        <h5 class="modal-title" id="exampleModalLabel">Deleting "${bookName}"!</h5>
        </div>
            <div data-trans="deleteConfirm" class="modal-body modal-bg-color">
                Are you sure?
            </div>
            <div class="modal-footer modal-bg-color">
                <button data-trans="cancel" type="button" class="btn btn-secondary"
                    data-dismiss="modal">Cancel</button>
                <button data-trans="approveInput" type="button" onclick="onRemoveBook(gBookId)"
                    class="btn btn-primary" data-dismiss="modal">Delete</button>
            </div>
        </div>
    </div>
</div>`

    document.querySelector('.confirmModal').innerHTML = modalHTML
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

// @CR: you could write this in utils file :)
function renderPaging() {
    var elPaging = document.querySelector('.page-numbers');
    var numOfPages = getNumOfPages()
    var strHTML = ''
    for (var i = 0; i < numOfPages; i++) {
        strHTML += `<button onclick="onSwitchToPage(this,${i + 1})">${i + 1}</button>`
    }
    elPaging.innerHTML = strHTML
}

// @CR: if you use this then button should be elButton
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
    const elIncRateButton = elModal.querySelector('.inc-rate-btn')
    const ellowerRateButton = elModal.querySelector('.lower-rate-btn')
    var currRate = elModal.querySelector('.book-rate').innerText

    elIncRateButton.classList.remove('disabled-button')
    ellowerRateButton.classList.remove('disabled-button')

    var newRate = +currRate + rateInc
    elModal.querySelector('.book-rate').innerText = newRate

    //Handle new rate
    if (newRate === 10) {
        elIncRateButton.classList.add('disabled-button')
    }
    if (newRate === 0) {
        ellowerRateButton.classList.add('disabled-button')
    }
}

function onUpdateRate() {
    const elModal = document.querySelector('.book-details-modal')
    const elBookId = elModal.querySelector('input[name="book-id"]')
    const elBookRate = elModal.querySelector('.book-rate')
    elModal.hidden = true
    updateBook(elBookId.value, 'rating', +elBookRate.innerText)
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


function onRemoveBook(bookId) {

    
    removeBook(bookId)
    renderBooks()
    renderPaging()
    handlePagination()

}

function onAddBook() {
    const elNameInput = document.querySelector('input[name="bookName"]')
    const elPriceInput = document.querySelector('input[name="bookPrice"]')
    if (!elNameInput.value || !elPriceInput.value) {
        elNameInput.value = ''
        elPriceInput.value = ''
        return
    }
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


function onSetItemsPerPage() {
    var items = document.querySelector('input[name="items-per-page"]').value
    if (items <= 0) return
    setItemsPerPage(items)
    renderBooks()
    renderPaging()
    handlePagination()
}

function onSetLanguage(selection) {
    document.querySelector('.book-details-modal').hidden = true
    setLanguage(selection);
    doTrans();
}