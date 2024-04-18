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
    window.location.href = "login.html";
  }

let sideBar = 
`
  <div class="sidebar">
  <ul class="profile-options-list">
    <li class="ProfileDetails" onclick="AccountDetailsClick()"><a href="AccountDetails.html">
      <i class="fa-solid fa-address-book"></i>
      Account Details
    </a></li>
    <li class="profileOrders"onclick="OrdersClick()"><a href="orders.html">
      <i class="fa-solid fa-cart-shopping"></i>
      Orders
    </a></li>
    <li class="ProfileAddresses"onclick="AddressesClick()"><a href="addresses.html">
      <i class="fa-solid fa-location-dot"></i>
      Addresses
    </a></li>
    <li class="ProfilePaymentDetails"onclick="PaymentClick()"><a href="paymentDetails.html">
      <i class="fa-regular fa-credit-card"></i>
      Payment Details
    </a></li>
    <li class="SignOut"  style="border-bottom: none;" onclick="SignOutClick()"><a href="Login.html">
      <i class="fa-solid fa-right-from-bracket"></i>
      Sign Out
    </a></li>
    </ul>
  </div>
`

document.write(sideBar);