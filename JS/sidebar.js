function AccountDetailsClick() {
    window.location.href = "AccountDetails.html";
}

function OrdersClick() {
  window.location.href = "orders.html";
}

function AddressesClick() {
  window.location.href = "addresses.html";
}

function PaymentClick() {
  window.location.href = "paymentDetails.html";
}

function SignOutClick() {
  localStorage.clear();
}

function addSideBar(username, photo){
    let sideBar =
    `
    <div class = "sidebar-content">
      <div class="profile-info">
        <img src="../backend/photos/${photo}"  alt="placeholder" id="profile-pic">
        <div>Hello <span id="hello-user" style="color: black;">${username}</span> </div>
      </div>
      
      <div class="change-photo">
        <form class=""> 
          <input id="upload-photo" type="file"  accept="image/*">
          <label class="upload-photo-label"  for="upload-photo"><i class="fa-solid fa-upload"></i> Upload</label>
        </form>
        <span class="remove-photo-label" id = "remove-photo-label" ></i> Remove</span>
      </div>
      
      <ul class="profile-options-list">
        <li class="ProfileDetails" onclick="AccountDetailsClick()"><a href="AccountDetails.html">
          <i class="fa-solid fa-address-book"></i>
          Account Details
        </a></li>
        <li class="profileOrders"onclick="OrdersClick()"><a href="orders.html">
          <i class="fa-solid fa-list"></i>
          Your Books
        </a></li>
        <li class="ProfileFavorite"><a href="favourites.html">
          <i class="fa-solid fa-heart"></i>
          Favorite
        </a></li>
        <li class="SignOut"  style="border-bottom: none;" onclick="SignOutClick()"><a href="Login.html">
          <i class="fa-solid fa-right-from-bracket"></i>
          Sign Out
        </a></li>
      </ul>
    </div>
    ` 

    const parser = new DOMParser();
    const parsedDocument = parser.parseFromString(sideBar, "text/html");

    let content = document.querySelector(".sidebar");
    content.append(parsedDocument.querySelector(".sidebar-content"));
}


async function updateUser(userId, userData) {
  const url = `http://127.0.0.1:8000/api.users/${userId}/`;

  try {
      const response = await fetch(url, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
          },
          body: JSON.stringify(userData)
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error:', error);
      throw error;
  }
}

async function main(){
  const resolve = await fetch(`http://127.0.0.1:8000/api.users/${userId}/`);
  let myData = resolve.json();
  const userData = await myData;
  addSideBar(userData.username, userData.photo);

  const myImage = document.getElementById("profile-pic");
  const uploadInput = document.getElementById("upload-photo");
  let remove_photo = document.querySelector(".remove-photo-label");
  
  let isEditPhoto = false;
  let newPhoto;
  remove_photo.onclick = ()=>{
    newPhoto = "photo_default.png";
    isEditPhoto = true;
    const editData = {
      photo: newPhoto
    };
    updateUser(userId, editData);

  }

  uploadInput.addEventListener("change", (event) => {
    console.log(1);
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            myImage.src = e.target.result;
            myImage.style.borderRadius  = 35 + "px";
            // saveImage(myImage.src);
        };

    }
    for(let i = 0; i < uploadInput.value.length; ++i){
      if(uploadInput.value[i] == '\\'){
        newPhoto = (uploadInput.value.substring(i+1));
      }
    }

    const editData = {
      photo: newPhoto
    };
    updateUser(userId, editData);
  });

  function resetImage() {
    myImage.src = "../img/profile-icon.png";
    saveImage(myImage.src);
  }
  
}

main();