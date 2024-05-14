function AddAllBooks() {
  let request = new XMLHttpRequest();
  request.open("GET", "http://127.0.0.1:8000/api.BorrowTransaction/");
  request.send();
  request.onload = () =>{
    
  }


  for (let i = 0; i < booksID.length; i += 1) {
      let curBookID = booksID[i];
      if (books[curBookID]) {
          let currentBook = books[curBookID];
          console.log(currentBook);
          let order = `
          <div class="order">
            <div class="order-id">#${curBookID}</div>
            <div class="info">
              <div class="title">${currentBook.title}</div>
              <div class="info-divider">
                <hr class="order-divider">
              </div>
              <div class="order-date-container">
                <div id="order-date">
                  <i class="fa-solid fa-calendar-days"></i> ${currentBook.publishDate}
                </div>
                <div id="order-address">
                  <i class="fa-solid fa-location-dot"></i> 132 Main St
                </div>
                <div id="in-use-order-status">In-use</div>
              </div>
              <div class="des">
                ${currentBook.description}
              </div>
              <div id="toggle-buttons">
                <button class="expand-button">Open Book</button>
                <button class="cancel-button">Cancel Order</button>
              </div>
            </div>
            <div class="cover-and-price">
              <div id="book-cover">
                <img src=${currentBook.imageURL} />
              </div>
            </div>
        </div>
          `;

          const parser = new DOMParser();
          const parsedDocument = parser.parseFromString(order, "text/html");
          
          let MyMain = document.querySelector(".order-list");
          MyMain.append(parsedDocument.querySelector(".order"));
          document.querySelector("#book-cover img").style.width = "150px";
      }
  }
}

// AddAllBooks();