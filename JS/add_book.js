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

const myImage = document.getElementById("cover-pic");
const uploadInput = document.getElementById("upload-img");
const myForm = document.getElementById("book_details");
const categoryList = document.getElementById("category-list");

function addBookToCategory(bookIndex, categoryName) {
  // getting categories json
  const categoryJSON = window.localStorage.getItem("categories");
  const categoryArr = JSON.parse(categoryJSON);

  // finding the category with name
  for (let category of categoryArr) {
    if (category.name == categoryName) {
      category.books.push(bookIndex);
    }
  }
}

function addBook() {
  // Creating the book object
  const newBook = new Book(
    myImage.src,

    document.getElementById("book_title").value,
    document.getElementById("author_name").value,
    categoryList.value,
    document.getElementById("publish_date").value,
    true,
    document.getElementById("description").value
  );

  let booksJSON = window.localStorage.getItem("books");
  let updatedJSON, booksArr;

  if (booksJSON) {
    booksArr = JSON.parse(booksJSON);
    booksArr.push(newBook);
    updatedJSON = JSON.stringify(booksArr);
  } else {
    updatedJSON = JSON.stringify([newBook]);
  }
  window.localStorage.setItem("books", updatedJSON);

  if (!categoryList.disabled) {
    addBookToCategory(booksArr.length - 1, categoryList.value);
  }
}

function fetchCategories() {
  let categories;

  // getting local storage
  categories = JSON.parse(window.localStorage.getItem("categories"));

  // Getting category names
  if (categories) {
    let categoryNames = categories.map((category) => category.name);

    for (let name of categoryNames) {
      let option = new Option(name, name);
      categoryList.appendChild(option);
    }
  } else {
    categoryList.disabled = true;
  }
}

function reset() {
  myImage.src = "../img/book-cover-placeholder.png";
  fetchCategories();
}

// Events
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
myForm.addEventListener("submit", addBook);
myForm.addEventListener("reset", reset);

// Calling functions
fetchCategories();

//------------------ Adding category for testing
// class Category {
//     constructor(name) {
//         this.name = name;
//         books = [];
//     }
// }

// categories = [
//     new Category("")
// ]
// Add this script to your "add_book.js" file or include it in a <script> tag in your HTML

//----------------- Form Validation

document.addEventListener("DOMContentLoaded", function () {
  const myForm = document.getElementById("book_details");

  myForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const bookTitle = document.getElementById("book_title").value.trim();
    const authorName = document.getElementById("author_name").value.trim();
    const publishDate = document.getElementById("publish_date").value;

    if (!bookTitle) {
      alert("Please enter a book title.");
      return;
    }

    if (!authorName) {
      alert("Please enter an author name.");
      return;
    }

    if (!publishDate) {
      alert("Please select a publish date.");
      return;
    }
    myForm.preventDefault;
    myForm.submit();
    window.location.href = "all_books.html";
  });
});
