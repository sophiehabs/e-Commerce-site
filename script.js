// Inventory JSON data
const inventory = [
  {
    id: 1,
    name: "Traditional Sea Salt",
    image: "img/product1.webp",
    price: 2.99,
    category: "Groceries",
  },
  {
    id: 2,
    name: "Himalayan Salt Lamp",
    image: "img/product2.jpg",
    price: 34.99,
    category: "Health",
    bestselling: true,
  },
  {
    id: 3,
    name: "Dr. Teal's Foaming Bath",
    image: "img/product3.jpg",
    price: 26.99,
    category: "Health",
    trending: true,
  },
  {
    id: 4,
    name: "Salt Egg Massage Stone",
    image: "img/product4.webp",
    price: 24.99,
    category: "Health",
  },
  {
    id: 5,
    name: "Himalayan Salt Block",
    image: "img/product5.jpg",
    price: 121.47,
    category: "Groceries",
    bestselling: true,
  },
  {
    id: 6,
    name: "SLOMIXX® Seasoning",
    image: "img/product6.png",
    price: 9.99,
    category: "Groceries",
  },
  {
    id: 7,
    name: "Sea Salt Hair Spray",
    image: "img/product7.jpg",
    price: 13.24,
    category: "Health",
    trending: true,
  },
  {
    id: 8,
    name: "Human Salt Lick",
    image: "img/product8.jpg",
    price: 25.62,
    category: "Health",
  },
];

// Function to display products
function displayProducts(products) {
  const productsContainer = document.getElementById("products-section");
  productsContainer.innerHTML = "";

  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.className = "product";

    const productImg = document.createElement("img");
    productImg.src = product.image;
    productImg.alt = product.name;

    const productName = document.createElement("h3");
    productName.textContent = product.name;

    const productPrice = document.createElement("p");
    productPrice.textContent = `$${product.price.toFixed(2)}`;

    const buyButton = document.createElement("button");
    buyButton.textContent = "Buy";

    const quantityLabel = document.createElement("label");
    quantityLabel.textContent = "Quantity: ";

    const quantityInput = document.createElement("input");
    quantityInput.type = "number";
    quantityInput.min = "1";
    quantityInput.value = "1";
    quantityInput.className = "quantity-input";

    buyButton.onclick = () => {
      addToCart(product, parseInt(quantityInput.value));
    };

    productDiv.appendChild(productImg);
    productDiv.appendChild(productName);
    productDiv.appendChild(productPrice);
    productDiv.appendChild(quantityLabel);
    productDiv.appendChild(quantityInput);
    productDiv.appendChild(buyButton);

    productsContainer.appendChild(productDiv);
  });
}

// Function to apply the filter
function applyFilter(filter) {
  const filteredProducts = inventory.filter((product) => {
    if (filter === "") return true;
    if (filter === "Bestselling") return product.bestselling;
    if (filter === "Trending") return product.trending;
    return product.category === filter;
  });

  displayProducts(filteredProducts);
}

// Function to navigateAndFilter
function navigateAndFilter(category) {
  applyFilter(category);

  // Update the filter dropdown to match the selected category
  const filterDropdown = document.getElementById("filter-dropdown");
  filterDropdown.value = category;
}

document.addEventListener("DOMContentLoaded", () => {
  // Display all products by default
  applyFilter("");

  // Add event listener to the filter selector
  const filterSelect = document.getElementById("product-filter");
  filterSelect.addEventListener("change", (e) => {
    applyFilter(e.target.value);
  });

  // Initialize the cart item count
  updateCartItemCount();

  // Add event listeners for the cart modal
  const cartIcon = document.querySelector(".right-nav .fa-shopping-cart");
  cartIcon.addEventListener("click", openCartModal);

  const closeModal = document.querySelector(".close-modal");
  closeModal.addEventListener("click", closeCartModal);

  // Add event listener for the Shop Now button
  const shopNowButton = document.querySelector(".shop-now-btn");
  shopNowButton.addEventListener("click", () => {
    const productsSection = document.getElementById("products-section");
    productsSection.scrollIntoView({ behavior: "smooth" });
  });
});

// Function to open the cart modal
function openCartModal() {
  const cartModal = document.getElementById("cart-modal");
  cartModal.style.display = "block";
}

// Function to close the cart modal
function closeCartModal() {
  const cartModal = document.getElementById("cart-modal");
  cartModal.style.display = "none";
}

// Cart object to store the cart items
const cart = new Map();

function addToCart(product, quantity) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Check if the product is already in the cart
  const existingItem = cart.find((item) => item.product.id === product.id);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ product, quantity });
  }

  // Save the updated cart to local storage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Update the cart modal
  displayCart();

  // Update the cart item count
  updateCartItemCount();
}

// Function to update the cart modal
function displayCart() {
  const cartItemsContainer = document.querySelector(".cart-items");
  cartItemsContainer.innerHTML = "";

  let cartTotal = 0;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart.forEach((item) => {
    const product = item.product;
    const quantity = item.quantity;

    // Create cart item elements
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";

    const cartItemName = document.createElement("span");
    cartItemName.textContent = product.name;

    const cartItemQuantity = document.createElement("span");
    cartItemQuantity.textContent = `x${quantity}`;

    const cartItemPrice = document.createElement("span");
    const itemTotalPrice = product.price * quantity;
    cartItemPrice.textContent = `$${itemTotalPrice.toFixed(2)}`;

    // Add the input field for specifying the quantity to be removed
    const removeQuantityInput = document.createElement("input");
    removeQuantityInput.type = "number";
    removeQuantityInput.className = "remove-quantity";
    removeQuantityInput.value = "1";
    removeQuantityInput.min = "1";
    removeQuantityInput.max = quantity;

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.onclick = () => {
      removeFromCart(product.id, parseInt(removeQuantityInput.value));
    };

    // Append cart item elements
    cartItem.appendChild(cartItemName);
    cartItem.appendChild(cartItemQuantity);
    cartItem.appendChild(cartItemPrice);
    cartItem.appendChild(removeQuantityInput);
    cartItem.appendChild(removeButton);
    cartItemsContainer.appendChild(cartItem);

    cartTotal += itemTotalPrice;
  });

  const cartTotalElement = document.querySelector(".cart-total");
  cartTotalElement.textContent = `$${cartTotal.toFixed(2)}`;
}

// Update the removeFromCart function
function removeFromCart(productId, removeQuantity) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const updatedCart = cart.map((item) => {
    if (item.product.id === productId) {
      item.quantity -= removeQuantity;
      if (item.quantity < 1) {
        return null;
      }
    }
    return item;
  }).filter((item) => item !== null);

  localStorage.setItem("cart", JSON.stringify(updatedCart));
  displayCart();

  // Update the cart item count
  updateCartItemCount();
}

function updateCartItemCount() {
  const cartItemCount = document.querySelector(".cart-item-count");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartSize = cart.reduce((acc, item) => acc + item.quantity, 0);
  cartItemCount.textContent = cartSize;
}



