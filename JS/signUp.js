let open_eye = document.getElementById("open-eye");
let close_eye = document.getElementById("close-eye");
let password = document.getElementById("password-input");

open_eye.onclick = close_eye.onclick = function()
{
    if(password.type == "password")
    {
        password.type = "text"
        open_eye.style.display = "flex";
        close_eye.style.display = "none";
        
    }
    else
    {
        password.type = "password";
        open_eye.style.display = "none";
        close_eye.style.display = "flex";
    }
}

let user = document.getElementById("user");
let admin = document.getElementById("admin");

user.onclick = function(){
    user.classList.add("type-active");
    admin.classList.remove("type-active");
}

admin.onclick = function(){
    admin.classList.add("type-active");
    user.classList.remove("type-active");
}


class User {
    constructor(
        userName,
        password,
        email,
        isAdmin,               
        firstName,
        lastName,
        imageURL,
        books,
        favorites
    ) {
        this.userName = userName;
        this.password = password;
        this.email = email;
        this.isAdmin = isAdmin;
        this.firstName = firstName;
        this.lastName = lastName;
        this.imageURL = imageURL;
        this.books = books;
        this.favorites = favorites;
    }
}



function addNewUser(){
    let userType = false;
    if (admin.className === "admin type-active")
        userType = true;

    const newUser = new User(
        document.getElementById("user-input").value,
        document.getElementById("password-input").value,
        document.getElementById("email-input").value,
        userType,
        "",
        "",
        "",
        [],
        []
    );
    let usersJSON = window.localStorage.getItem("users");
    let updatedJSON, usersArr;

    if (usersJSON) {
        usersArr = JSON.parse(usersJSON);
        usersArr.push(newUser);
        updatedJSON = JSON.stringify(usersArr);
    } else {
        updatedJSON = JSON.stringify([newUser]);
    }
    window.localStorage.setItem("users", updatedJSON);

    window.sessionStorage.setItem("user_id", usersArr.length-1);
    window.sessionStorage.setItem("isAdmin", userType);

}


const myForm = document.querySelector(".signup-content");
myForm.addEventListener("submit", addNewUser);

let user_id = JSON.parse(window.sessionStorage.getItem("user_id"));
console.log(user_id);
if(user_id != null)
    window.location.href= "../HTML/Home.html"; 

//--------------Form Validation

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".signup-content");
  const usernameInput = document.getElementById("user-input");
  const passwordInput = document.getElementById("password-input");
  const confirmPasswordInput = document.getElementById("confirm-input");
  const emailInput = document.getElementById("email-input");

  form.addEventListener("submit", function (event) {
    let valid = true;

    if (usernameInput.value.trim() === "") {
      alert("Username is required.");
      valid = false;
    }

    if (passwordInput.value.trim() === "") {
      alert("Password is required.");
      valid = false;
    } else if (passwordInput.value.length < 8) {
      alert("Password must be at least 8 characters long.");
      valid = false;
    }

    if (confirmPasswordInput.value !== passwordInput.value) {
      alert("Passwords do not match.");
      valid = false;
    }

    if (!emailInput.value.includes("@")) {
      alert("Please enter a valid email address.");
      valid = false;
    }

    if (!valid) {
      event.preventDefault();
    }
  });
});

