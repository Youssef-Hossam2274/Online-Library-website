// Selecting all elements
let bookImage = document.querySelector("#book-image");
let zoomContainer = document.querySelector(".zoom-container");
let zoomedImage = document.querySelector("#zoomed-image");
let bookTitle = document.querySelector(".book-title > h1");
let bookAuthor = document.querySelector(".book-title > p");
let categoryField = document.querySelector("#category-field");
let dateField = document.querySelector("#date-field");
let statusBanner = document.querySelector("#status-banner");
let statusIco = document.querySelector("#status-icon");
let statusBlock = document.querySelector("#status-block");
let descriptionBox = document.querySelector(".description > p");

// --------- Adding data to local storage for testing
// class Book {
//     constructor(
//         title,
//         author,
//         category,
//         publishDate,
//         availability,
//         description
//     ) {
//         this.title = title;
//         this.author = author;
//         this.category = category;
//         this.publishDate = publishDate;
//         this.availability = availability;
//         this.description = description;
//     }
// }

// --------- Adding a book
// function addNewBook(newBook) {
//     let booksJSON = window.localStorage.getItem("books");
//     let updatedJSON;

//     if (booksJSON) {
//         let booksArr = JSON.parse(booksJSON);
//         booksArr.push(newBook);
//         updatedJSON = JSON.stringify(booksArr);
//     } else {
//         updatedJSON = JSON.stringify([newBook]);
//     }
//     window.localStorage.setItem("books", updatedJSON);
// }

// -------- Creating student
// let newBook = new Book(
//     "DummyBook3",
//     "Mommy",
//     "I love you",
//     "January 1, 2024",
//     true
// );
// newBook.description =
//     "Advanced Graph Theory focuses on some of the main notions arising in graph theory with an emphasis from the very start of the book on the possible applications of the theory and the fruitful links existing with linear algebra";

// addNewBook(newBook);


// -------- Fetching page info based on book id
function fetchData(id) {
    let books = JSON.parse(window.localStorage.getItem("books"));
    if (!books || id > books.length || id < 0)
        return;

    let currentBook = books[id];
    // Updating page details
    bookTitle.innerHTML = currentBook.title;
    bookAuthor.innerHTML = currentBook.author;
    categoryField.innerHTML = currentBook.category;
    dateField.innerHTML = currentBook.publishDate;
    descriptionBox.innerHTML = currentBook.description;

    if (currentBook.availability) {
        statusBanner.innerHTML = "available";
        statusBlock.innerHTML =
            '<span class="material-symbols-rounded" id="status-icon">mood</span>available';
        statusBanner.style.backgroundColor = "#56cb5b";
        statusBlock.style.backgroundColor = "#56cb5b";
    } else {
        statusBanner.innerHTML = "unavailable";
        statusBlock.innerHTML =
            '<span class="material-symbols-rounded" id="status-icon">sentiment_dissatisfied</span>unavailable';
        statusBanner.style.backgroundColor = "#dd4034";
        statusBlock.style.backgroundColor = "#dd4034";
    }
}

function fetchID() {
    let psearch = new URLSearchParams(window.location.search);

    return parseInt(psearch.get('id'));
}

let id = fetchID();
fetchData(id);

// Adding the zooming event to book image in-case of wide screen
if (screen.width > 768) {
    bookImage.addEventListener("mousemove", (e) => {
        // Showing the container
        zoomContainer.style.display = "block";

        // Extracting the current width and height
        let width = parseFloat(window.getComputedStyle(bookImage).width);
        let height = parseFloat(window.getComputedStyle(bookImage).height);

        // Extracting the current mouse position portion
        let x = e.offsetX / width;
        let y = e.offsetY / height;

        // Preserving x & y in the container
        if (x >= 0.95) {
            x = 0.95;
        }
        if (y >= 0.935) {
            y = 0.935;
        }

        // Zooming the current part
        zoomedImage.style.transform = `translate(-${x * 100 * 0.6}%, -${
            y * 100 * 0.8
        }%)`;
    });

    bookImage.addEventListener("mouseleave", (e) => {
        zoomContainer.style.display = "none";
    });
}
