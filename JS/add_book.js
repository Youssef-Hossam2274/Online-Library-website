const myImage = document.getElementById("cover-pic");
const uploadInput = document.getElementById("upload-img");
const myForm = document.getElementById("book_details");
const categoryList = document.getElementById("category-list");

function reset() {
  myImage.src = "../img/book-cover-placeholder.png";
}

// Changing the Book Cover
uploadInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      myImage.src = e.target.result;
      window.alert(myImage.src);
    };
    reader.readAsDataURL(file);
  }
});

myForm.addEventListener("reset", reset);

function addCategory(newCategory) {
  return new Promise((resolve, reject) => {
    let newcategoryRequest = new XMLHttpRequest();
    newcategoryRequest.open("POST", "http://127.0.0.1:8000/api.categories/");
    newcategoryRequest.responseType = "json";
    newcategoryRequest.setRequestHeader("Content-type", "application/json");
    let categoryRequestBody = `{
          "name": "${newCategory}"
      }`;
    newcategoryRequest.send(categoryRequestBody);
    newcategoryRequest.onload = function () {
      if (newcategoryRequest.status == 201) {
        resolve(newcategoryRequest.response);
      } else {
        reject(
          "Error:",
          newcategoryRequest.status,
          newcategoryRequest.statusText
        );
      }
    };
    newcategoryRequest.onerror = function () {
      reject("Network Error");
    };
  });
}
// Getting the categories
var xhr = new XMLHttpRequest();

xhr.open("GET", "http://127.0.0.1:8000/api.categories/", true);

xhr.send();

xhr.onload = function () {
  const categoryDropdown = document.getElementById("category-list");
  const categories = JSON.parse(xhr.response);

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    categoryDropdown.appendChild(option);
  });

  const addCategoryOption = document.createElement("option");
  addCategoryOption.value = "add-new";
  addCategoryOption.textContent = "Add New Category";
  categoryDropdown.insertBefore(addCategoryOption, categoryDropdown.firstChild);

  categoryDropdown.addEventListener("change", (event) => {
    if (event.target.value === "add-new") {
      const newCategory = prompt("Enter a new category:");
      if (newCategory) {
        addCategory(newCategory);
      }
    }
  });
};
myForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const Title = document.getElementById("book_title").value.trim();
  const Name = document.getElementById("author_name").value.trim();
  const Date = document.getElementById("publish_date").value;
  var selectElement = document.getElementById("category-list").value;
  const desc = document.getElementById("description").value.trim();

  if (!Title) {
    showMessage("Book Title is required", "red", false);
    return;
  }
  if (!desc) {
    showMessage("Description is required", "red", false);
    return;
  }

  if (!Name) {
    showMessage("Author Name is required", "red", false);
    return;
  }

  if (!Date) {
    showMessage("Publish Date is required", "red", false);
    return;
  }
  if (!selectElement) {
    showMessage("Category is required", "red", false);
    return;
  }

  findAuthorIdByName(document.getElementById("author_name").value)
    .then(addBook)
    .then((bookId) => addBorrowTransaction(bookId))
    .then(() => {
      showMessage("Book Added Succesfully");
      window.location.href = "all_books.html";
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

function findAuthorIdByName(authorName) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const apiUrl = "http://127.0.0.1:8000/api.authors/";

    xhr.open("GET", apiUrl, true); // Make sure the request is asynchronous

    xhr.onload = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        try {
          const authors = JSON.parse(xhr.responseText);
          const existingAuthor = authors.find(
            (author) => author.name === authorName
          );

          if (existingAuthor) {
            // Author already exists, return their ID
            resolve(existingAuthor.id);
          } else {
            const newAuthorXhr = new XMLHttpRequest();
            newAuthorXhr.open("POST", apiUrl, true);
            newAuthorXhr.setRequestHeader("Content-Type", "application/json");
            newAuthorXhr.onload = function () {
              if (
                newAuthorXhr.readyState === 4 &&
                newAuthorXhr.status === 201
              ) {
                const newAuthorData = JSON.parse(newAuthorXhr.responseText);
                resolve(newAuthorData.id);
              } else {
                reject(newAuthorXhr.statusText);
              }
            };
            newAuthorXhr.onerror = function () {
              reject(newAuthorXhr.statusText);
            };
            newAuthorXhr.send(JSON.stringify({ name: authorName }));
          }
        } catch (error) {
          reject(error);
        }
      } else {
        reject(xhr.statusText);
      }
    };

    xhr.onerror = function () {
      reject(xhr.statusText);
    };

    xhr.send();
  });
}
// Borrow Transaction adding
function addBorrowTransaction(bookID) {
  const UID = window.localStorage.getItem("user_id");
  const requestBody = {
    user: UID,
    book: bookID,
  };

  let xhr = new XMLHttpRequest();
  xhr.open("POST", "http://127.0.0.1:8000/api.BorrowTransaction/");
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      resolve(JSON.parse(xhr.responseText));
    } else {
      reject(`Error: ${xhr.status}`);
    }
  };

  // Set up the onerror event
  xhr.onerror = function () {
    reject("Network error");
  };

  xhr.send(JSON.stringify(requestBody));
}

function addBook(authorId) {
  return new Promise((resolve, reject) => {
    let bookRequest = new XMLHttpRequest();
    bookRequest.open("POST", "http://127.0.0.1:8000/api.books/");
    bookRequest.responseType = "json";
    bookRequest.setRequestHeader("Content-type", "application/json");

    let bookRequestBody = `{
      "title": "${document.getElementById("book_title").value}",
      "author": ${authorId},
      "cover": null,
      "rating": ${Math.floor(Math.random() * 5) + 1},
      "category": ${categoryList.value},
      "publish_date": "${document.getElementById("publish_date").value}",
      "available": true,
      "description": "${document.getElementById("description").value}",
      "publisher": ${window.localStorage.getItem("user_id")}
    }`;

    bookRequest.onload = function () {
      if (bookRequest.status >= 200 && bookRequest.status < 300) {
        const bookData = bookRequest.response;
        resolve(bookData.id);
      } else {
        reject(`Error: ${bookRequest.status}`);
      }
    };

    bookRequest.onerror = function () {
      reject("Network Error");
    };

    bookRequest.send(bookRequestBody);
  });
}

// --------------------------------

// document.addEventListener("DOMContentLoaded", function () {
//   const myForm = document.getElementById("book_details");

//   myForm.addEventListener("submit", function (event) {
//     event.preventDefault();

//     const bookTitle = document.getElementById("book_title").value.trim();
//     const authorName = document.getElementById("author_name").value.trim();
//     const publishDate = document.getElementById("publish_date").value;

//     if (!bookTitle) {
//       showMessage("Book Title is required", "red", false);
//       return;
//     }

//     if (!authorName) {
//       showMessage("Author Name is required", "red", false);
//       return;
//     }

//     if (!publishDate) {
//       showMessage("Publish Date is required", "red", false);
//       return;
//     }
//     myForm.preventDefault;
//     myForm.submit();
//     window.location.href = "all_books.html";
//   });
// });

// myForm.addEventListener("submit", function (event) {
//   event.preventDefault(); // Prevent the form from submitting which refreshes the page

//   // Get the form data
//   let title = document.getElementById("book_title").value;
//   let author = document.getElementById("author_name").value;
//   let description = document.getElementById("description").value;
//   let publish_date = document.getElementById("publish_date").value;
//   let category = document.getElementById("category-list").value;

//   // Validate the form data
//   if (!title || !author || !description || !publish_date || !category) {
//     alert("Please fill out all fields.");
//     return;
//   }
