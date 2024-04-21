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




function checkUser(){

    let user_name = document.getElementById("user-input").value;
    let user_password = document.getElementById("password-input").value;

    const usersArr = JSON.parse(window.localStorage.getItem("users"));
    
    window.sessionStorage.setItem("user_id", -1);
    window.sessionStorage.setItem("isAdmin", "not found");

    for(let i = 0; i < usersArr.length; ++i)
    {
        if(usersArr[i].userName == user_name && usersArr[i].password == user_password )
        {
            window.sessionStorage.setItem("user_id", i);
            window.sessionStorage.setItem("isAdmin", usersArr[i].isAdmin);
        }
    }
    
}

let user_id = JSON.parse(window.sessionStorage.getItem("user_id"));
console.log(user_id);
if(user_id != null)
    window.location.href= "../HTML/Home.html"; 

const myForm = document.querySelector(".login-content");
myForm.addEventListener("submit", checkUser);
// window.sessionStorage.clear();