'use strict'

var gCurrLang = 'en'


var gTrans = {
    pageTitle: {
        en: 'Book Store',
        he: 'חנות ספרים'
    },
    title: {
        en: 'My Books',
        he: 'הספרים שלי'
    },
    bookName: {
        en: 'Name',
        he: 'שם'
    },
    bookID: {
        en: 'ID',
        he: 'מזהה'
    },
    bookPrice: {
        en: 'Price($)',
        he: 'מחיר (₪)'
    },
    bookRate: {
        en: 'Rating',
        he: 'דירוג'
    },
    bookActions: {
        en: 'Actions',
        he: 'פעולות'
    },
    readBook: {
        en: 'Read',
        he: 'קרא'
    },
    updateBook: {
        en: 'Update',
        he: 'עדכן'
    },
    deleteBook: {
        en: 'Delete',
        he: 'מחק'
    },
    addBook: {
        en: 'Add New Book',
        he: 'הוסף ספר חדש'
    },
    newBookPrice: {
        en: 'Price ',
        he: 'מחיר '
    },
    newBookName: {
        en: 'Name ',
        he: 'שם '
    },
    approveInput: {
        en: 'Confirm',
        he: 'אישור'
    },
    numOfPages: {
        en: 'Books per page',
        he: 'מספר ספרים לעמוד'
    },
    prevButton: {
        en: 'Previous',
        he: 'הקודם'
    },
    nextButton: {
        en: 'Next',
        he: 'הבא'
    },
    updatePrice: {
        en: 'Update price',
        he: 'עדכן מחיר'
    },
    deleteConfirm: {
        en: 'Are you sure?',
        he: 'האם אתה בטוח?'
    },
    cancel: {
        en: 'Cancel',
        he: 'ביטול'
    },
    changeLangDropdown: {
        en: 'Change Language',
        he: 'שינוי שפה'
    },
    newBookModalTitle: {
        en: 'Hooray! New Book!',
        he: 'הידד! ספר חדש!'
    }


    
}

function getTrans(transKey) {
    // Get from gTrans
    var langTransMap = gTrans[transKey]
    // If key is unknown return 'UNKNOWN'
    if (!langTransMap) return 'UNKNOWN';

    // If translation not found - use english
    var trans = langTransMap[gCurrLang]
    if (!trans) trans = langTransMap['en']
    return trans;
}


function doTrans() {
    var els = document.querySelectorAll('[data-trans]')
    els.forEach(el => {
        const key = el.dataset.trans;
        const trans = getTrans(key)
        if (el.placeholder) el.placeholder = trans
        else el.innerText = trans
    })
}

function setLang(lang) {
    gCurrLang = lang;
}
