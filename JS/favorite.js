function AddAllBooks() {
    
    let request =  new XMLHttpRequest();
    request.open("GET", "http://127.0.0.1:8000/api.favorites/");
    request.send();
    request.onload = () =>{
        let data = JSON.parse(request.responseText);
        let booksIDs = [];
        for(const T of  data){
            if(T["user"] == userId)
                booksIDs.push(T["book"]);
        }
        // console.log(booksIDs);

        for(const bookID of booksIDs){
            let bookRequest = new XMLHttpRequest();
            bookRequest.open("GET", `http://127.0.0.1:8000/api.books/${bookID}`);
            bookRequest.send();
            bookRequest.onload = () =>{
                let bookData = JSON.parse(bookRequest.responseText);
                let book =
                `
                <div class="Book">
                    <div class="background-img">
                        <a href="../HTML/book.html?id=${bookID}">
                            <img src="../backend${bookData["cover"]}" />
                        </a>
                    </div>
                    <div class="content-book">
                        <h3>${bookData["title"]}</h3> 
                        <span><strong>Author(s):</strong>${bookData["author"]}</span>
                        <a href="../HTML/book.html?id=${bookID}">
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
        }
    }
}

AddAllBooks();