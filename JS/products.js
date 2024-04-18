function searchBooks() {

    var input, filter, sections, i, j, books, book, title, txtValue;

    input = document.getElementById('searchInput');
    filter = input.value.toUpperCase();
    sections = document.querySelectorAll("section[id^='']");

    for (i = 0; i < sections.length; i++) {

        books = sections[i].getElementsByClassName('Book');
        for (j = 0; j < books.length; j++) {

            book = books[j];
            title = book.querySelector("h3")[0];
            txtValue = title.innerText;

            if (txtValue.toUpperCase().indexOf(filter) > -1) { book.style.display = ""; }

            else { book.style.display = "none"; }

        }
    }
}

function filterByCategory() {

    var select, sections, i, category;

    select = document.getElementById('categorySelect');
    category = select.value.toLowerCase();
    sections = document.querySelectorAll('section[id^=""]');

    for (i = 0; i < sections.length; i++) {

        if (sections[i].id.toLowerCase() !== category && category !== 'all') { sections[i].style.display = "none"; }

        else { sections[i].style.display = "block"; }

    }
}
