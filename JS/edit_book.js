const editForm = document.getElementById("book_details");
const myImage = document.getElementById("cover-pic");
const uploadInput = document.getElementById("upload-img");
var curBookCover;
let was_reset = false;
// Function to get the book ID from the URL parameters
function fetchId() {
  let params = new URLSearchParams(window.location.search);
  return params.get("id");
}
function get_name() {
  let imagename = uploadInput.value;
  let img = curBookCover;
  for (let i = 0; i < imagename.length; ++i) {
    if (imagename[i] == "\\") img = imagename.substring(i + 1);
  }
  return img;
}

//populate the form with the book data
function populateForm(book) {
  document.getElementById("book_title").value = book.title;
  fetchAuthorName(book.author)
    .then((authorName) => {
      document.getElementById("author_name").value = authorName;
    })
    .catch((error) => {
      console.error("Error fetching author name:", error);
    });
  document.getElementById("publish_date").value = book.publish_date;
  document.getElementById("category-list").value = book.category.id;
  document.getElementById("description").value = book.description;

  if (book.cover == "cover_default.png")
    myImage.src = `../backend/covers/book-cover-placeholder.png`;
  else myImage.src = `../backend/covers/${book.cover}`;
  curBookCover = book.cover;
  fetchCategories(book.category);
}
async function fetchAuthorName(authorId) {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api.authors/${authorId}`
    );
    const data = await response.json();
    return data.name; 
  } catch (error) {
    throw new Error("Failed to fetch author name");
  }
}
function fetchCategories(selectedCategoryId) {
  const categoryDropdown = document.getElementById("category-list");
  categoryDropdown.innerHTML = ""; // Clear existing options

  fetch("http://127.0.0.1:8000/api.categories/")
    .then((response) => response.json())
    .then((categories) => {
      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        if (category.id === selectedCategoryId) {
          option.selected = true; // Select the book's category
        }
        categoryDropdown.appendChild(option);
      });

      const addCategoryOption = document.createElement("option");
      addCategoryOption.value = "add-new";
      addCategoryOption.textContent = "Add New Category";
      categoryDropdown.insertBefore(
        addCategoryOption,
        categoryDropdown.firstChild
      );
    });
}
window.onload = function () {
  const bookId = fetchId();
  fetch(`http://127.0.0.1:8000/api.books/${bookId}`)
    .then((response) => response.json())
    .then((data) => populateForm(data));
};
function findAuthorIdByName(authorName) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const apiUrl = "http://127.0.0.1:8000/api.authors/";

    xhr.open("GET", apiUrl, true); 

    xhr.onload = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        try {
          const authors = JSON.parse(xhr.responseText);
          const existingAuthor = authors.find(
            (author) => author.name === authorName
          );

          if (existingAuthor) {

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
editForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const bookId = fetchId();
  const title = document.getElementById("book_title").value.trim();
  const authorName = document.getElementById("author_name").value.trim();
  const publishDate = document.getElementById("publish_date").value;
  const categoryId = document.getElementById("category-list").value;
  const description = document.getElementById("description").value.trim();
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

  findAuthorIdByName(authorName)
    .then((authorId) => {
      return updateBook(
        bookId,
        title,
        authorId,
        publishDate,
        categoryId,
        description
      );
    })
    .then(() => {
      showMessage("Book Updated Successfully");
      window.location.href = "all_books.html";
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

// update the book
function updateBook(
  bookId,
  title,
  authorId,
  publishDate,
  categoryId,
  description
) {
  return new Promise((resolve, reject) => {
    let bookRequest = new XMLHttpRequest();
    bookRequest.open("PUT", `http://127.0.0.1:8000/api.books/${bookId}/`);
    bookRequest.responseType = "json";
    bookRequest.setRequestHeader("Content-type", "application/json");
    let newImg = get_name();
    // const testImg = document.getElementById("cover-pic");
    // console.log(uploadInput.value.length);
    // console.log(testImg.src);
    if (!newImg) newImg = curBookCover;
    if (uploadInput.value.length == 0 && was_reset)
      newImg = "cover_default.png";
    let bookRequestBody = `{
      "title": "${title}",
      "author": ${authorId},
      "category": ${categoryId},
      "publish_date": "${publishDate}",
      "available": true,
      "description": "${description}",
      "cover" : "${newImg}"
    }`;

    bookRequest.onload = function () {
      if (bookRequest.status >= 200 && bookRequest.status < 300) {
        resolve(bookRequest.response);
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

uploadInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      myImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

function reset() {
  myImage.src = "../img/book-cover-placeholder.png";
  uploadInput.value = "";
  was_reset = true;
}

editForm.addEventListener("reset", reset);
