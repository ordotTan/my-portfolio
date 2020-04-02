'use strict'
const KEY = 'books'

var gPageSize = 20
var gNames = ['Harry Potter', 'Star Wars', 'The Hobbit']
var gImagePaths = ['harry_potter.jpg', 'star_wars.jpg', 'hobbit.jpg']
var gBooks
var gSortBy = 'name'
var gSortType = 1 //1=Asc
var gPageIdx = 0;


function getBooksForRender() {
    var startIdx = gPageIdx * Math.min(gPageSize, gBooks.length)
    sortBooks(gBooks)
    var books = gBooks.slice(startIdx, startIdx + gPageSize)
    return books
}

function getNumOfPages() {
    return gBooks.length / gPageSize
}

function getCurrPageIndex() {
    return gPageIdx
}

function sortBooks(books) {
    books.sort(function (book1, book2) {
        switch (gSortBy) {
            case 'price':
                if (+book1.price < +book2.price) return -1 * gSortType;
                if (+book1.price > +book2.price) return 1 * gSortType;
                return 0
            case 'rating':
                if (+book1.rating < +book2.rating) return -1 * gSortType;
                if (+book1.rating > +book2.rating) return 1 * gSortType;
                return 0
            case 'name':
                if (book1.name.toLowerCase() > book2.name.toLowerCase()) return 1 * gSortType;
                if (book1.name.toLowerCase() < book2.name.toLowerCase()) return -1 * gSortType;
                return 0
        }
    })
}

function getSortType() {
    return gSortType
}

function getSortBy() {
    return gSortBy
}

function setSortType(sortBy, sortType) {
    gSortBy = sortBy
    gSortType = sortType
}

function getBookbyID(bookId) {
    return gBooks.find(book => book.id === bookId)
}

function updateBook(bookId, key, value) {
    var book = getBookbyID(bookId)
    if (key === 'price') book.price = value
    else if (key === 'rating') book.rating = value
    _saveBooks()
}

function addBook(name, price) {
    var book = _createBook(name, price)
    gBooks.unshift(book)
    _saveBooks()

}

function removeBook(bookId) {
    var bookIdx = gBooks.findIndex(book => book.id === bookId)
    gBooks.splice(bookIdx, 1)
    if (gBooks.length % gPageSize === 0 && gPageIdx > 0) gPageIdx--
    _saveBooks()

}

function createBooks() {
    var books = loadFromStorage(KEY)
    if (!books || !books.length) {
        books = []
        for (let i = 0; i < 3; i++) {
            var price = getRandomIntInclusive(1, 100)
            var name = gNames[i]
            var img = gImagePaths[i]
            const book = _createBook(name, price, img)
            books.push(book)
        }
    }
    gBooks = books;

    _saveBooks()
}


function switchPage(pageNum) {
    gPageIdx = +pageNum
}

function nextPage(currPage) {
    gPageIdx = currPage
}

function prevPage(currPage) {
    gPageIdx = currPage - 1
}


function setItemsPerPage(items) {
    gPageSize = +items
    gPageIdx = 0
}

function setLanguage(selection) {
    gCurrLang = selection
    if (selection === 'he') document.querySelector('body').classList.add('body-rtl')
    else document.querySelector('body').classList.remove('body-rtl')
}

// private functions 

function _createBook(name, price, img) {
    return {
        id: makeId(),
        name: name,
        price: price,
        imgURL: img,
        rating: 0,
        desc: makeLorem()
    }

}

function _saveBooks() {
    saveToStorage(KEY, gBooks)
}
