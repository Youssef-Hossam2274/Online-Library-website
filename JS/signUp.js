let eyeIcon1 = document.getElementById("eyeIcon1");
let eyeIcon2 = document.getElementById("eyeIcon2");

let password = document.getElementById("password");
let confirmPassword = document.getElementById("ConfirmPassword");

eyeIcon1.onclick = function()
{
    if(password.type == "password")
    {
        password.type = "text";
        eyeIcon1.src = "../img/open-eye.png";
    }
    else
    {
        password.type = "password";
        eyeIcon1.src = "../img/close-eye.png";
    }
}
eyeIcon2.onclick = function()
{
    if(confirmPassword.type == "password")
    {
        confirmPassword.type = "text";
        eyeIcon2.src = "../img/open-eye.png";
    }
    else
    {
        confirmPassword.type = "password";
        eyeIcon2.src = "../img/close-eye.png";
    }
}


