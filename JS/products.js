function searchBooks() {
    var input, filter, books, i, title, author, txtValue, authorValue;

    input = document.getElementById('searchInput');
    filter = input.value.toUpperCase();
    books = document.querySelectorAll(".Book");

    for (i = 0; i < books.length; i++) {

        title = books[i].querySelector("h3");
        author = books[i].querySelector("span");

        txtValue = title.innerText.toUpperCase();
        authorValue = author.innerText.toUpperCase();

        if (txtValue.indexOf(filter) > -1 || authorValue.indexOf(filter) > -1) {
            books[i].style.display = "";
        } else {
            books[i].style.display = "none";
        }
    }
}


function filterByCategory() {

    // var select, sections, i, category;

    // select = document.getElementById('categorySelect');
    // category = select.value.toLowerCase();
    // sections = document.querySelectorAll("section");

    // for (i = 0; i < sections.length; i++) {
    //     if (sections[i].className.toLowerCase() !== category && category !== 'all') {
    //         sections[i].style.display = "none";
    //     } else {
    //         sections[i].style.display = "";
    //     }
    // }
}

class Book {
    constructor(
        imageURL,
        title,
        author,
        category,
        publishDate,
        availability,
        description
    ) {
        this.imageURL = imageURL;
        this.title = title;
        this.author = author;
        this.category = category;
        this.publishDate = publishDate;
        this.availability = availability;
        this.description = description;
    }
}

function set_categorty_select_list() {

    let books = JSON.parse(window.localStorage.getItem("books"));
    let select_list = document.getElementById("categorySelect");

    if (books) {
        for (let i = 0; i < books.length; ++i) {
            let option = document.createElement("option");
            option.value = books.category;
            option.text = books[i].category;
            select_list.add(option);
        }
    }
}


function AddAllBooks() {
    let books = JSON.parse(window.localStorage.getItem("books"));

    if (books) {
        for (let i = 0; i < books.length; i += 1) {
            let currentBook = books[i];
            let book =
                `;
        <div class="Book">
            <div class="background-img">
                <a href="../HTML/book.html?id=${i}">
                    <img src="${books[i].imageURL}" />
                </a>
            </div>
            <div class="content">
                <h3>${currentBook.title}</h3> 
                <span><strong>Author(s):</strong>${currentBook.author}</span>
                <button id= "ShowDetails">Show details</button>
            </div>
        </div>
        `;

            const parser = new DOMParser();
            const parsedDocument = parser.parseFromString(book, "text/html");

            let MyMain = document.querySelector(".main-books");
            MyMain.append(parsedDocument.querySelector(".book"));
        }
    }
}


AddAllBooks();


function fetchID() {
    let books = document.querySelectorAll(".Book");
    let buttons = document.querySelectorAll(".Book button");
    for (let i = 0; i < books.length; ++i) {
        buttons[i].onclick = function () {
            window.localStorage.setItem("single-book-id", i);
        }
    }
}

fetchID();


// Link addBook button with addBook page
document.getElementById('addBook').addEventListener('click', function () {
    window.location.href = "../HTML/add_book.html";
});

document.getElementById('ShowDetails').addEventListener('click', function () {
    window.location.href = "../HTML/book.html?id=1";
});


// Show addBook button for Admin only
if (window.sessionStorage.getItem("isAdmin")) {
    document.getElementById('addBook').style.display = "";
}
else {
    document.getElementById('addBook').style.display = 'none';
}