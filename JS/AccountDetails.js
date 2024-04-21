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


function resetImage() {
    myImage.src = "../img/book-cover-placeholder.png";
}

// myForm.addEventListener("reset", resetImage);



// console.log(userData.length);
// console.log(curUser);

function showDetails(){
    let userData = JSON.parse(window.localStorage.getItem("users"));
    let curUser = userData[userId];
    document.querySelector(".first-name-input input").value = curUser.firstName;
    document.querySelector(".second-name input").value = curUser.lastName;
    document.querySelector("#email-input input").value = curUser.email;
    console.log(curUser.email);
}

function saveChanges()
{
    let userData = JSON.parse(window.localStorage.getItem("users"));
    let curUser = userData[userId];
    let firstName = document.querySelectorAll(".user-info-input")[0].value;
    let secondName = document.querySelectorAll(".user-info-input")[1].value;
    let email = document.querySelector(".email-input input").value;

    curUser.firstName = firstName;
    curUser.lastName = secondName;
    curUser.email = email;

    userData[userId] = curUser;
    userData = JSON.stringify(userData);

    window.localStorage.setItem("users", userData);

}

// let userData = JSON.parse(window.localStorage.getItem("users"));
// let curUser = userData[userId];

showDetails();
let myForm = document.querySelector(".edit-user-info");
myForm.addEventListener("submit", saveChanges);
