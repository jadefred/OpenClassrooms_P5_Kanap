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
const headTitle = document.querySelector("title");
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
  headTitle.textContent = data.name;
  img.src = data.imageUrl;
  img.alt = data.altTxt;
  title.textContent = data.name;
  price.textContent = data.price;
  description.textContent = data.description;
}

//DOM - for click event and local storage
const btn = document.querySelector("#addToCart");
const quantity = document.querySelector("#quantity");
let productArr = [];
let selectedProduct = {};

//check if local storage is empty, if not, add existing stored items to productArr
function checkLocalStorage() {
  if (localStorage.getItem("products") !== null) {
    productArr = JSON.parse(localStorage.getItem("products"));
  }
}
checkLocalStorage();

//click to add selected product to productArr
btn.addEventListener("click", () => {
  //check if the input correct
  if (colors.value !== "" && quantity.value > 0 && quantity.value <= 100) {
    selectedProduct = {
      _id: id,
      quantity: quantity.value,
      color: colors.value,
    };
    removeDuplicatedProducts();
    localStorage.setItem("products", JSON.stringify(productArr));
  }
});

//fucntion to check productArr
function removeDuplicatedProducts() {
  //1. if productArr.length = 0, add selected product directly
  if (productArr.length == 0) {
    productArr.push(selectedProduct);
  }
  //2. if productArr has same id and color product than selected product, change the quantity from productArr only
  else if (
    productArr.some((i) => (i._id == selectedProduct._id && i.color == selectedProduct.color))
  ) {
    for (const i of productArr) {
      if (i._id == selectedProduct._id && i.color == selectedProduct.color) {
        let num = parseInt(i.quantity) + parseInt(selectedProduct.quantity);
        i.quantity = num.toString();
      }
    }
  }
  //3. if prodoctArr.length > 0 but no duplicated product, add selected product directly
  else {
    productArr.push(selectedProduct);
  }
}
