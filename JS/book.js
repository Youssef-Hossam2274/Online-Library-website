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
let user = null;
let zoomImage = false;
let book = null;

// ----------------- Utilities -------------------
// ---------------- Request functions -----------
function loadedRequest(method, url, body) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.responseType = "json";

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr < 300) {
        resolve(this.responseText);
      } else {
        reject(Error(`Request failed with status code: ${this.status}`));
      }
    };

    xhr.send(JSON.stringify(body));
  });
}

// Made for empty requests such as delete and get
function emptyRequest(method, url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);

    xhr.onload = function () {
      if (this.status === 200) resolve(this.responseText);
      else {
        reject(Error(`Request failed with status code: ${this.status}`));
      }
    };
    xhr.send();
  });
}

function updateAvailability() {
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
}

// check if the current book is in favorites
function checkFavorites() {
  emptyRequest("GET", "http://127.0.0.1:8000/api.favorites/").then((favorites) => {
    const json = JSON.parse(favorites);
    for (let i = 0; i < json.length; ++i) {
      if (json[i].user == user.id && json[i].book == book.id) {
        favBtn.dataset.state = json[i].id;
        favBtn.innerHTML =
          '<span class="material-symbols-rounded">heart_check</span>Added to favorites';
        favBtn.querySelector("span").classList.add("checked");
        return;
      }
      favBtn.dataset.state = 0;
      favBtn.innerHTML =
        '<span class="material-symbols-rounded">heart_plus</span>Add to favorites';
      favBtn.querySelector("span").classList.remove("checked");
    }
  });
}

// checks if the current book is borrowed
function checkBorrowed() {
  emptyRequest("GET", "http://127.0.0.1:8000/api.BorrowTransaction/").then((borrows) => {
    const json = JSON.parse(borrows);
    for (let i = 0; i < json.length; ++i) {
      if (json[i].user == user.id && json[i].book == book.id) {
        borrowBtn.dataset.state = json[i].id;

        borrowBtn.innerHTML =
          '<span class="material-symbols-rounded">bookmark_added</span>Borrowed';
        borrowBtn.querySelector("span").classList.add("checked");
        return;
      }
    }
    borrowBtn.dataset.state = 0;
    borrowBtn.innerHTML =
      '<span class="material-symbols-rounded">bookmark_add</span>Borrow';
    borrowBtn.querySelector("span").classList.remove("checked");
  });
}

// make it toggle its state from borrowed to not borrowed
function toggleBorrowedButton() {
  if (+borrowBtn.dataset.state > 0) {
    emptyRequest("DELETE", `http://127.0.0.1:8000/api.BorrowTransaction/${borrowBtn.dataset.state}/`)
      .then(() => {
        borrowBtn.dataset.state = 0;
        borrowBtn.innerHTML =
          '<span class="material-symbols-rounded">bookmark_add</span>Borrow';
        borrowBtn.querySelector("span").classList.remove("checked");
      });
  }
  else {
    loadedRequest("POST", `http://127.0.0.1:8000/api.BorrowTransaction/`, {
      "user": user.id,
      "book": book.id,
    }).then(() => {
      checkBorrowed();
      showMessage("Borrowed successfully", "#42BD6C", true);
    });
  }
}

// Make it toggle its state from favorite to not favorite
function toggleFavoritesButton() {
  if (+favBtn.dataset.state > 0) {
    emptyRequest("DELETE", `http://127.0.0.1:8000/api.favorites/${borrowBtn.dataset.state}/`)
      .then(() => {
        favBtn.dataset.state = 0;
        favBtn.innerHTML =
          '<span class="material-symbols-rounded">heart_plus</span>Borrow';
        favBtn.querySelector("span").classList.remove("checked");
      });
  }
  else {
    loadedRequest("POST", `http://127.0.0.1:8000/api.favorites/`, {
      "user": user.id,
      "book": book.id,
    }).then(() => {
      checkFavorites();
      showMessage("Added to favorites", "#42BD6C", true);
    });
  }
}

function today() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed, so add 1
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Fetches the book id from the page url
function fetchId() {
  let params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// Fetching the book data using its id
function updatePageInfo(id) {
  return new Promise((resolve, reject) => {
    emptyRequest("GET", `http://127.0.0.1:8000/api.books/${id}/`).then((json) => {
      book = JSON.parse(json);

      if (book.cover) {
        // FIXME: solve the image problem
        // bookImage.src = book.cover;
        // zoomBox.style.backgroundImage = `url(${book.cover})`;
        zoomImage = true;
      }
      bookTitle.innerHTML = book.title;
      dateField.innerHTML = book.publish_date;
      descriptionBox.innerHTML = book.description;
      addRating(book.rating);
      updateAvailability();

      if (user) {
        // Borrowed
        checkBorrowed();

        // favorites
        checkFavorites();
      }

      // Author
      emptyRequest("GET", `http://127.0.0.1:8000/api.authors/${book.author}/`)
        .then((author) => {
          bookAuthor.innerHTML = JSON.parse(author).name;
        })
        .catch(() => {
          bookAuthor.innerHTML = "Unknown";
        });

      // Category
      emptyRequest("GET", `http://127.0.0.1:8000/api.categories/${book.category}/`)
        .then((category) => {
          categoryField.innerHTML = JSON.parse(category).name;
        })
        .catch(() => {
          categoryField.innerHTML = "N.A";
        });

      resolve(book);
    }).catch(() => reject(book));
  });
}
// ------------------ Other -------------------
// removes the current book
function removeCurrentBook() {
  // ----- Removing from all books
  emptyRequest("DELETE", `http://127.0.0.1:8000/api.books/${book.id}/`)
    .then(() => showMessage(`${bookTitle.innerHTML} has been deleted successfully`, "#42BD6C", true))
    .catch(() => showMessage(`${bookTitle.innerHTML} is not found in the library books`, "#f44336", true));
}

// Adding admin buttons
function addAdminButtons() {
  if (user && book.publisher == user.id) {
    // Adding remove and edit buttons
    let parser = new DOMParser();
    document.querySelector(".image-side").appendChild(
      parser.parseFromString(
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
function main() {
  let bookId = fetchId();

  if (bookId) {
    emptyRequest("GET", `http://127.0.0.1:8000/api.users/${localStorage.user_id}/`)
      .then((json) => {
        user = JSON.parse(json);
        updatePageInfo(bookId)
          .then(() => {
            addAdminButtons();
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
                toggleBorrowedButton();
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
              }
              else {
                toggleFavoritesButton();
              }
            });
          })
          .catch(() => {
            showMessage("This book id is undefined", "#f44336", false);
          })
      });
  }
}

main();

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
