import { items } from './itemsData.js';

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
      alert(`${product.name} added to cart!`);
    });
    details.appendChild(productButton);

    productCard.appendChild(details);
    productContainer.appendChild(productCard);
  });

});


