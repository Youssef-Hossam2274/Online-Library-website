let userData = JSON.parse(window.localStorage.getItem("users"));
    let curUser = userData[userId];

function showDetails(){
    let userData = JSON.parse(window.localStorage.getItem("users"));
    let curUser = userData[userId];
    
    document.querySelector("#hello-user-profile").innerHTML = curUser.userName;
    
}

showDetails();
document.querySelector("#profile-pic").src = curUser.imageURL;


let order = `
<div class="order-id">#12545</div>
<div class="info">
  <div class="title">Advanced Calculus</div>
  <div class="info-divider">
    <hr class="order-divider">
  </div>
  <div class="order-date-container">
    <div id="order-date">
      <i class="fa-solid fa-calendar-days"></i> March 5, 2022
    </div>
    <div id="order-address">
      <i class="fa-solid fa-location-dot"></i> 132 Main St
    </div>
    <div id="in-use-order-status">In-use</div>
  </div>
  <div class="des">
    Classic text leads from elementary calculus into more theoretic
    problems. Precise approach with definitions, theorems, proofs,
    examples and exercises. Topics include partial differentiation,
    vectors, differential geometry, infinite series, gamma function,
    Fourier series, Laplace transform, much more. Numerous graded
    exercises with selected answers.
  </div>
  <div id="toggle-buttons">
    <button class="expand-button">Open Book</button>
    <button class="cancel-button">Cancel Order</button>
  </div>
</div>
<div class="cover-and-price">
  <div id="book-cover">
    <img src="../img/Calculus.webp" />
  </div>
  <!-- <div id="order-price">$19.99</div> -->
</div>
`;

