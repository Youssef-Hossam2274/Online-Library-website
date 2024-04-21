// user logged profile image change 
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
// -----------------------------------------------


// myForm.addEventListener("reset", resetImage);



function showDetails(){
    let userData = JSON.parse(window.localStorage.getItem("users"));
    let curUser = userData[userId];
    if (curUser.firstName){
        document.querySelector("#first-name-input").value = curUser.firstName;
    } 
    if (curUser.lastName) {
        document.querySelector("#second-name-input").value = curUser.lastName;
    }
    document.querySelector("#user-email-input").value = curUser.email;
    if (curUser.phoneNumber) {
        document.querySelector("#phone-number-input").value = curUser.phoneNumber;
    }
}


function saveChanges()
{
    let userData = JSON.parse(window.localStorage.getItem("users"));
    let curUser = userData[userId];

    // let password = document.querySelector("#current-password-input").value;
    // let New_password_1 = document.querySelector("#new-password-1").value;
    // let New_password_2 = document.querySelector("#new-password-2").value;
    
    // if(password.trim() === "")
    // { // validate if password is not empty
    //     alert("your current password is required");
    //     return false;
    // }
    

    // if ((New_password_1 === New_password_2) && (New_password_1.trim() !== "") && (New_password_2.trim() !== "")) {
        
    // }
    
    let _firstName_ = document.querySelector("#first-name-input").value; 
    let _lastName_ = document.querySelector("#second-name-input").value;
    let _phoneNumber_ = document.querySelector("#phone-number-input").value;
    curUser.firstName = _firstName_;
    curUser.lastName = _lastName_;
    curUser.phoneNumber = _phoneNumber_;
    console.log(curUser);

    // console.log(typeof _firstName_);
    // console.log(typeof _lastName_);
    // console.log(typeof _phoneNumber_);
    // console.log(`_firstName_: ${_firstName_}, _lastName_: ${_lastName_}, _phoneNumber_: ${_phoneNumber_}`);

    // if ((curUser.firstName && firstName.trim() !== "") || (!curUser.firstName && firstName.trim() !== "")) {
    //     curUser.firstName = firstName;
    // } 
    // if ((curUser.lastName && lastName.trim() !== "") || (!curUser.lastName && lastName.trim() !== "")) {
    //     curUser.lastName = lastName;
    // }
    // if ((curUser.phoneNumber && phoneNumber.trim() !== "") || (!curUser.phoneNumber && phoneNumber.trim() !== "")) {
    //     curUser.phoneNumber = phoneNumber;
    // }
    
    userData[userId] = curUser;
    userData = JSON.stringify(userData);
    window.localStorage.setItem("users", userData);
}

// let userData = JSON.parse(window.localStorage.getItem("users"));
// let curUser = userData[userId];
// curUser.firstName = "Eslam";
// curUser.lastName= "Sayed";
// console.log(curUser);

showDetails();
let myForm = document.querySelector(".edit-user-info");
myForm.addEventListener("submit", saveChanges());
