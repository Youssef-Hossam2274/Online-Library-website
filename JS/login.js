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

let password_label = getElementById("password-label");