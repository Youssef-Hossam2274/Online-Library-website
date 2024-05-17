let open_eye = document.getElementById("open-eye");
let close_eye = document.getElementById("close-eye");
let password = document.getElementById("password-input");
let user = document.getElementById("user");
let admin = document.getElementById("admin");
let signupButton = document.querySelector(".sinup-button");
const myForm = document.querySelector(".signup-content");



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

    if(userName.trim() === ""){
        showMessage("User name is required", "red", false);
        return false;
    }

    // let request = new XMLHttpRequest();
    // request.open("GET",`http://127.0.0.1:8000/api.users/`);
    // request.send();
    // request.onload = () =>{
    //     let data = JSON.parse(request.responseText);
    //     let found = false;
    //     for(const user of data){
    //         if(user["username"] == userName)
    //             found = true;
    //     }
        
    //     if(found == true){
    //         showMessage("User name is already exist !!!", "red", false);
    //         return false;
    //     }
    //     else
    //         return true;
    // }
    return true;
}


function ValidPassword(password){
    if(password.trim() === "")
    {
        showMessage("Password is required", "red", false);
        return false;
    }
    return true;
}

function ValidEmail(email)
{
    if(email.trim() == ""){
        showMessage("Email is required", "red", false);
        return false;
    }
    else if (email.includes("@") == false){
        showMessage("Email is invalid", "red", false);
        return false;
    }
    return true;
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
        window.localStorage.setItem("user_id", response["id"]);
        window.localStorage.setItem("isAdmin", response["isAdmin"]);
        window.localStorage.setItem("isSignUp", true);
    }
}

signupButton.onclick = () =>{
    let userType = false, validation = true;
    if (admin.className === "admin type-active")
        userType = true;

    let userName = document.getElementById("user-input").value;
    let userPassword = document.getElementById("password-input").value;
    let confirmPassword = document.getElementById("confirm-input").value;
    let userEmail = document.getElementById("email-input").value;

    console.log(ValidUserName(userName));

    if(ValidUserName(userName) == false){
        validation = false;
    }
    if(ValidPassword(userPassword) == false)
        validation = false;
    
    if(confirmPassword.trim() === ""){
        showMessage("Confirm password is required", "red", false);
        validation = false;
    }    
    if (confirmPassword != userPassword){
        showMessage("Password or confirm password is wrong", "red", false);
        validation = false;
    }
    if(ValidEmail(userEmail) == false)
        validation = false;


    if(validation == false)
        return;

    addToAPI(userName, userPassword, userEmail, userType);
}



if(userId != null)
    window.location.href= "../HTML/Home.html"; 