//load page according product id
let url = new URL(document.location).searchParams;
let id = url.get("id");

//fetch selected id's product
async function getProduct() {
  try {
    const response = await fetch(`http://localhost:3000/api/products/${id}`);
    const data = await response.json();
    console.log(data);
    displayProduct(data);
  } catch (e) {
    console.log(e);
  }
}
getProduct();

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
