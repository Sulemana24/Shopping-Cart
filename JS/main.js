/* ---------------------------- Importing Data ---------------------------- */
import { items } from './itemsData.js';

/* ---------------------- Initializing Variables ---------------------- */
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartContainer = document.getElementById("cart-items-list");
const totalCostElement = document.getElementById("subtotal");
const modal = document.getElementById('checkout-modal');
const productContainer = document.querySelector(".products-container");

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
    productCard.setAttribute("role", "group");
    productCard.setAttribute("aria-labelledby", `product-title-${item.id}`);

    const productImg = document.createElement("img");
    productImg.src = item.img;
    productImg.alt = item.title;
    productImg.setAttribute("aria-hidden", "true");
    productCard.appendChild(productImg);

    const details = document.createElement("div");
    details.classList.add("details");

    const productTitle = document.createElement("a");
    productTitle.textContent = item.title;
    productTitle.href = "#";
    productTitle.id = `product-title-${item.id}`;
    productTitle.setAttribute("aria-label", `View details for ${item.title}`);
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
    productButton.innerHTML = `<i class="ri-shopping-cart-2-line" aria-hidden="true"></i> Add to Cart`;
    productButton.setAttribute("aria-label", `Add ${item.title} to cart`);
    productButton.addEventListener("click", () => {
      addToCart(item.id);
    });

    details.appendChild(productButton);
    productCard.appendChild(details);
    productContainer.appendChild(productCard);
  });
}

// Function to show the popup
function showPopup(product) {
  modal.innerHTML = `
    <div class="modal-content" role="dialog" aria-labelledby="modal-title" aria-describedby="modal-description">
      <button id="close-modal" class="close-btn" aria-label="Close product details">
        <i class="ri-close-line" aria-hidden="true"></i>
      </button>
      <img src="${product.img}" alt="${product.title}">
      <div class="product-details">
        <h2 id="modal-title">${product.title}</h2>
        <p id="modal-description">${product.description.long}</p>
        <p class="price">GHC ${product.price}</p>
        <p class="stars" aria-label="Product rating: 4.5 out of 5 stars">
          <i class="ri-star-fill" aria-hidden="true"></i><i class="ri-star-fill" aria-hidden="true"></i>
          <i class="ri-star-fill" aria-hidden="true"></i><i class="ri-star-fill" aria-hidden="true"></i>
          <i class="ri-star-half-line" aria-hidden="true"></i>
        </p>
        <button id="cart-button" class="btns" aria-label="Add ${product.title} to cart">
          <i class="ri-shopping-cart-2-line" aria-hidden="true"></i> Add to Cart
        </button>
      </div>
    </div>
  `;

  modal.classList.remove("hidden");
  modal.classList.add("visible");

  document.getElementById("close-modal").addEventListener("click", () => {
    modal.classList.remove("visible");
    modal.classList.add("hidden");
  });

  const cartButton = document.getElementById("cart-button");
  cartButton.addEventListener("click", () => {
    addToCart(product.id);
    modal.classList.remove("visible");
    modal.classList.add("hidden");
    renderCart();
    updateCart();
  });
};

// Search products
function searchProducts(searchTerm) {
  const trimmedSearchTerm = searchTerm.trim();

  const filteredProducts = trimmedSearchTerm
    ? items.filter((item) =>
        item.title.toLowerCase().includes(trimmedSearchTerm.toLowerCase())
      )
    : items;
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
    showToast("Your cart is empty!");
    return;
  }
  cart.forEach((product, index) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("products");
    productDiv.setAttribute("role", "listitem");
    productDiv.innerHTML = `
      <span>${product.title} - GHC ${product.price} </span>
      <span>QTY ${product.quantity}</span>
      <div class="buttons">
        <button class="subtract-btn" aria-label="Decrease quantity of ${product.title}">-</button>
        <button class="add-btn" aria-label="Increase quantity of ${product.title}">+</button>
        <button class="delete-btn" data-id="${product.id}" aria-label="Remove ${product.title} from cart">
          <i class="ri-delete-bin-6-line" aria-hidden="true"></i>
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

  document.addEventListener("click", clickToClose);
}

function clickToClose(event) {
  const modalContent = document.querySelector(".modal-content");
  if (!modalContent.contains(event.target) && !event.target.closest("#cart-btn")) {
    modal.classList.remove("visible");
    modal.classList.add("hidden");
    document.removeEventListener("click", handleOutsideClick);
  }
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
  cartContainer.innerHTML = "";
  const totalItems = cart.reduce((sum, product) => sum + product.quantity, 0);
  const totalCost = cart.reduce((sum, product) => sum + product.price * product.quantity, 0);

  modal.innerHTML = `
    <div class="order-summary" role="dialog" aria-labelledby="summary-title">
      <button id="close-summary" class="close-btn" aria-label="Close order summary">
        <i class="ri-close-line" aria-hidden="true"></i>
      </button>
      <h3 id="summary-title">Order Summary</h3>
      <p>Total Items: ${totalItems}</p>
      <p>Total Cost: GHC ${totalCost.toFixed(2)}</p>
      <p>Tax (10%): GHC ${(totalCost * 0.10).toFixed(2)}</p>
      <p><strong>Grand Total: GHC ${(totalCost * 1.10).toFixed(2)}</strong></p>
      <button id="confirm-checkout" class="checkout-btn" aria-label="Proceed to payment">Proceed to Payment</button>
    </div>
  `;

  modal.classList.remove('hidden');
  modal.classList.add('visible');

  document.getElementById("close-summary").addEventListener("click", () => {
    modal.classList.remove('visible');
    modal.classList.add('hidden');
    location.reload();
  });

  document.getElementById("confirm-checkout").addEventListener("click", () => {
    showToast("Proceeding to payment...");
    cart = []; 
    saveToCart();
    updateCart();
    modal.classList.remove('visible');
    modal.classList.add('hidden');
    alert("Proceeding to payment...");
    location.reload();
  });
}

/* ---------------------- Event Listeners ---------------------- */
document.addEventListener("DOMContentLoaded", () => {
  displayProducts(items);
  updateCart();
});

const searchBar = document.getElementById("search-bar");
const clearButton = document.getElementById("clear-btn");

clearButton.addEventListener("click", () => {
  searchBar.value = ""; 
  searchProducts(""); 
});

searchBar.addEventListener("input", (e) => {
  const searchTerm = e.target.value;
  if (searchTerm) {
    clearButton.style.display = "inline";
  } else {
    clearButton.style.display = "none"; 
  }
});

document.getElementById("cart-btn").addEventListener("click", renderCart);

document.getElementById('checkout-btn').addEventListener("click", () => {
  if (cart.length === 0) {
    showToast('Your cart is empty!');
  } else {
    orderSummary();
  }
});

/* ---------------------- Event Listeners ---------------------- */
document.addEventListener("DOMContentLoaded", () => {
  displayProducts(items);
  updateCart();
});

searchBar.addEventListener("input", (e) => {
  const searchTerm = e.target.value;
  searchProducts(searchTerm);
});

document.getElementById("cart-btn").addEventListener("click", renderCart);

document.getElementById('checkout-btn').addEventListener("click", () => {
  if (cart.length === 0) {
    showToast('Your cart is empty!');
  } else {
    orderSummary();
  }
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

