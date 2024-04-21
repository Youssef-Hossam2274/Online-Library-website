// get the latest 5 books objects from the local storage book list and add them to the home page

let books = JSON.parse(localStorage.getItem("books"));
let recentBooks = document.getElementsByClassName("recent-books")[0];

if (books) {
    for (let i = books.length - 1; i >= books.length - 5; i--) {
        let currentBook = books[i];
        let book = `;
        <div class="Book">
            <div class="background-img">
                <a href="../HTML/book.html?id=${i}">
                    <img src="${books[i].imageURL}" />
                </a>
            </div>
            <div class="content">
                <h3>${currentBook.title}</h3> 
                <span><strong>Author(s):</strong>${currentBook.author}</span>
                <a href="../HTML/book.html?id=${i}">
                   <button id= "ShowDetails">Show details</button> 
                </a>
            </div>
        </div>
        `;

        const parser = new DOMParser();
        const parsedDocument = parser.parseFromString(book, "text/html");

        recentBooks.append(parsedDocument.querySelector(".book"));
    }
}

// search bar
/* 
    1. get the search button and search bar
    2. add an event listener to the search button
    3. get the search input value
    4. change page location to all_books.html by getting the url and change the page name to all_books.html
    5. add the search input to the page search bar value

*/

let searchButton = document.querySelector("[type='submit']");
let searchBar = document.querySelector("#search");

searchButton.addEventListener("click", function (e) {
    e.preventDefault();
    let searchValue = searchBar.value;
    let url = window.location.href;
    let newUrl = url.replace("Home.html", "all_books.html");
    window.location.href = newUrl;

    // store the search value in the session storage
    sessionStorage.setItem("searchValue", searchValue);

    
});
