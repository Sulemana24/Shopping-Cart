/* Importing data from itemsData file */
import { items } from './itemsData.js';

/* getting a cart items array from local storage or declaring an empty array*/
let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* getting html elements */
const cartContainer = document.getElementById("cart-items-list");
const totalCostElement = document.getElementById("total-cost");
const modal = document.getElementById('checkout-modal');
const productContainer = document.querySelector(".products-container");

/* function to dynamically display products when document finished loading */
document.addEventListener("DOMContentLoaded", () => {
  items.forEach((item) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product");
    const productImg = document.createElement("img");
    productImg.src = item.img;
    productImg.alt = item.title;
    productCard.appendChild(productImg);

    const details = document.createElement("div");
    details.classList.add("details");

    const productTitle = document.createElement("h3");
    productTitle.href = "#";
    productTitle.textContent = item.title;
    details.appendChild(productTitle);

    const productDetails = document.createElement("p");
    productDetails.textContent = item.description;
    details.appendChild(productDetails);

    const productPrice = document.createElement("p");
    productPrice.classList.add("price");
    productPrice.textContent = `GHC ${item.price}`;
    details.appendChild(productPrice);

    const productButton = document.createElement("button");
    productButton.innerHTML = `<i class="ri-shopping-cart-2-line"></i> Add to Cart`;
    productButton.addEventListener("click", () => {
      addToCart(item.id);
    });
    
    details.appendChild(productButton);

    productCard.appendChild(details);
    productContainer.appendChild(productCard);
  });

  updateCart();

});
/* function to save cart items to the local storage */
function saveToCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
};

/* updating the cart count */
function updateCart() {
  const cartElement = document.getElementById("cart-count");
  cartElement.textContent = cart.length;
};

/* adding products to cart */
function addToCart(itemId) {
  const item = items.find((item) => item.id === itemId);
  const itemExists = cart.find((cartItem) => cartItem.id === itemId);
  if (itemExists) {
    alert(`${item.title} is already added to cart`);
  } else {
    cart.push({ ...item, quantity: 1 });
    alert(`${item.title} added successfully to cart`);
    saveToCart();
  } 
  
  updateCart();
};

/* calculating the total items in the cart */
function totalCost() {
  const totalCost = cart.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  totalCostElement.textContent = totalCost.toFixed(2);

};

/* appending cart items to the pop modal box */
function renderCart() {
  cartContainer.innerHTML = "";
  cart.forEach((product, index) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("products");
    productDiv.innerHTML = `
    <span>${product.title} - GHC ${product.price} </span>
    <span>QTY ${product.quantity}</span>
    <div class= "buttons">
    <button class="add-btn">+</button>
    <button class="subtract-btn">-</button>
    <button class="delete-btn" data-id="${product.id}"><i class="ri-delete-bin-6-line"></i></button>
    </div>
    `;

    productDiv.querySelector(".add-btn").addEventListener("click", () => updateQuantity(index, "add"));
    productDiv.querySelector(".subtract-btn").addEventListener("click", () => updateQuantity(index, "subtract"));
    productDiv.querySelector(".delete-btn").addEventListener("click", () => {
      cart.splice(index, 1);
      updateCart();
      saveToCart();
      renderCart();
      
    });

    cartContainer.appendChild(productDiv);
    
  });

  modal.classList.remove('hidden');
  modal.classList.add('visible');
  totalCost();
  
};

/* updating the quantity of items in the cart */
function updateQuantity(index, action) {
  const product = cart[index];
  if (action === "add") {
    product.quantity = isNaN(product.quantity) ? 0 : ((product.quantity) + 1);
  } else if (action === "subtract" && product.quantity > 1) {
    product.quantity = isNaN(product.quantity) ? 0 : ((product.quantity) - 1);
  }
  saveToCart();
  renderCart();
}


/* event listener on the checkout button */
document.getElementById('checkout-btn').addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  renderCart();
});

document.getElementById('close-modal').addEventListener('click', () => {
  modal.classList.remove('visible');
  modal.classList.add('hidden');
});


