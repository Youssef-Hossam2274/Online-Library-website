function searchBooks() {

    var input, filter, sections, i, j, books, book, title, author, txtValue;

    input = document.getElementById('searchInput');
    filter = input.value.toUpperCase();
    sections = document.querySelectorAll("section");

    for (i = 0; i < sections.length; i++) {

        books = sections[i].getElementsByClassName('Book');
        for (j = 0; j < books.length; j++) {

            book = books[j];
            title = book.getElementsByTagName("h3")[0];
            author = book.getElementsByTagName("p")[0];

            txtValue = title.innerText.toUpperCase();
            authorValue = author.innerText.toUpperCase();


            if (txtValue.indexOf(filter) > -1 || authorValue.indexOf(filter) > -1) { book.style.display = ""; }

            else { book.style.display = "none"; }
        }
    }
}

function filterByCategory() {

    var select, sections, i, category;
    select = document.getElementById('categorySelect');
    category = select.value.toLowerCase();
    sections = document.querySelectorAll("section");

    for (i = 0; i < sections.length; i++) {
        if (sections[i].className.toLowerCase() !== category && category !== 'all') {
            sections[i].style.display = "none";
        } else {
            sections[i].style.display = "";
        }
    }
}

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


function showAllBooks()
{
    let books = JSON.parse(window.localStorage.getItem("books"));
    for(let i = 0; i < books.length ; i += 1)
    {
        let currentBook = books[i];
        let book = 
        `;
        <div class="Book">
            <div class="background-img">
                <a href="Calculus" target="_blank">
                    <img src="../img/blank.png" />
                </a>
            </div>
            <div class="content">
                <h3>Advanced ${currentBook.title}</h3> 
                <span><strong>Author(s):</strong> ${currentBook.author}</span>
                <button >Show details </button>
            </div>
        </div>
        `;
    
        const parser = new DOMParser();
        const parsedDocument = parser.parseFromString(book, "text/html");
        
        let MyMain = document.querySelector(".main-books");
        MyMain.append(parsedDocument.querySelector(".book"));
    }
}

showAllBooks();
function fetchID()
{
    let books = document.querySelectorAll(".Book");
    let buttons = document.querySelectorAll(".Book button");
    for(let i = 0; i < books.length; ++i)
    {
        buttons[i].onclick = function(){
            let id = window.localStorage.setItem("single-book-id", i);
            console.log(i);
        }
    }
}

fetchID();