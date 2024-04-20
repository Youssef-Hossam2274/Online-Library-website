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


function showAllBooks() {
    let books = JSON.parse(window.localStorage.getItem("books"));
    for (let i = 0; i < books.length; i += 1) {
        let currentBook = books[i];
        // if(category != currentBook.category)
        //     continue;

        let book =
            `;
        <div class="Book ${currentBook.category}">
            <div class="background-img">
                <a href="../HTML/book.html" target="_blank">
                    <img src="../img/blank.png" />
                </a>
            </div>
            <div class="content">
                <h3>${currentBook.title}</h3> 
                <span><strong>Author(s):</strong>${currentBook.author}</span>
                <button>Show details</button>
            </div>
        </div>
        `;

        const parser = new DOMParser();
        const parsedDocument = parser.parseFromString(book, "text/html");

        let MyMain = document.querySelector(".main-books");
        MyMain.append(parsedDocument.querySelector(".book"));
    }
}

showAllBooks();


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