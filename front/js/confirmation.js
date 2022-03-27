//DOM
const orderId = document.querySelector("#orderId");

//get id from LS
const idFromLs = JSON.parse(localStorage.getItem("confirmation"));

displayOrderId();
function displayOrderId() {
  orderId.textContent = idFromLs[0]._id;
  localStorage.clear();
}
