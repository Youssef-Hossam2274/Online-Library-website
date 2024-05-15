function AddAllBooks() {
    
  let request =  new XMLHttpRequest();
  request.open("GET", "http://127.0.0.1:8000/api.BorrowTransaction/");
  request.send();
  request.onload = () =>{
      let data = JSON.parse(request.responseText);
      let booksIDs = [];
      for(const T of  data){
          if(T["user"] == userId){
            let bookRequest = new XMLHttpRequest();
            bookRequest.open("GET", `http://127.0.0.1:8000/api.books/${T["book"]}`);
            bookRequest.send();
            bookRequest.onload = () =>{
                console.log(booksIDs);
                let bookData = JSON.parse(bookRequest.responseText);
                console.log(bookData);
                let order = `
                    <div class="order">
                      <div class="order-id">#${T["book"]}</div>
                      <div class="info">
                        <div class="title">${bookData["title"]}</div>
                        <div class="info-divider">
                          <hr class="order-divider">
                        </div>
                        <div class="order-date-container">
                          <div id="order-date">
                            <i class="fa-solid fa-calendar-days"></i> ${T["borrow_date"]}
                          </div>
                          <div id="order-address">
                            <i class="fa-solid fa-location-dot"></i> 132 Main St
                          </div>
                          <div id="in-use-order-status">In-use</div>
                        </div>
                        <div class="des">
                          ${bookData["description"]}
                        </div>
                        <div id="toggle-buttons">
                          <button class="expand-button">Open Book</button>
                          <button class="cancel-button">Cancel Order</button>
                        </div>
                      </div>
                      <div class="cover-and-price">
                        <div id="book-cover">
                          <img src="../backend${bookData["cover"]}" />
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
  }
}

AddAllBooks();