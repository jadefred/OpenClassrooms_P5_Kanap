//fetch all products
async function getProducts() {
  try {
    const response = await fetch("http://localhost:3000/api/products");
    const data = await response.json();
    displayProducts(data);
  } catch (e) {
    console.log(e);
  }
}
getProducts();

//get products from local storage
const productArr = JSON.parse(localStorage.getItem("products"));

//DOM and variables - display items from LS
const cartSection = document.querySelector("#cart__items");
const totalQuantityElement = document.querySelector("#totalQuantity");
const totalPriceElement = document.querySelector("#totalPrice");
let totalPrice = 0;
let totalQuantity = 0;

//display elements
function displayProducts(data) {
  //for loop through LS array
  for (const i of productArr) {
    //create article
    const article = document.createElement("article");
    article.className = "cart__item";
    article.setAttribute("data-id", i._id);
    article.setAttribute("data-color", i.color);

    //create all sub divs and assign class name
    const allVariablesNames = [
      "imgDiv",
      "allDetailsDiv",
      "nameColorPriceDiv",
      "quantityDeletebtnDiv",
      "quantityInputDiv",
      "deletebtnDiv",
    ];

    const allDivClassName = [
      "cart__item__img",
      "cart__item__content",
      "cart__item__content__description",
      "cart__item__content__settings",
      "cart__item__content__settings__quantity",
      "cart__item__content__settings__delete",
    ];

    for (let i = 0; i < allVariablesNames.length; i++) {
      window[allVariablesNames[i]] = document.createElement("div");
      window[allVariablesNames[i]].className = allDivClassName[i];
    }

    //create image
    const img = document.createElement("img");
    img.src = data.find((obj) => obj._id == i._id).imageUrl;
    img.alt = data.find((obj) => obj._id == i._id).altTxt;
    imgDiv.append(img);

    //quantity
    const quantity = i.quantity;
    totalQuantity += parseInt(quantity);

    //create name, color, price
    const name = document.createElement("p");
    const color = document.createElement("p");
    const price = document.createElement("p");
    name.textContent = data.find((obj) => obj._id == i._id).name;
    color.textContent = i.color;
    let unformattedPrice =
      data.find((obj) => obj._id == i._id).price * quantity;
    totalPrice += unformattedPrice;
    price.textContent = new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(unformattedPrice);
    nameColorPriceDiv.appendChild(name);
    nameColorPriceDiv.appendChild(color);
    nameColorPriceDiv.appendChild(price);

    //quantity and input element for changing
    const quantityText = document.createElement("p");
    const quantityInput = document.createElement("input");
    quantityText.textContent = "Qté : ";
    quantityInput.type = "number";
    quantityInput.className = "itemQuantity";
    quantityInput.name = "itemQuantity";
    quantityInput.min = 1;
    quantityInput.max = 100;
    quantityInput.value = quantity;
    quantityInputDiv.appendChild(quantityText);
    quantityInputDiv.appendChild(quantityInput);

    //add event listener to input, change total quantity, total price and individual price
    quantityInput.addEventListener("change", () => {
      modifyPriceQuantity(quantityInput, i, data, price);
    });

    //delete button
    const deleteBtn = document.createElement("p");
    deleteBtn.className = "deleteItem";
    deleteBtn.textContent = "Supprimer";
    deletebtnDiv.appendChild(deleteBtn);

    //add event listener to delete button
    deleteBtn.addEventListener("click", () => {
      clickToDeleteProduct(i, article, data);
    });

    //append child - divs
    cartSection.appendChild(article);
    article.appendChild(imgDiv);
    article.appendChild(allDetailsDiv);
    allDetailsDiv.appendChild(nameColorPriceDiv);
    allDetailsDiv.appendChild(quantityDeletebtnDiv);
    quantityDeletebtnDiv.appendChild(quantityInputDiv);
    quantityDeletebtnDiv.appendChild(deletebtnDiv);
  }

  //modify total quantity and total price
  totalQuantityElement.textContent = totalQuantity;
  totalPriceElement.textContent = totalPrice + ",00";
}

//-----------------------------------------------------------------------------------
//------------------ Call back functions for event listeners ------------------------
//-----------------------------------------------------------------------------------
//call back function for delete product event listener
//click to delete item from dom, LS and display new total quantity and total price
function clickToDeleteProduct(i, article, data) {
  let index = productArr.indexOf(i);
  productArr.splice(index, 1);
  localStorage.setItem("products", JSON.stringify(productArr));
  cartSection.removeChild(article);
  totalQuantity -= i.quantity;
  totalQuantityElement.textContent = totalQuantity;
  const oldPrice = data.find((obj) => obj._id == i._id).price * i.quantity;
  totalPrice -= oldPrice;
  totalPriceElement.textContent = totalPrice + ",00";
}

function modifyPriceQuantity(quantityInput, i, data, price) {
  if (quantityInput.value <= 0 || quantityInput.value > 100) {
    return;
  }
  //modify price
  //create new price, compare with old price, change old price to new, and modify total price
  const newPrice =
    data.find((obj) => obj._id == i._id).price * quantityInput.value;
  const oldPrice = data.find((obj) => obj._id == i._id).price * i.quantity;
  const priceDifference = newPrice - oldPrice;
  totalPrice += priceDifference;
  price.textContent = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(newPrice);
  totalPriceElement.textContent = totalPrice + ",00";

  //modify quantity according input value
  let quantityDifference = quantityInput.value - i.quantity;
  totalQuantity += quantityDifference;
  i.quantity = quantityInput.value;
  //change LS each quantity and total quantity display
  localStorage.setItem("products", JSON.stringify(productArr));
  totalQuantityElement.textContent = totalQuantity;
}

//-----------------------------------------------------------------------------------
//------------------ Get clients' information and POST to server---------------------
//-----------------------------------------------------------------------------------
//check info and alert of info formet correct or not
//DOM - form elements and submit button
const firstName = document.querySelector("#firstName");
const lastName = document.querySelector("#lastName");
const address = document.querySelector("#address");
const city = document.querySelector("#city");
const email = document.querySelector("#email");
const submitbtn = document.querySelector("#order");
const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

//DOM - error message
const wrongFirstNameMsg = document.querySelector("#firstNameErrorMsg");
const wrongLastNameMsg = document.querySelector("#lastNameErrorMsg");
const wrongAddressMsg = document.querySelector("#addressErrorMsg");
const wrongCityMsg = document.querySelector("#cityErrorMsg");
const wrongEmailMsg = document.querySelector("#emailErrorMsg");

//submit button event listener
submitbtn.addEventListener("click", (e) => {
  e.preventDefault();
  //check if the user entered all information
  if (
    productArr.lenght == 0 ||
    !firstName.value ||
    !lastName.value ||
    !address.value ||
    !city.value ||
    !email.value ||
    emailPattern.test(email.value) == false
  ) {
    //if info is not completed or email is not in correct formet,show warning accordingly
    //remove the warning message if client entered the correct informations
    if (!firstName.value) {
      wrongFirstNameMsg.textContent = "Veuillez entrer votre prénom";
    } else wrongFirstNameMsg.textContent = "";
    if (!lastName.value) {
      wrongLastNameMsg.textContent = "Veuillez entrer votre nom";
    } else wrongLastNameMsg.textContent = "";
    if (!address.value) {
      wrongAddressMsg.textContent = "Veuillez entrer votre adresse";
    } else wrongAddressMsg.textContent = "";
    if (!city.value) {
      wrongCityMsg.textContent = "Veuillez entrer votre ville";
    } else wrongCityMsg.textContent = "";
    if (!email.value) {
      wrongEmailMsg.textContent = "Veuillez entrer votre email";
    } else if (emailPattern.test(email.value) == false) {
      wrongEmailMsg.textContent =
        "L'adresse email est incorrect. Veuillez la modifier";
    } else wrongEmailMsg.textContent = "";
  }
  //all info is completed and correct
  else {
    //push productArrs' id to a empty array for POST after
    let products = [];
    for (const i of productArr) {
      products.push(i._id);
    }

    //object which contain contact of client and his products' id
    const order = {
      contact: {
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        city: city.value,
        email: email.value,
      },
      products: products,
    };

    //Prepare post object
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    };

    //get confirmation id from server
    placeOrder(options);
  }
});

async function placeOrder(options) {
  try {
    const response = await fetch(
      "http://localhost:3000/api/products/order",
      options
    );
    const data = await response.json();

    //clear LS, to clear selected products
    localStorage.clear();

    //save server given order id, create empty array and set item in LS
    const orderedProductsId = {
      _id: data.orderId,
    };

    let orderProductsArr = [];
    orderProductsArr.push(orderedProductsId);
    localStorage.setItem("confirmation", JSON.stringify(orderProductsArr));
    document.location.href = "confirmation.html";
  } catch (e) {
    console.log(e);
  }
}
