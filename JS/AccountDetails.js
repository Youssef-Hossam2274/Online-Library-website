const myProfileImage = document.getElementById("profile-pic");

const uploadInput = document.getElementById("upload-profile-img");

uploadInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            myProfileImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

const myForm = document.getElementById("profile-details");

function resetImage() {
    myProfileImage.src = "../img/profile-placeholder.png";
}

myForm.addEventListener("reset", resetImage);
