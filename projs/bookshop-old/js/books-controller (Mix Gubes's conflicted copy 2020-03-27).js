'use strict'

const SORT_ASC = '⬆️'
const SORT_DESC = '⬇️'

function onInit() {
    console.log('Bookshop!')
    document.querySelector('.price-update-modal').hidden = true
    document.querySelector('.add-book').hidden = true
    createBooks()
    renderBooks()
    document.querySelector('.sort-name span').innerText=SORT_ASC
    renderPaging()
    document.querySelector('.page-numbers button:first-child').classList.add('active-page')
 
}


function renderBooks() {
    var books = getBooks()
    var strHtmls = books.map(function getBookHTML(book) {
        return `<tr><td>${book.id}</td><td>${book.name}</td><td>${+book.price}</td><td>${+book.rating}</td>
            <td class="actions">
                <button onclick="renderBookDetails('${book.id}')">Read</button>
                <button onclick="onUpdateBook('${book.id}')">Update</button>
                <button onclick="onRemoveBook('${book.id}')">Delete</button>
            </td>
        </tr> 
        `
    })
    document.querySelector('.books-content').innerHTML = strHtmls.join('')
}

//todo - complete modal details 
function renderBookDetails(bookId) {
    document.querySelector('.price-update-modal').hidden = true

    const book = getBookbyID(bookId)
    const elModal = document.querySelector('.book-details-modal')
    elModal.querySelector('input[name="book-id"]').value = bookId
    elModal.hidden = false
    var imgPath = book.imgURL? book.imgURL :'defaultBook.jpg' 
    elModal.querySelector('img').src = '/img/' + imgPath 
    elModal.querySelector('.book-rate').innerText = book.rating
}


function renderPaging() {
    var elPaging=document.querySelector('.page-numbers');
    var numOfPages = getNumOfPages()
    var strHTML = ''
    for (var i=0;i<numOfPages;i++) {
        strHTML+=`<button onclick="onSwitchToPage(this,${i+1})">${i+1}</button>`
    }
    elPaging.innerHTML=strHTML
}

function onSwitchToPage(button,pageNum) {
    var elPageButtons = document.querySelectorAll('.page-numbers button');
    elPageButtons.forEach(button => button.classList.remove('active-page'))
    button.classList.add('active-page')
    switchPage(pageNum-1) 
    renderBooks()
}

function onNextPage() {
    var elCurrentPage=document.querySelector('.active-page')
    var elNextPage=document.querySelector('.active-page + button')
    elCurrentPage.classList.remove('active-page')
    elNextPage.classList.add('active-page')
    nextPage(elCurrentPage.innerText)
    renderBooks()
}

function onPrevPage() {
    var elCurrentPage=document.querySelector('.active-page')
    var currPage = elCurrentPage.innerText
    var elPrevPage=document.querySelector('page-number:nth-child('+currPage-1+')')
    elCurrentPage.classList.remove('active-page')
    elPrevPage.classList.add('active-page')
   // prevPage(currPage)
    renderBooks()
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
    elModal.querySelector('.inc-rate-btn').hidden = false
    elModal.querySelector('.lower-rate-btn').hidden = false

    updateBook(elBookId.value, 'rating', rateInc)
    const newRate = getBookbyID(elBookId.value).rating
    elModal.querySelector('.book-rate').innerText = newRate
    if (newRate === 10) {
        elModal.querySelector('.inc-rate-btn').hidden = true
    }
    if (newRate === 0) {
        elModal.querySelector('.lower-rate-btn').hidden = true
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
    elModal.querySelector('input[name="price"]').focus();
    elModal.querySelector('.book-to-update').innerText=book.name

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
}

function onAddBook() {
    const elNameInput = document.querySelector('.add-book input[name="name"]')
    const elPriceInput = document.querySelector('.add-book input[name="price"]')
    addBook(elNameInput.value, elPriceInput.value)
    elNameInput.value = ''
    elPriceInput.value = ''
    renderBooks()
}

function onSort(sortBy) {

    var elSortSpans = document.querySelectorAll('thead span')
    elSortSpans.forEach(span => span.innerText='')

    var sortType = getSortType()
    var elSortTypeSpan = document.querySelector('.sort-'+sortBy +' span');
    if (sortType === 1) { //Now it's in ASC mode. Need to set DESC mode
        elSortTypeSpan.innerText=SORT_DESC
        setSortType(sortBy,-1)
    }
    else { //Now it's in DESC mode. Need to set ASC mode
        elSortTypeSpan.innerText=SORT_ASC
        setSortType(sortBy,1)
    }
    renderBooks();

}

function onShowAddBookToggle() {
    var buttonText = document.querySelector('.add-button').innerText
    if (buttonText === '+') {
        document.querySelector('.add-book').hidden = false
        document.querySelector('.add-button').innerText = '-'
    }
    else {
        document.querySelector('.add-book').hidden = true
        document.querySelector('.add-button').innerText = '+'

    }
}