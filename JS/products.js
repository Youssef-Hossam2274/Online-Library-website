

function searchBooks() {
    var input, filter, sections, i, j, books, book, title, txtValue;

    input = document.getElementById('searchInput');
    filter = input.value.toUpperCase();
    sections = document.querySelectorAll("section.Book_sections");

    for (i = 0; i < sections.length; i++) {

        books = sections[i].getElementsByClassName('Book');
        for (j = 0; j < books.length; j++) {

            book = books[j];
            title = book.getElementsByTagName("h3")[0];
            txtValue = title.innerText;

            if (txtValue.toUpperCase().indexOf(filter) > -1) { book.style.display = ""; }

            else { book.style.display = "none"; }

        }
    }
}