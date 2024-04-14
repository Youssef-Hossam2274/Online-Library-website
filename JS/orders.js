const order = document.querySelector(".order");
const expandButton = order.querySelector(".expand-button");
const cancelButton = order.querySelector(".cancel-button");
expandButton.addEventListener("click", () => {
  order.classList.add("expanded");
  // order.info.toggle-buttons.style.display = "flex";
});
cancelButton.addEventListener("click", () => {
  order.classList.remove("expanded");
  expandButton.style.display = "block";
  cancelButton.style.display = "none";
});

order.addEventListener("click", () => {
  const toggleButtons = order.querySelector("#toggle-buttons");
  toggleButtons.style.display = "flex";
});


