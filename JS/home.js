let isLogin = JSON.parse(window.sessionStorage.getItem("isLogin"));
let isSignUp = JSON.parse(window.sessionStorage.getItem("isSignUp"));

if(isLogin)
{
    showMessage("Login in is succsess");
    sessionStorage.removeItem("isLogin");
}

if(isSignUp)
{
    showMessage("Registration Successfully");
    sessionStorage.removeItem("isSignUp");

}