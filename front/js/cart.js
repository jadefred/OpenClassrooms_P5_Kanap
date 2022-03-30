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

    //-----------------------old version of creating div below-----------------------------
    //create divs
    // const imgDiv = document.createElement("div");
    // imgDiv.className = "cart__item__img";
    // const allDetailsDiv = document.createElement("div");
    // allDetailsDiv.className = "cart__item__content";
    // const nameColorPriceDiv = document.createElement("div");
    // nameColorPriceDiv.className = "cart__item__content__description";
    // const quantityDeletebtnDiv = document.createElement("div");
    // quantityDeletebtnDiv.className = "cart__item__content__settings";
    // const quantityInputDiv = document.createElement("div");
    // quantityInputDiv.className = "cart__item__content__settings__quantity";
    // const deletebtnDiv = document.createElement("div");
    // deletebtnDiv.className = "cart__item__content__settings__delete";
    //-----------------------old version of creating div above-----------------------------

    //create all sub divs and assign class name
    let allVariablesNames = [
      "imgDiv",
      "allDetailsDiv",
      "nameColorPriceDiv",
      "quantityDeletebtnDiv",
      "quantityInputDiv",
      "deletebtnDiv",
    ];

    let allDivClassName = [
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
      if (quantityInput.value <= 0 || quantityInput.value > 100) {
        return;
      }
      //modify quantity according input value
      let quantityDifference = quantityInput.value - i.quantity;
      totalQuantity += quantityDifference;
      i.quantity = quantityInput.value;
      //change LS each quantity and total quantity display
      localStorage.setItem("products", JSON.stringify(productArr));
      totalQuantityElement.textContent = totalQuantity;

      //modify price
      //create new price, compare with old price, change old price to new, and modify total price
      const newPrice =
        data.find((obj) => obj._id == i._id).price * quantityInput.value;
      let priceDifference = newPrice - unformattedPrice;
      totalPrice += priceDifference;
      unformattedPrice = newPrice;
      price.textContent = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(newPrice);
      totalPriceElement.textContent = totalPrice + ",00";
    });

    //delete button
    const deleteBtn = document.createElement("p");
    deleteBtn.className = "deleteItem";
    deleteBtn.textContent = "Supprimer";
    deletebtnDiv.appendChild(deleteBtn);

    //add event listener to delete button
    //click to delete item from dom, LS and display new total quantity and total price
    deleteBtn.addEventListener("click", () => {
      let index = productArr.indexOf(i);
      productArr.splice(index, 1);
      localStorage.setItem("products", JSON.stringify(productArr));
      cartSection.removeChild(article);
      totalQuantity -= i.quantity;
      totalQuantityElement.textContent = totalQuantity;
      totalPrice -= unformattedPrice;
      totalPriceElement.textContent = totalPrice + ",00";
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

  //DOM total quantity and total price
  const totalQuantityElement = document.querySelector("#totalQuantity");
  totalQuantityElement.textContent = totalQuantity;
  const totalPriceElement = document.querySelector("#totalPrice");
  totalPriceElement.textContent = totalPrice + ",00";
}

//for clients' information, check info and alert of info formet is not correct
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
  //check if the user entered all information
  if (
    productArr.lenght == 0 ||
    !firstName.value ||
    !lastName.value ||
    !address.value ||
    !city.value ||
    !email.value
  ) {
    //if info is not completed,show warning accordingly
    if (!firstName.value) {
      wrongFirstNameMsg.textContent = "Veuillez entrer votre prénom";
    }
    if (!lastName.value) {
      wrongLastNameMsg.textContent = "Veuillez entrer votre nom";
    }
    if (!address.value) {
      wrongAddressMsg.textContent = "Veuillez entrer votre adresse";
    }
    if (!city.value) {
      wrongCityMsg.textContent = "Veuillez entrer votre ville";
    }
    if (!email.value) {
      wrongEmailMsg.textContent = "Veuillez entrer votre email";
    }
  }
  //or if the email formet is not correct, show another warning
  else if (emailPattern.test(email.value) == false) {
    wrongEmailMsg.textContent =
      "L'adresse email est incorrect. Veuillez la modifier";
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
      products,
    };

    console.log(products);
    console.log(order);

    //Prepare post object
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    };

    //get confirmation id from server
    placeOrder();
    async function placeOrder() {
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
  }
});
