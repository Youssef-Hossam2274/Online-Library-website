let open_eye = document.getElementById("open-eye");
let close_eye = document.getElementById("close-eye");
let password = document.getElementById("password-input");
let user = document.getElementById("user");
let admin = document.getElementById("admin");

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


user.onclick = function(){
    user.classList.add("type-active");
    admin.classList.remove("type-active");
}

admin.onclick = function(){
    admin.classList.add("type-active");
    user.classList.remove("type-active");
}


function ValidUserName(userName){
    if(userName.trim() === "")
    {
        alert("User name is required");
        return false;
    }

    const usersArr = JSON.parse(window.localStorage.getItem("users"));
    if(usersArr)
    {
        for(let i = 0; i < usersArr.length; ++i)
        {
            if (userName == usersArr[i].userName)
            {
                alert("User name already exist");
                return false;
            }
        }
    }
    return true;
}

function ValidPassword(password){
    if(password.trim() === "")
    {
        alert("Password is required");
        return false;
    }
}

function ValidEmail(email)
{
    // var pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    // if(email.match(pattern) == false){
    //     alert("email is not valid")
    //     return false;
    // }
    if(email.trim() == "")
    {
        alert("Email is requird");
        return false;
    }
    else if (email.includes("@") == false)
    {
        alert("Email is invalid");
        return;
    }
}

function addNewUser(){
    let userType = false;
    if (admin.className === "admin type-active")
        userType = true;

    let userName = document.getElementById("user-input").value;
    let userPassword = document.getElementById("password-input").value;
    let confirmPassword = document.getElementById("confirm-input").value;
    let userEmail = document.getElementById("email-input").value;



    if(ValidUserName(userName) == false)
        return;
    else if(ValidPassword(userPassword) == false)
        return;
    else if(confirmPassword.trim() === "")
    {
        alert("Confirm password is required");
        return;
    }    
    else if (confirmPassword != userPassword)
    {
        alert("Password or confirm password is wrong");
        return;
    }

    else if(ValidEmail(userEmail) == false)
        return;

    // addToAPI(userName, userPassword, userEmail, userType);
    addToAPI(userName, userPassword, userEmail, userType);
    for(let i = 0; i < 2000; ++i)
        console.log("aaaaaa");
    
}

function addToAPI(userName, userPassword, userEmail, userType){
    let request = new XMLHttpRequest();
    request.open("POST", "http://127.0.0.1:8000/api.users/");
    request.responseType = "json";
    request.setRequestHeader("Content-type", "application/json");
    let requestBody = `{
        "username": "${userName}",
        "password": "${userPassword}",
        "email": "${userEmail}",
        "isAdmin": ${userType}
    }`;
    request.send(requestBody);
    request.onload = function(){
        let response = request.response;
        for(let i = 0; i < 1000; ++i)
            console.log(i);
        
        window.localStorage.setItem("user_id", response["id"]);
        window.localStorage.setItem("isAdmin", response["isAdmin"]);
        window.localStorage.setItem("isSignUp", true);
    }
}

const myForm = document.querySelector(".signup-content");
myForm.addEventListener("submit", addNewUser);

if(userId != null)
    window.location.href= "../HTML/Home.html"; 