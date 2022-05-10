//DOM
const orderId = document.querySelector("#orderId");

//search order id saved in url
let url = new URL(document.location).searchParams;
let urlOrderId = url.get("orderid");

//assign order id from url to dom
orderId.textContent = urlOrderId;
