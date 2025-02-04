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

 // Form Validation
function validateForm() {
  const email = document.getElementById("email").value;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

  if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      return false; 
  };
  return true; 
};

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
    updateOrderSummary(); 
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
      const region = document.getElementById("region").value;
      const paymentMethod = document.getElementById("payment-method").value;
      const deliveryDate = document.getElementById("delivery-date").value;
  
      if (!addressLine1 || !city || !region || !paymentMethod || !deliveryDate) {
        alert("Please fill in all the required fields.");
        return;
      };
  
      // Clear the cart after successful checkout
      localStorage.removeItem('cart');
      cart = [];
  
      alert(`Order placed successfully!\nShipping Address: ${addressLine1}, ${city}, ${region}\nPayment Method: ${paymentMethod}\nDelivery: ${deliveryDate}`);
      updateOrderSummary();
      window.location.href = 'index.html';
    });
  });
  };
  
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