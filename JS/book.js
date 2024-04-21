// Selecting all elements
const bookImage = document.querySelector("#book-image");
const zoomContainer = document.querySelector(".zoom-container");
const zoomedImage = document.querySelector("#zoomed-image");
const bookTitle = document.querySelector(".book-title > h1");
const bookAuthor = document.querySelector(".book-title > p");
const categoryField = document.querySelector("#category-field");
const dateField = document.querySelector("#date-field");
const statusBanner = document.querySelector("#status-banner");
const statusIco = document.querySelector("#status-icon");
const statusBlock = document.querySelector("#status-block");
const borrowBtn = document.querySelector("#borrow-btn");
const favBtn = document.querySelector("#fav-btn");
const descriptionBox = document.querySelector(".description > p");
const userId = parseInt(window.sessionStorage.getItem("user_id")); // NaN means that current user didn't login
const isAdmin = window.sessionStorage.getItem("isAdmin");
let id = -1;

class Book {
    constructor(
        imageURL,
        title,
        author,
        category,
        publishDate,
        description,
        availability
    ) {
        this.title = title;
        this.imageURL = imageURL;
        this.author = author;
        this.category = category;
        this.availability = availability;
        this.description = description;
        this.publishDate = publishDate;
    }
}

// --------------- Functions ------------------
// Shows an animated message
function showMessage(msg, success = true) {
    let msgBox = document.querySelector(".msg-box");

    if (success) {
        msgBox.innerHTML = `<span class="material-symbols-rounded"> task_alt </span> ${msg}`;
        msgBox.style.backgroundColor = "#42bd6c";
    } else {
        msgBox.innerHTML = `<span class="material-symbols-rounded"> error </span> ${msg}`;
        msgBox.style.backgroundColor = "#dd4034";
    }

    // Show
    msgBox.classList.toggle("active");

    // Go
    setTimeout(() => {
        msgBox.classList.remove("active");
    }, 3000);
}

// removes the current book
function removeCurrentBook() {
    // ----- Removing from all books
    let books = JSON.parse(window.localStorage.getItem("books"));
    delete books[id];

    // Returning back to JSON;
    window.localStorage.setItem("books", JSON.stringify(books));

    // ----- Remove from admin books
    let admin = JSON.parse(window.localStorage.getItem("users"))[userId];
    for (let i = 0; i < admin.books.length; ++i) {
        if (admin.books[i] == id) {
            admin.books.splice(i, 1);
        }
    }

    // Showing the message
    showMessage(`${bookTitle.innerHTML} has been deleted successfully`);
}

// Checks the type of user to display and un-display stuff
function authorizeUser() {
    // if user or admin
    if (userId !== NaN) {
        // if only an admin
        if (isAdmin) {
            // Search for the book in his list of added books
            let userObj = JSON.parse(window.localStorage.getItem("users"))[
                userId
            ];
            for (let bookId of userObj.books) {
                if (bookId == id) {
                    // Adding remove and edit buttons
                    let parser = new DOMParser();
                    document
                        .querySelector(".image-side")
                        .appendChild(
                            parser
                                .parseFromString(
                                    '<div class="admin-btns"><button id="edit-btn"><span class="material-symbols-rounded">edit</span>Edit</button><button id="remove-btn"><span class="material-symbols-rounded">delete</span>Remove</button></div>',
                                    "text/html"
                                )
                                .querySelector(".admin-btns")
                        );

                    // Adding functionality
                    document
                        .getElementById("edit-btn")
                        .addEventListener("click", () => {
                            window.location.href = `edit_book.html?id=${id}`;
                        });
                    document
                        .getElementById("remove-btn")
                        .addEventListener("click", removeCurrentBook);
                }
            }
        }
    }
}

// Fetching the book data using its id
function fetchData(id) {
    let books = JSON.parse(window.localStorage.getItem("books"));
    let currentBook = books[id];
    // Updating page details
    if (currentBook.imageURL) {
        bookImage.src = currentBook.imageURL;
        zoomedImage.src = currentBook.imageURL;
    }
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

// Fetches the book id from the page url
function fetchId() {
    let psearch = new URLSearchParams(window.location.search);
    return parseInt(psearch.get("id"));
}

// Checks if the id is already valid and found in books
function checkId(id) {
    if (id == NaN) {
        return false;
    } 
    else {
        let books = JSON.parse(window.localStorage.getItem("books"));
        if (books && id < books.length && id >= 0 && books[id]) {
            return true;
        } else {
            return false;
        }
    }
}

// -------------------- Main ---------------------
id = fetchId();

if (checkId(id)) {
    // check the type of visitor
    authorizeUser();

    // fetching the data
    fetchData(id);

    // Do other stuff

    // Borrow button handling
    borrowBtn.addEventListener("click", () => {
        // regular visitor
        if (userId == NaN) {
            showMessage("You need to be logged in to borrow this book", false);
        }
        // admin
        else if (isAdmin) {
            showMessage("Admins cannot borrow books", false);
        }
        // user
        else {
            // check book availability
            let books = JSON.parse(window.localStorage.getItem("books"));
            if (!books[id].availability) {
                showMessage("This book is unavailable", false);
            } else {
                // add to his list of books
                let users = JSON.parse(window.localStorage.getItem("users"));
                users[user_id].books.push(id);
                window.localStorage.setItem("users", JSON.stringify(users));

                // make unavailable
                books[id].availability = false;
                window.localStorage.setItem("books", JSON.stringify(books));
            }
        }
    });

    // Add to favorites
    favBtn.addEventListener("click", () => {
        // regular visitor
        if (userId == NaN) {
            showMessage("You need to be logged in to borrow this book", false);
        }

        // user or admin
        else {
            // fetching all users
            let users = JSON.parse(window.localStorage.getItem("users"));
            // adding the book
            users[user_id].books.push(id);
            // pushing back the users json
            window.localStorage.setItem("users", JSON.stringify(users));

            showMessage(
                "The book has been added to your favorites successfully",
                true
            );
        }
    });

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

} 
else {
    favBtn.disabled = true;
    borrowBtn.disabled = true;
    showMessage("This book is undefined", false);
}
