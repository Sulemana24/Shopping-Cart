import { items } from './itemsData.js';

let cart = JSON.parse(localStorage.getItem("cart")) || [];


const cartContainer = document.getElementById("cart-items-list");
const totalCostElement = document.getElementById("total-cost");
const modal = document.getElementById('checkout-modal');

document.addEventListener("DOMContentLoaded", () => {
  const productContainer = document.querySelector(".products-container");

  items.forEach((item) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product");

    const productImg = document.createElement("img");
    productImg.src = item.img;
    productImg.alt = item.title;
    productCard.appendChild(productImg);

    const details = document.createElement("div");
    details.classList.add("details");

    const productTitle = document.createElement("a");
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

function saveToCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
};

function updateCart() {
  const cartElement = document.getElementById("cart-count");
  cartElement.textContent = cart.length;
};

function addToCart(itemId) {
  const item = items.find((item) => item.id === itemId);
  const itemExists = cart.find((cartItem) => cartItem.id === itemId);
  if (itemExists) {
    itemExists.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
    alert(`${item.title} added successfully to cart`);
  } 
  
  updateCart();
};

function totalCost() {
  const totalCost = cart.reduce((sum, product) => sum + product.price * product.quantity, 0);
  totalCostElement.textContent = totalCost.toFixed(2);

};



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

function updateQuantity(index, action) {
  const product = cart[index];
  if (action === "add") {
    product.quantity = isNaN(product.quantity) ? 1 : product.quantity + 1;
  } else if (action === "subtract" && product.quantity > 0) {
    product.quantity = isNaN(product.quantity) ? 0 : product.quantity - 1;
  }
  
  if (product.quantity === 0) {
    cart.splice(index, 1);
  }
  saveToCart();
  renderCart();
}



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


