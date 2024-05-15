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
function postRequest(method, url, body) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.responseType = "json";

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr < 300) {
        resolve(this.responseText);
      } else {
        reject("request failed with status code: " + this.status);
      }
    };

    xhr.send(JSON.stringify(body));
  });
}

function getRequest(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.onload = function () {
      if (this.status === 200) resolve(this.responseText);
      else {
        reject(`error with status code: ${this.status}`);
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
  getRequest("http://127.0.0.1:8000/api.favorites/").then((favorites) => {
    const json = JSON.parse(favorites);
    for (let i = 0; i < json.length; ++i) {
      if (json[i].user == user.id && json[i].book == book.id) {
        favBtn.dataset.state = `${json[i].id}`;

        favBtn.innerHTML =
          '<span class="material-symbols-rounded">heart_check</span>Added to favorites';
        favBtn.querySelector("span").classList.add("checked");
        return;
      }
      favBtn.innerHTML =
        '<span class="material-symbols-rounded">heart_plus</span>Add to favorites';
      favBtn.querySelector("span").classList.remove("checked");
    }
  });
}

// checks if the current book is borrowed
function checkBorrowed() {
  getRequest("http://127.0.0.1:8000/api.BorrowTransaction/").then((borrows) => {
    const json = JSON.parse(borrows);
    for (let i = 0; i < json.length; ++i) {
      if (json[i].user == user.id && json[i].book == book.id) {
        borrowBtn.dataset.state = `${json[i].id}`;

        borrowBtn.innerHTML =
          '<span class="material-symbols-rounded">bookmark_added</span>Borrowed';
        borrowBtn.querySelector("span").classList.add("checked");
        return;
      }
    }

    borrowBtn.innerHTML =
      '<span class="material-symbols-rounded">bookmark_add</span>Borrow';
    borrowBtn.querySelector("span").classList.remove("checked");
  });
}

// make it toggle its state from borrowed to not borrowed
function toggleBorrowedButton() {
  if (+borrowBtn.dataset.state > 0) {
    const xhr = new XMLHttpRequest();
    xhr.open(
      "DELETE",
      `http://127.0.0.1:8000/api.BorrowTransaction/${borrowBtn.dataset.state}/`
    );
    xhr.onload = function () {
      if (this.status == 204) {
        borrowBtn.dataset.state = "0";
        borrowBtn.innerHTML =
          '<span class="material-symbols-rounded">bookmark_add</span>Borrow';
        borrowBtn.querySelector("span").classList.remove("checked");
      }
    };
    xhr.send();
  } else {
    postRequest(
      "POST",
      `http://127.0.0.1:8000/api.BorrowTransaction/`,
      `
    "user": "${user.id}",
    "book": "${book.id}"
    `
    ).then(() => {
      checkBorrowed();
      borrowBtn.innerHTML =
        '<span class="material-symbols-rounded">bookmark_added</span>Borrowed';
      borrowBtn.querySelector("span").classList.add("checked");
    });
  }
}

// Make it toggle its state from favorite to not favorite
function toggleFavoritesButton() {
  if (+favBtn.dataset.state > 0) {
    const xhr = new XMLHttpRequest();
    xhr.open(
      "DELETE",
      `http://127.0.0.1:8000/api.favorites/${favBtn.dataset.state}/`
    );
    xhr.onload = function () {
      if (this.status == 204) {
        favBtn.dataset.state = "0";
        favBtn.innerHTML =
          '<span class="material-symbols-rounded">heart_plus</span>Add to favorites';
        favBtn.querySelector("span").classList.remove("checked");
      }
    };
    xhr.send();
  } else {
    postRequest(
      "POST",
      `http://127.0.0.1:8000/api.favorites/`,
      `
    "user": "${user.id}",
    "book": "${book.id}"
    `
    ).then(() => {
      checkFavorites();
      favBtn.innerHTML =
        '<span class="material-symbols-rounded">heart_check</span>Added to favorites';
      favBtn.querySelector("span").classList.add("checked");
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
  return new Promise(async (resolve, reject) => {
    await getRequest(`http://127.0.0.1:8000/api.books/${id}/`).then(
      (json) => (book = JSON.parse(json))
    );

    if (book) {
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
      getRequest(`http://127.0.0.1:8000/api.authors/${book.author}/`)
        .then((author) => {
          bookAuthor.innerHTML = JSON.parse(author).name;
        })
        .catch(() => {
          bookAuthor.innerHTML = "Unknown";
        });

      // Category
      getRequest(`http://127.0.0.1:8000/api.categories/${book.category}/`)
        .then((category) => {
          categoryField.innerHTML = JSON.parse(category).name;
        })
        .catch(() => {
          categoryField.innerHTML = "N.A";
        });

      resolve();
    } else {
      reject();
    }
  });
}

// ------------------ Other -------------------
// removes the current book
function removeCurrentBook() {
  // ----- Removing from all books
  const xhr = XMLHttpRequest();
  xhr.open("DELETE", `http://127.0.0.1:8000/api.books/${book.id}/`);

  xhr.onload = function () {
    if (this.status == 204) {
      showMessage(
        `${bookTitle.innerHTML} has been deleted successfully`,
        "#42BD6C",
        true
      );
    } else {
      showMessage(
        `${bookTitle.innerHTML} is not found in the library books`,
        "#f44336",
        true
      );
    }
  };
}

// Adding admin buttons
function addAdminButtons() {
  if (user && book.publisher == user.id) {
    // Adding remove and edit buttons
    let parser = new DOMParser();
    document.querySelector(".image-side").appendChild(
      parser
        .parseFromString(
          `<div class="admin-btns">
                <button id="edit-btn">
                  <span class="material-symbols-rounded">edit</span>Edit
                </button>
                <button id="remove-btn">
                  <span class="material-symbols-rounded">delete</span>Remove
                </button>
              </div>`,
          "text/html"
        )
        .querySelector(".admin-btns")
    );

    // Adding functionality
    document.getElementById("edit-btn").addEventListener("click", () => {
      window.location.href = `edit_book.html?id=${book.id}`;
    });
    document
      .getElementById("remove-btn")
      .addEventListener("click", removeCurrentBook);
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
async function main() {
  let bookId = fetchId();

  if (bookId) {
    await getRequest(`http://127.0.0.1:8000/api.users/${localStorage.user_id}/`)
      .then((json) => (user = JSON.parse(json)))
      .catch(() => {
        user = null;
      });

    updatePageInfo(bookId)
      .then(() => {
        addAdminButtons();
        // ------------------ event handlers --------------
        // Borrow button handling
        borrowBtn.addEventListener("click", async () => {
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
            // TODO: Show a message
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
            toggleFavoritesButton();
            // TODO: Show a message
          }
        });
      })
      .catch(() => {
        showMessage("This book id is undefined", "#f44336", false);
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
