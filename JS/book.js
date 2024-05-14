const bookImage = document.querySelector("#book-image");
const zoomBox = document.querySelector(".zoom-box");
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
let user;
let zoomImage = false;
let book = null;

// --------------- Data Fetchers ------------------
// Fetches the user data from local storage
function fetchUser() {
  let userID = (user = window.sessionStorage.getItem("user_id"));
  if (userID) {
    userID = JSON.parse(userID);

    // fetching the user object
    let xhr = new XMLHttpRequest();
    xhr.open("GET", `http://127.0.0.1:8000/api.users/${id}/`);
    xhr.onload = function () {
      if (this.status === 200) {
        user = JSON.parse(this.responseText);
      }
    };

    xhr.send();
  } else {
    user = null;
  }
}

// Fetches the book id from the page url
function fetchId() {
  let params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// Fetching the book data using its id
function fetchData(id) {
  let request = new XMLHttpRequest();
  request.open("GET", `http://127.0.0.1:8000/api.books/${id}/`);
  request.send();

  request.onload = function () {
    if (this.status === 200) {
      book = JSON.parse(this.responseText);
      if (book.cover) {
        bookImage.src = book.cover;
        zoomBox.style.backgroundImage = `url(${book.cover})`;
        zoomImage = true;
      }
      bookTitle.innerHTML = book.title;
      categoryField.innerHTML = book.category.name;
      dateField.innerHTML = book.publish_date;
      descriptionBox.innerHTML = book.description;
      // Availability
      if (book.available) {
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
      addRating(book.rating);

      // author request
      let xhr = new XMLHttpRequest();
      xhr.open("GET", `http://127.0.0.1:8000/api.authors/${book.author}/`);
      xhr.onload = function () {
        if (this.status === 200) {
          bookAuthor.innerHTML = JSON.parse(this.responseText).name;
        }
      };
      xhr.send();
    } 
    else {
      showMessage("This book is undefined", "#f44336", false);
    }
  };
}

// ------------------ Other -------------------
// removes the current book
function removeCurrentBook() {
  // ----- Removing from all books
  let request = new XMLHttpRequest();
  request.open("DELETE", `http://127.0.0.1:8000/api.books/${id}`);
  request.send();
  request.onload = function () {
    if (this.status === 204) {
      // Showing the message
      showMessage(
        `${bookTitle.innerHTML} has been deleted successfully`,
        "#42BD6C",
        true
      );
    }
  };
}

// TODO: check current stat of borrowing or adding to favorites or availability
function checkState() {
  
}

// Adding admin buttons
function addAdminButtons() {
  if (user && book.publisher == user.id) {
    // Adding remove and edit buttons
    let parser = new DOMParser();
    document
      .querySelector(".image-side").appendChild(parser.parseFromString(
            `<div class="admin-btns">
                <button id="edit-btn">
                  <span class="material-symbols-rounded">edit</span>Edit
                </button>
                <button id="remove-btn">
                  <span class="material-symbols-rounded">delete</span>Remove
                </button>
              </div>`,
            "text/html"
          ).querySelector(".admin-btns")
      );

    // Adding functionality
    document.getElementById("edit-btn").addEventListener("click", () => {
      window.location.href = `edit_book.html?id=${book.id}`;
    });
    document.getElementById("remove-btn").addEventListener("click", removeCurrentBook);
  }
}

// Rating
function addRating(n = 0) {
  let stars = document.querySelectorAll(".stars > span");

  for (let i = 0; i < n; ++i) {
    stars[i].classList.add("checked");
  }
}

// -------------------- Main ---------------------
let bookId = fetchId();

if (bookId) {

  fetchData(bookId);
  addAdminButtons();
  checkState();
}

// ------------------ event handlers --------------
// Borrow button handling
borrowBtn.addEventListener("click", () => {
  // regular visitor
  if (!user) {
    showMessage(
      "You need to be logged in to borrow this book",
      "#f44336",
      false
    );
  }
  // admin
  else if (user.isAdmin) {
    showMessage("Admins cannot borrow books", "#f44336", false);
  }
  // user
  else {
    let xhr = XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:8000/api.BorrowTransaction/");
    xhr.responseType = "json";
    xhr.setRequestHeader("Content-type", "application/json");
    let requestBody = `{
        "user": ${user.id},
        "book": ${book.id},
        "borrow_date": ${new Date().toJSON()}
      }`;

    xhr.onload = function () {
      // update book status
      if (this.status < 300 && this.status >= 200) {
        let xhr2 = XMLHttpRequest();
        xhr2.open("POST", `http://127.0.0.1:8000/api.books/${book.id}`);
        xhr2.responseType = "json";
        xhr2.setRequestHeader("Content-type", "application/json");
        // make unavailable
        book.available = false;

        xhr.onload = function () {
          showMessage(
            "The book has been added to your borrows successfully",
            "#42BD6C",
            true
          );
        };
        xhr2.send(JSON.stringify(book));
      } else {
        showMessage("This book has been already borrowed", "#d38902", false);
      }
    };
    xhr.send(requestBody);
  }
});

// Add to favorites
favBtn.addEventListener("click", () => {
  // regular visitor
  if (!user) {
    showMessage(
      "You need to be logged in to add to favorites",
      "#f44336",
      false
    );
  } else {
    let xhr = XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:8000/api.favorites/");
    xhr.responseType = "json";
    xhr.setRequestHeader("Content-type", "application/json");
    let requestBody = `{
        "user": ${user.id},
        "book": ${book.id},
     }`;

    xhr.onload = function () {
      if (this.status < 300 && this.status >= 200) {
        showMessage(
          "The book has been added to your favorites successfully",
          "#42BD6C",
          true
        );
      } else {
        showMessage(
          "This book is already added to your favorites",
          "#d38902",
          false
        );
      }
    };

    xhr.send(requestBody);
  }
});

// Adding the zooming event to book image in-case of wide screen
if (screen.width > 768 && zoomImage) {
  bookImage.addEventListener("mousemove", (e) => {
    // Showing the container
    zoomBox.style.display = "block";

    // Extracting the current width and height
    let width = parseFloat(window.getComputedStyle(bookImage).width);
    let height = parseFloat(window.getComputedStyle(bookImage).height);

    // Extracting the current mouse position portion
    let x = e.offsetX / width;
    let y = e.offsetY / height;

    // Moving to the current part
    zoomBox.style.backgroundPosition = `${x * 100}% ${y * 100}%`;
  });

  bookImage.addEventListener("mouseleave", (e) => {
    zoomBox.style.display = "none";
  });
}
