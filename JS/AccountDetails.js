const myImage = document.getElementById("profile-pic");

const uploadInput = document.getElementById("upload-photo");

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

const myForm = document.getElementById("profile-info");

function resetImage() {
    myImage.src = "../img/book-cover-placeholder.png";
}

myForm.addEventListener("reset", resetImage);