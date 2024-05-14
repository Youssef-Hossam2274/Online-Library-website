AddAllBooks();

// if (sessionStorage.getItem("searchValue")) {
//     window.onload = searchBooks();
// }

function searchBooks() {

    var input, filter, books, i, title, author, txtValue, authorValue;

    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    books = document.querySelectorAll(".Book");

    // if there is a searchValue in the session storage,
    // get it and set the search input value to it.
    // This is used in the home page search bar
    // if (sessionStorage.getItem("searchValue")) {
    //     input.value = sessionStorage.getItem("searchValue");
    //     filter = input.value.toUpperCase();
    //     sessionStorage.removeItem("searchValue");
    //     input.focus();
    // }

    for (i = 0; i < books.length; i++) {

        title = books[i].querySelector("h3");
        author = books[i].querySelector("span");

        txtValue = title.innerText.toUpperCase();
        authorValue = author.innerText.toUpperCase();

        if (txtValue.indexOf(filter) > -1 || authorValue.indexOf(filter) > -1) { books[i].style.display = ""; }

        else { books[i].style.display = "none"; }

    }
}

function filterByCategory() {

    var selectBox = document.getElementById("categorySelect");
    var selectedCategory = selectBox.value;
    var books = document.querySelectorAll(".Book");

    if (books) {

        for (var i = 0; i < books.length; i++) {

            var bookCategory = books[i].getAttribute("data-category");

            if (selectedCategory === "all" || bookCategory === selectedCategory) { books[i].style.display = ""; }

            else { books[i].style.display = "none"; }

        }
    }
}

function AddAllBooks() {

    let myRequest = new XMLHttpRequest();
    myRequest.open("GET", "http://127.0.0.1:8000/api.books/");
    myRequest.send();

    myRequest.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {

            let data = JSON.parse(this.responseText);

            for (let i = 0; i < data.length; ++i) {

                let book =
                    `;
                <div class="Book"  data-category="${data[i]["category"]["name"]}">
                <div class="background-img">
                    <a href="../HTML/book.html?id=${data[i]["id"]}">
                       <img src="../backend${data[i]["cover"]}" alt="">
                    </a>
                </div>
                <div class="content">
                    <h3>${data[i]["title"]}</h3> 
                    <span><strong>Author(s):</strong>${data[i]["author"]["name"]}</span>
                    <a href="../HTML/book.html?id=${data[i]["id"]}">
                    <button id= "ShowDetails">Show details</button> 
                    </a>
                </div>
                </div>
                `;
                const parser = new DOMParser();
                const parsedDocument = parser.parseFromString(book, "text/html");

                let MyMain = document.querySelector(".main-books");
                MyMain.append(parsedDocument.querySelector(".book"));
            }
            // set category select list
            let select_list = document.getElementById("categorySelect");
            let uniqueCategories = new Set();

            for (let i = 0; i < data.length; i++) {
                const category = data[i]["category"]["name"];

                if (!uniqueCategories.has(category)) {
                    let option = document.createElement("option");
                    option.value = category;
                    option.text = category;
                    select_list.add(option);
                    uniqueCategories.add(category);
                }
            }

        }
    }
}


// Link addBook button with addBook page
document.getElementById("addBook").addEventListener("click", function () {
    window.location.href = "../HTML/add_book.html";
});

// Show addBook button for Admin only
function addBookButton() {

    document.getElementById("addBook").style.display = "none";

    let myRequest = new XMLHttpRequest();
    myRequest.open("GET", "http://127.0.0.1:8000/api.users/");
    myRequest.send();

    myRequest.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {

            let data = JSON.parse(this.responseText);

            if (data["isAdmin"] == true) {
                document.getElementById("addBook").style.display = "blank";
            }
        }
    }
}

addBookButton();