//load page according product id
let url = new URL(document.location).searchParams;
let id = url.get("id");

//fetch selected id's product
async function getProduct() {
  try {
    const response = await fetch(`http://localhost:3000/api/products/${id}`);
    const data = await response.json();
    displayProduct(data);
  } catch (e) {
    console.log(e);
  }
}
getProduct();

//Display product's information
//DOM
const itemImg = document.querySelector(".item__img");
const title = document.querySelector("#title");
const price = document.querySelector("#price");
const description = document.querySelector("#description");
const colors = document.querySelector("#colors");

function displayProduct(data) {
  //create img element and append child
  const img = document.createElement("img");
  itemImg.appendChild(img);

  //loop through colors' array, create element and assign values
  for (const i of data.colors) {
    const option = document.createElement("option");
    option.textContent = i;
    option.value = i;
    colors.appendChild(option);
  }

  //assign product
  img.src = data.imageUrl;
  img.alt = data.altTxt;
  title.textContent = data.name;
  price.textContent = data.price;
  description.textContent = data.description;
}

//Click to save selected value
const btn = document.querySelector("#addToCart");
const quantity = document.querySelector("#quantity");
let productArr = [];

btn.addEventListener("click", () => {
  //check if the input  correct
  if (colors.value !== "" && quantity.value > 0 && quantity.value <= 100) {
    //create object for selected value
    const selectedProduct = {
      _id: id,
      quantity: quantity.value,
      color: colors.value,
    };

    //check if local storage is empty, if not, add existing stored items to productArr
    if (localStorage.getItem("products") !== null) {
      productArr = JSON.parse(localStorage.getItem("products"));
    }

    //push newly selected product to productArr, then add to local storage
    productArr.push(selectedProduct);
    localStorage.setItem("products", JSON.stringify(productArr));
  } else {
    return;
  }
});
