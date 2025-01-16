/* ---------------------------- Importing Data ---------------------------- */
import { items } from './itemsData.js';

/* ---------------------- Initializing Variables ---------------------- */
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartContainer = document.getElementById("cart-items-list");
const totalCostElement = document.getElementById("subtotal");
const modal = document.getElementById('checkout-modal');
const productContainer = document.querySelector(".products-container");
const searchBar = document.getElementById("search-bar");

/* ----------------------- Utility Functions ----------------------- */
// Save cart to local storage
function saveToCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Update cart count
function updateCart() {
  const cartElement = document.getElementById("cart-count");
  cartElement.textContent = cart.length;
}

// Calculate and display subtotal
function subTotal() {
  const checkoutTotal = document.getElementById("checkout-total");
  const totalCost = cart.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  totalCostElement.textContent = totalCost.toFixed(2);
  checkoutTotal.textContent = totalCost.toFixed(2);
}

/* ---------------------- Product Display Functions ---------------------- */
// Display products dynamically
function displayProducts(productList) {
  productContainer.innerHTML = "";

  productList.forEach((item) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product");

    const productImg = document.createElement("img");
    productImg.src = item.img;
    productImg.alt = item.title;
    productCard.appendChild(productImg);

    const details = document.createElement("div");
    details.classList.add("details");

    const productTitle = document.createElement("a");
    productTitle.textContent = item.title;
    productTitle.href = "#";
    productTitle.addEventListener("click", (e) => {
      e.preventDefault(); 
      showPopup(item);
    });
    details.appendChild(productTitle);

    const productDetails = document.createElement("p");
    productDetails.textContent = item.description.short;
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
};

function showPopup(product) {
  modal.innerHTML = `
    <div class="modal-content">
    <button id="close-summary" class="close-btn">
        <i class="ri-close-line"></i>
      </button>
      <button id="close-modal" class="close-btn">
        <i class="ri-close-line"></i>
      </button>
      <img src="${product.img}" alt="${product.title}">
      <div class="product-details">
        <h2>${product.title}</h2>
        <p>${product.description.long}</p>
        <p class="price">GHC ${product.price}</p>
        <p class="stars"><i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-half-line"></i></p>
        <div class="btns"><button id="cart-button"><i class="ri-shopping-cart-2-line"></i> Add to Cart</button>
        </div>
      </div>
      </div>
  `;

  modal.classList.remove('hidden');
  modal.classList.add('visible');

  document.getElementById("close-modal").addEventListener("click", () => {
    modal.classList.remove("visible");
    modal.classList.add("hidden");
    location.reload();
  });

  const cartButton = document.getElementById("cart-button");
  cartButton.addEventListener("click", () => {
  addToCart(product.id); 
  saveToCart();
  modal.classList.remove('visible');
  modal.classList.add('hidden');  
  location.reload();
});

updateCart();

};

// Search products
function searchProducts(searchTerm) {
  const filteredProducts = items.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  displayProducts(filteredProducts);
}

/* ---------------------- Cart Management Functions ---------------------- */
// Add product to cart
function addToCart(itemId) {
  const item = items.find((item) => item.id === itemId);
  const itemExists = cart.find((cartItem) => cartItem.id === itemId);

  if (itemExists) {
    showToast(`${item.title} is already added to cart`);
    itemExists.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
    showToast(`${item.title} added successfully to cart`);
    saveToCart();
  }

  updateCart();
}

// Render cart items
function renderCart() {
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <p class="empty-cart-message">Your cart is currently empty. Start adding items!</p>
    `;
    subTotal();
    return;
  }

  cart.forEach((product, index) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("products");
    productDiv.innerHTML = `
      <span>${product.title} - GHC ${product.price} </span>
      <span>QTY ${product.quantity}</span>
      <div class="buttons">
        <button class="add-btn">+</button>
        <button class="subtract-btn">-</button>
        <button class="delete-btn" data-id="${product.id}">
          <i class="ri-delete-bin-6-line"></i>
        </button>
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
  subTotal();
}

// Update quantity of items in cart
function updateQuantity(index, action) {
  const product = cart[index];
  if (action === "add") {
    product.quantity += 1;
  } else if (action === "subtract" && product.quantity > 1) {
    product.quantity -= 1;
  }
  saveToCart();
  renderCart();
}

/* ---------------------- Checkout Functions ---------------------- */
// Show order summary
function orderSummary() {
  const totalItems = cart.reduce((sum, product) => sum + product.quantity, 0);
  const totalCost = cart.reduce((sum, product) => sum + product.price * product.quantity, 0);

  modal.innerHTML = `
    <form class="order-summary">
      <button id="close-summary" class="close-btn">
        <i class="ri-close-line"></i>
      </button>
      <h3>Order Summary</h3>
      <p>Total Items: ${totalItems}</p>
      <p>Total Cost: GHC ${totalCost.toFixed(2)}</p>
      <p>Tax (10%): GHC ${(totalCost * 0.10).toFixed(2)}</p>
      <p><strong>Grand Total: GHC ${(totalCost * 1.10).toFixed(2)}</strong></p>

      <p>Please Select Payment Method</p>
      <div>
        <input type="radio" id="mobile-money" name="payment-method" value="Mobile Money" required>
        <label for="mobile-money">Mobile Money</label>
      </div>
      <div>
        <input type="radio" id="credit-card" name="payment-method" value="Credit Card">
        <label for="credit-card">Credit Card</label>
      </div>
      <div>
        <input type="radio" id="cash" name="payment-method" value="Cash">
        <label for="cash">Cash</label>
      </div>

      <button type="submit" id="confirm-checkout" class="checkout-btn">Confirm and Pay</button>
    </form>
  `;

  modal.classList.remove('hidden');
  modal.classList.add('visible');

  document.getElementById("close-summary").addEventListener("click", () => {
    modal.classList.remove('visible');
    modal.classList.add('hidden');
    location.reload();
  });

  const form = document.querySelector(".order-summary");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;

    const cartElement = document.getElementById("cart-count");
    cart.length = 0;
    cartElement.textContent = cart.length;
    alert(`Payment method selected: ${paymentMethod}\nProceeding to payment...`);
    modal.classList.remove('visible');
    modal.classList.add('hidden');
    saveToCart();
    
  });
}


/* ---------------------- Event Listeners ---------------------- */
document.addEventListener("DOMContentLoaded", () => {
  displayProducts(items);
  updateCart();
});

searchBar.addEventListener("input", (e) => {
  const searchTerm = e.target.value;
  searchProducts(searchTerm);
});

document.getElementById("cart-btn").addEventListener("click", () => {
  if (cart.length === 0) {
    showToast('Your cart is empty!');
  } else {
    renderCart();
  }
});

document.getElementById('checkout-btn').addEventListener("click", () => {
  if (cart.length === 0) {
    showToast('Your cart is empty!');
  } else {
    orderSummary();
  }
});

document.getElementById('close-modal').addEventListener("click", () => {
  modal.classList.remove('visible');
  modal.classList.add('hidden');
});

/* ---------------------------- Toast Notification ---------------------------- */
// Show toast notification
function showToast(message) {
  const toastContainer = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.textContent = message;

  toastContainer.appendChild(toast);

  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.remove();
  }, 3000);
}
