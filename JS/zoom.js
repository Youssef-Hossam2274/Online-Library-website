let bookImage = document.querySelector("#book-image");
let zoomContainer = document.querySelector(".zoom-container");
let zoomedImage = document.querySelector("#zoomed-image")
// Adding the event to book image
bookImage.addEventListener("mousemove", (e) => {
    // Showing the container
    zoomContainer.style.display = "block";
    
    // Extracting the current width and height
    let width = parseFloat(window.getComputedStyle(bookImage).width);
    let height = parseFloat(window.getComputedStyle(bookImage).height);
    
    // Extracting the current mouse position portion
    let x = e.offsetX / width;
    let y = e.offsetY / height;

    // Preserving x & y in the container
    if (x >= 0.95) {
        x = 0.95;
    }
    if (y >= 0.935) {
        y = 0.935;
    }

    // Zooming the current part
    zoomedImage.style.transform = `translate(-${x*100*0.6}%, -${y*100*0.8}%)`;

    console.log(x, y);
});

bookImage.addEventListener("mouseleave", (e) => {
    zoomContainer.style.display = "none";
});