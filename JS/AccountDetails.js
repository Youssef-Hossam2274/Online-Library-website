const myImage = document.getElementById("profile-pic");
const uploadInput = document.getElementById("upload-photo");
let remove_photo = document.getElementById("remove-photo-label");
remove_photo.onclick = function(){
    myImage.src = "../img/profile-icon.png";
}

uploadInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            myImage.src = e.target.result;
            myImage.style.borderRadius  = 35 + "px";
        };
        reader.readAsDataURL(file);
    }
});

const myForm = document.getElementById("profile-info");

function resetImage() {
    myImage.src = "../img/book-cover-placeholder.png";
}

myForm.addEventListener("reset", resetImage);

