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

xhr.open("GET", "http://127.0.0.1:8000/api.categories", true);

xhr.send();

xhr.onload = function () {
  const categoryDropdown = document.getElementById("category-list");
  const categories = JSON.parse(xhr.response); // parse the response string into an object

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
  // myForm.preventDefault(); 
  event.preventDefault();
  addBook();
});


function findAuthorIdByName(authorName) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const apiUrl = "http://127.0.0.1:8000/api.authors/";

    // Configure the request
    xhr.open("GET", apiUrl, true);

    // Set up event handlers
    xhr.onload = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        // Check if the request is done and the status is OK
        try {
          const authors = JSON.parse(xhr.responseText);
          const existingAuthor = authors.find(
            (author) => author.name === authorName
          );

          if (existingAuthor) {

            resolve(existingAuthor.id);
          } else {
            // Create a new author
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

// adding a new book

function addBook() {
  let bookRequest = new XMLHttpRequest();
  bookRequest.open("POST", "http://127.0.0.1:8000/api.books/");
  bookRequest.responseType = "json";
  bookRequest.setRequestHeader("Content-type", "application/json");

  findAuthorIdByName(document.getElementById("author_name").value)
    .then((authorId) => {
      let bookRequestBody = `{
      "title": "${document.getElementById("book_title").value}",
      "author": ${authorId},
      "cover": null,
      "rating": 5,
      "category": ${categoryList.value},
      "publish_date": "${document.getElementById("publish_date").value}",
      "available": true,
      "description": "${document.getElementById("description").value}",
      "publisher": ${window.localStorage.getItem("user_id")}
      }`;

      bookRequest.onload = function () {
        if (bookRequest.status >= 200 && bookRequest.status < 300) {
                    for (let i = 0; i < 2000; i++) {
            console.log(i);
          }
          window.location.href = "all_books.html";
        } else {
          console.error("Error:", bookRequest.status, bookRequest.statusText);
        }
      };

      bookRequest.onerror = function () {
        console.error("Network Error");
      };

      bookRequest.send(bookRequestBody);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
