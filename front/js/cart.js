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

//DOM and variables
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

    //create divs
    const imgDiv = document.createElement("div");
    imgDiv.className = "cart__item__img";
    const allDetailsDiv = document.createElement("div");
    allDetailsDiv.className = "cart__item__content";
    const nameColorPriceDiv = document.createElement("div");
    nameColorPriceDiv.className = "cart__item__content__description";
    const quantityDeletebtnDiv = document.createElement("div");
    quantityDeletebtnDiv.className = "cart__item__content__settings";
    const quantityInputDiv = document.createElement("div");
    quantityInputDiv.className = "cart__item__content__settings__quantity";
    const deletebtnDiv = document.createElement("div");
    deletebtnDiv.className = "cart__item__content__settings__delete";

    //create image
    const img = document.createElement("img");
    img.src = data.find((obj) => obj._id == i._id).imageUrl;
    img.alt = data.find((obj) => obj._id == i._id).altTxt;
    imgDiv.appendChild(img);

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
