// JavaScript code for eCommerce functionalities

import { items } from './itemsData.js';

// Toggle navigation menu
const menuBtn = document.getElementById("menu-line");
const navLinks = document.getElementById("ul-links");
const menuBtnIcon = menuBtn.querySelector("i");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  const isOpen = navLinks.classList.contains("open");
  menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
});

// Close menu on link click
document.querySelectorAll(".nav-links li a").forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 768) {
      navLinks.classList.remove("open");
      menuBtnIcon.setAttribute("class", "ri-menu-line");
    };
  });
});


// Update footer year automatically
document.getElementById('footer-year').textContent = new Date().getFullYear();

// Toggle additional bio information
function toggleBio() {
  const extraBio = document.getElementById("extra-bio");
  const button = document.getElementById("show-more-btn");

  if (extraBio.classList.contains("hidden")) {
    extraBio.classList.remove("hidden");
    button.textContent = "Read Less"; 
  } else {
    extraBio.classList.add("hidden");
    button.textContent = "Read More"; 
  };
};

// Toggle additional company information
function toggleCompanyInfo() {
  const extraInfo = document.getElementById("extra-company-info");
  const button = document.getElementById("show-more-company-btn");

  if (extraInfo.classList.contains("hidden")) {
    extraInfo.classList.remove("hidden");
    button.textContent = "Read Less"; 
  } else {
    extraInfo.classList.add("hidden");
    button.textContent = "Read More"; 
  };
};

// Flash Sales Countdown Timer
function startFlashSalesTimer(endTime) {
  const timeLeftElement = document.getElementById("time-left");

  function updateTimer() {
    const now = new Date().getTime();
    const timeRemaining = endTime - now;

    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      timeLeftElement.textContent = "Sale Ended!";
      return;
    };

    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    timeLeftElement.innerText = `${days}d : ${hours}h : ${minutes}m : ${seconds}s`;
  };

  const timerInterval = setInterval(updateTimer, 1000);
  updateTimer(); 
};

const flashSaleEndTime = new Date().getTime() + 15 * 24 * 60 * 60 * 1000; 
startFlashSalesTimer(flashSaleEndTime);


const products = [
  { id: 10, title: "Nivea Men Invisible Roll On", price: 20,
    description: {
      short: "Nivea Men Invisible Roll On offers 48-hour sweat and...",
      long: "Nivea Men Invisible Roll On is the ultimate solution for men who want effective sweat and odor protection while keeping their clothes spotless.",
    }, img: "Images/Nivea Men Invisible Black & White Roll On 50 ml - Deodorant hos Luxplus.jpeg",  quantity: 0 },
  {id: 11, title: "St. Ives Smoothing", price: 30, description: {
    short: "St. Ives Smoothing exfoliates and nourishes your skin...",
    long: "St. Ives Smoothing is a skincare essential designed to exfoliate away dull, dry skin while nourishing it for a healthy, radiant glow.",
  }, img: "Images/These Skincare Products Are the Next Best Thing To Injectables, According To a Professional (1).jpeg", quantity: 0, },
  {id: 12, title: "Valentino Born in Roma Uomo", price: 29, description: {
    short: "Valentino Born in Roma Uomo is a bold and sophisticated...",
    long: "Valentino Born in Roma Uomo is an elegant and modern fragrance that captures the essence of the city of Rome with its vibrant, yet refined composition.",
  }, img: "Images/Brand New & Sealed Valentino Born in Roma Uomo Eau de Toilette for Men 150ml  _ eBay.jpeg", quantity: 0 },
  {id: 13, title: "Dr Organic Manuka Honey Body", price: 15, description: {
    short: "Dr Organic Manuka Honey Body Wash gently cleanses...",
    long: "Dr Organic Manuka Honey Body Wash is a luxurious, nourishing cleanser that combines the power of organic Manuka honey with natural botanical ingredients.",
  }, img: "Images/Dr Organic Manuka Honey Body Wash 250ml.jpeg", quantity: 0 },
  {id: 14, title: "Les 9 Perfume", price: 35, description: {
    short: "Les 9 Perfume is a sophisticated and captivating...",
    long: "Les 9 Perfume is an exquisite fragrance designed to make a bold statement. This complex and enchanting scent features a harmonious blend of floral notes, fresh fruits, and warm woods.",
  }, img: "Images/Les 9 parfums homme incontournables de l'été.jpeg", quantity: 0 },
  {id: 15, title: "Dove Pampering Body Wash", price: 25, description: {
    short: "Dove Pampering Body Wash nourishes and pampers your...",
    long: "Dove Pampering Body Wash is designed to provide your skin with the ultimate pampering experience. Its rich, creamy formula gently cleanses while delivering intense moisture.",
  },img: "Images/Dove Pampering Body Wash Shea Butter With Warm Vanilla 500ml.jpeg", quantity: 0 },
];

// Display products dynamically
function renderProducts(products) {
  const productsContainer = document.querySelector(".flash-products");

  productsContainer.innerHTML = "";

  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product");
    productCard.setAttribute("role", "group");
    productCard.setAttribute("aria-labelledby", `product-title-${product.id}`);
    const productImg = document.createElement("img");
    productImg.src = product.img;
    productImg.alt = product.title;
    productImg.setAttribute("aria-hidden", "true");
    productCard.appendChild(productImg);

    const details = document.createElement("div");
    details.classList.add("details");

    const productTitle = document.createElement("a");
    productTitle.title = `View details for ${product.title}`;
    productTitle.textContent = product.title;
    productTitle.href = "#";
    productTitle.id = `product-title-${product.id}`;
    productTitle.setAttribute("aria-label", `View details for ${product.title}`);
    productTitle.addEventListener("click", (e) => {
      e.preventDefault(); 
      showPopup(product); 
    });
    details.appendChild(productTitle);

    const productDetails = document.createElement("p");
    productDetails.textContent = product.description.short;
    details.appendChild(productDetails);

    const productPrice = document.createElement("p");
    productPrice.classList.add("price");
    productPrice.textContent = `GHC ${product.price}`;
    details.appendChild(productPrice);

    const productButton = document.createElement("button");
    productButton.innerHTML = `<i class="ri-shopping-cart-2-line" aria-hidden="true"></i> Add to Cart`;
    productButton.setAttribute("aria-label", `Add ${product.title} to cart`);
    productButton.addEventListener("click", () => {
      addToCart(product.id);
    });

    details.appendChild(productButton);
    productCard.appendChild(details);
    productsContainer.appendChild(productCard);
  });
};

/* ---------------------- Cart Management ---------------------- */
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const modal = document.getElementById('checkout-modal');

// Save cart to local storage
function saveToCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// Update cart icon with item count
function updateCart() {
  const cartElement = document.getElementById("cart-count");
  cartElement.textContent = cart.length;
};

// Calculate and display subtotal
function subTotal() {
  const totalCostElement = document.getElementById("subtotal");
  const checkoutTotal = document.getElementById("checkout-total");
  const totalCost = cart.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  totalCostElement.textContent = totalCost.toFixed(2);
  checkoutTotal.textContent = totalCost.toFixed(2);
};


// Display products dynamically

function displayProducts(productList) {
  const productContainer = document.querySelector(".products-container");

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
    productTitle.title = `View details for ${item.title}`;
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
};

// Function to show the popup
function showPopup(product) {
  const modal = document.getElementById("checkout-modal");
  modal.innerHTML = `
    <div class="modal-content-box" role="dialog" aria-labelledby="modal-title" aria-describedby="modal-description">
      <img src="${product.img}" alt="${product.title}">
      <div class="product-details">
        <h2 id="modal-title">${product.title}</h2>
        <div class="details">
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
    </div>
  `;

  modal.classList.remove("hidden");
  modal.classList.add("visible");

  const cartButton = document.getElementById("cart-button");
  cartButton.addEventListener("click", () => {
    addToCart(product.id);
    renderCart();
    updateCart();
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.remove('visible');
      modal.classList.add('hidden');
      location.reload();
    };
  });

};

// Add product to cart
function addToCart(itemId) {
  
  const item = products.find((item) => item.id === itemId) || items.find((item) => item.id === itemId);

  if (!item) {
    console.error("Item not found:", itemId);
    return;
  };

  
  const itemExists = cart.find((cartItem) => cartItem.id === itemId);

  if (itemExists) {
    itemExists.quantity += 1;
    showToast(`${item.title} quantity increased in cart`);
  } else {
    cart.push({ ...item, quantity: 1 });
    showToast(`${item.title} added successfully to cart`);
  };

  saveToCart();
  updateCart();
  renderCart();
  subTotal();
  };

// Render cart items
function renderCart() {
  const cartContainer = document.getElementById("cart-items-list");

  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    showToast("Your cart is empty!");
    
    return;
  };

  cart.forEach((product, index) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("products");
    productDiv.setAttribute("role", "listitem");
    productDiv.innerHTML = `
      <span>${product.title} - GHC ${product.price} </span>
      <span>QTY ${product.quantity}</span>
      <div class="buttons">
        <button id="cart-btn" class="subtract-btn" aria-label="Decrease quantity of ${product.title}">-</button>
        <button id="cart-btn" class="add-btn" aria-label="Increase quantity of ${product.title}">+</button>
        <button id="cart-btn" class="delete-btn" data-id="${product.id}" aria-label="Remove ${product.title} from cart">
          <i class="ri-delete-bin-6-line" aria-hidden="true"></i>
        </button>
      </div>
    `;

    productDiv.querySelector(".add-btn").addEventListener("click", () => {
      updateQuantity(index, "add");

    });

    productDiv.querySelector(".subtract-btn").addEventListener("click", () => {
      updateQuantity(index, "subtract");
      updateOrderSummary();
    });

    productDiv.querySelector(".delete-btn").addEventListener("click", () => {
      cart.splice(index, 1);
      updateCart();
      saveToCart();
      renderCart();
    
    });;

    cartContainer.appendChild(productDiv);
  });

  modal.classList.remove("hidden");
  modal.classList.add("visible");
  subTotal();  
  
  document.addEventListener("click", clickToClose);
};


function clickToClose(event) {
  
  const modalContent = document.querySelector(".modal-content"); 

  if (!modalContent.contains(event.target) && !event.target.closest("#cart-btn")) {
    modal.classList.remove("visible");
    modal.classList.add("hidden");
  };
};


// Update quantity of items in cart
function updateQuantity(index, action) {
  const product = cart[index];
  if (action === "add") {
    product.quantity += 1;
  } else if (action === "subtract" && product.quantity > 1) {
    product.quantity -= 1;
  };
  saveToCart();
  renderCart();
};


/* ---------------------- Checkout Functions ---------------------- */


// Show order summary
function updateOrderSummary() {
  const totalItems = cart.reduce((sum, product) => sum + product.quantity, 0);
  const totalCost = cart.reduce((sum, product) => sum + product.price * product.quantity, 0);
  const tax = (totalCost * 0.10).toFixed(2);
  const grandTotal = (totalCost * 1.10).toFixed(2);

  // Save data to localStorage for use on the Order Summary page
  localStorage.setItem('totalItems', totalItems);
  localStorage.setItem('totalCost', totalCost.toFixed(2));
  localStorage.setItem('tax', tax);
  localStorage.setItem('grandTotal', grandTotal);
};

// Show order summary
function orderSummary() {
  updateOrderSummary(); // Update before navigation
  window.location.href = 'OrderSum.html';
};

// Display order summary data on OrderSum.html
if (window.location.pathname.includes('OrderSum.html')) {
  document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("total-items").innerText = localStorage.getItem("totalItems") || 0;
  document.getElementById("total-cost").textContent = localStorage.getItem("totalCost") || "0.00";
  document.getElementById("tax").textContent = localStorage.getItem("tax") || "0.00";
  document.getElementById("grand-total").textContent = localStorage.getItem("grandTotal") || "0.00";

  document.getElementById("confirm-checkout").addEventListener("click", (event) => 
    { event.preventDefault();
    const addressLine1 = document.getElementById("address-line1").value;
    const city = document.getElementById("city").value;
    const postalCode = document.getElementById("postal-code").value;
    const paymentMethod = document.getElementById("payment-method").value;
    const deliveryDate = document.getElementById("delivery-date").value;
    const deliveryTime = document.getElementById("delivery-time").value;

    if (!addressLine1 || !city || !postalCode || !paymentMethod || !deliveryDate || !deliveryTime) {
      alert("Please fill in all the required fields.");
      return;
    };

    // Clear the cart after successful checkout
    localStorage.removeItem('cart');
    cart = [];

    alert(`Order placed successfully!\nShipping Address: ${addressLine1}, ${city}, ${postalCode}\nPayment Method: ${paymentMethod}\nDelivery: ${deliveryDate} at ${deliveryTime}`);
    updateOrderSummary();
    
  });
});
};

/* ---------------------- Event Listeners ---------------------- */
 // Form Validation
function validateForm() {
  const email = document.getElementById("email").value;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex

  if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      return false; // Prevent form submission
  };
  return true; // Allow form submission
};

document.addEventListener("DOMContentLoaded", () => {
  displayProducts(items);
  renderProducts(products);
  updateCart();
  subTotal();
});

document.getElementById("show-more-btn").addEventListener("click", toggleBio);
document.getElementById("show-more-company-btn").addEventListener("click", toggleCompanyInfo);


const searchBar = document.getElementById("search-bar");
const searchBtn = document.getElementById("search-btn");
const productsContainer = document.querySelector(".products-container");
const flashProducts = document.querySelector(".flash-products");

// Function to search within products
function searchProducts() {
  const query = searchBar.value.toLowerCase().trim();

  if (query === "") {
    displayProducts(items);
    renderProducts(products);
    updateCart();
    return;
  };

  let found = false; 

  // Get all product items in both containers
  const allProducts = [...productsContainer.children, ...flashProducts.children];

  allProducts.forEach((product) => {
    const titleElement = product.querySelector("p, h3, h2, .product-title"); 
    const title = titleElement ? titleElement.textContent.toLowerCase() : "";

    if (title.includes(query)) {
      product.style.display = "grid"; 
      found = true;
    } else {
      product.style.display = "none";
    };
  });

  // Show "No products found" if no match
  if (!found) {
    productsContainer.innerHTML = `<p>No products found.</p>`;
    flashProducts.innerHTML = "";
  };
};

// Event Listeners
searchBtn.addEventListener("click", searchProducts);
searchBar.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    searchProducts();
  };
});

searchBar.addEventListener("input", function () {
  if (searchBar.value.trim() === "") {
    searchProducts();
  };
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
};



