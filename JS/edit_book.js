const editForm = document.getElementById("book_details");

// Function to get the book ID from the URL parameters
function fetchId() {
  let params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// Function to populate the form with the book data
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
  fetchCategories(book.category);
}
async function fetchAuthorName(authorId) {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api.authors/${authorId}`
    );
    const data = await response.json();
    return data.name; // Assuming the author name is returned in the response
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
// Fetch the book data when the page loads
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
editForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const bookId = fetchId();
  const title = document.getElementById("book_title").value.trim();
  const authorName = document.getElementById("author_name").value.trim();
  const publishDate = document.getElementById("publish_date").value;
  const categoryId = document.getElementById("category-list").value;
  const description = document.getElementById("description").value.trim();


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

// Function to update the book
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

    let bookRequestBody = `{
      "title": "${title}",
      "author": ${authorId},
      "cover": null,
      "rating": 5,
      "category": ${categoryId},
      "publish_date": "${publishDate}",
      "available": true,
      "description": "${description}",
      "publisher": ${window.localStorage.getItem("user_id")}
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
