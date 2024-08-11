// Initialize an empty cart
let cart = [];

// Function to fetch products from Fake Store API
async function fetchProducts() {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const products = await response.json();
    console.log("Fetched products:", products); 
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// Function to update the cart count in the header
function updateCartCount() {
  const cartCountElement = document.querySelector(".cart-count");
  if (cartCountElement) {
    cartCountElement.textContent = cart.length;
  }
}

// Function to save the cart to local storage
function saveCartToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Function to load the cart from local storage
function loadCartFromLocalStorage() {
  const cartData = localStorage.getItem("cart");
  if (cartData) {
    cart = JSON.parse(cartData);
    updateCartCount();
  }
}

// Function to add a product to the cart
async function addToCart(productId) {
  const products = await fetchProducts();
  const product = products.find((product) => product.id === productId);
  if (product) {
    cart.push(product);
    updateCartCount();
    saveCartToLocalStorage();
    console.log(`Product added to cart with ID: ${productId}`);
  }
}

// Function to display cart items in the cart page
function displayCartItems() {
  const cartList = document.getElementById("cart-list");
  if (!cartList) return;
  cartList.innerHTML = "";
  let subtotal = 0;

  cart.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.classList.add("cart-item");
    listItem.innerHTML = `
      <img src="${item.image}" alt="${item.title}" class="cart-item-image">
      <div class="cart-item-details">
        <h3>${item.title}</h3>
        <p>$${item.price.toFixed(2)}</p>
      </div>
    `;
    cartList.appendChild(listItem);
    subtotal += item.price;
  });

  document.getElementById("subtotal").textContent = subtotal.toFixed(2);
  document.getElementById("total").textContent = subtotal.toFixed(2);
}

// Function to display featured products on the landing page
async function displayFeaturedProducts() {
  const products = await fetchProducts();
  const featuredProductsContainer = document.getElementById("featured-products-list");

  if (!featuredProductsContainer) {
    console.error("featured-products-list element not found");
    return; 
  }

  featuredProductsContainer.innerHTML = "";

  products.slice(0, 12).forEach((product) => {
    const productElement = document.createElement("div");
    productElement.classList.add("product");
    productElement.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <h3>${product.title}</h3>
      <p>$${product.price.toFixed(2)}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>`;
    featuredProductsContainer.appendChild(productElement);
  });
}

// Function to handle the search functionality
async function handleSearch() {
  const searchInput = document.querySelector(".search-bar input");
  const searchButton = document.querySelector(".search-bar button");
  const productContainer = document.getElementById("featured-products-list");

  searchButton.addEventListener("click", async () => {
    const searchValue = searchInput.value.toLowerCase();
    const products = await fetchProducts();

    productContainer.innerHTML = ""; 

    const filteredProducts = products.filter((product) =>
      product.title.toLowerCase().includes(searchValue)
    );

    filteredProducts.forEach((product) => {
      const productElement = document.createElement("div");
      productElement.classList.add("product");
      productElement.innerHTML = `
        <img src="${product.image}" alt="${product.title}">
        <h3>${product.title}</h3>
        <p>$${product.price.toFixed(2)}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>`;
      productContainer.appendChild(productElement);
    });

    if (filteredProducts.length === 0) {
      productContainer.innerHTML = "<p>No products found.</p>";
    }
  });
}

// Function to display products by category
async function displayProductsByCategory(category) {
  const products = await fetchProducts();
  const productContainer = document.getElementById("featured-products-list");

  productContainer.innerHTML = ""; 

  const filteredProducts = products.filter(
    (product) => product.category.toLowerCase() === category.toLowerCase()
  );

  filteredProducts.forEach((product) => {
    const productElement = document.createElement("div");
    productElement.classList.add("product");
    productElement.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <h3>${product.title}</h3>
      <p>$${product.price.toFixed(2)}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>`;
    productContainer.appendChild(productElement);
  });

  if (filteredProducts.length === 0) {
    productContainer.innerHTML = "<p>No products found in this category.</p>";
  }
}

// Function to handle category clicks
function handleCategoryClick(event) {
  event.preventDefault(); 
  const category = event.target.textContent;
  displayProductsByCategory(category).catch((error) =>
    console.error("Error displaying products by category:", error)
  );
}

// Function to toggle hamburger menu
function toggleHamburgerMenu() {
  const menu = document.querySelector("nav ul");
  if (menu) {
    menu.classList.toggle("active");
  }
}

// Function to display product details
async function displayProductDetails() {
  console.log("displayProductDetails function is called"); 
  const urlParams = new URLSearchParams(window.location.search);
  const productIdStr = urlParams.get("id");
  const productId = parseInt(productIdStr, 10); 

  console.log("Retrieved productId:", productId); 

  if (isNaN(productId)) {
    console.error("Invalid product ID");
    return;
  }

  const products = await fetchProducts();
  const product = products.find((p) => p.id === productId);

  if (!product) {
    console.error("Product not found for ID:", productId);
    return;
  }

  console.log("Fetched product:", product);

  const productImage = document.getElementById("product-image");
  const productTitle = document.getElementById("product-title");
  const productDescription = document.getElementById("product-description");
  const productPrice = document.getElementById("product-price");
  const addToCartBtn = document.getElementById("add-to-cart-btn");

  if (productImage) {
    productImage.src = product.image;
    productImage.alt = product.title;
    productImage.onload = () => console.log("Product image loaded successfully");
    productImage.onerror = () => console.error("Error loading product image:", product.image);
  } else {
    console.error("Product image element not found");
  }

  if (productTitle) {
    productTitle.textContent = product.title;
  } else {
    console.error("Product title element not found");
  }

  if (productDescription) {
    productDescription.textContent = product.description;
  } else {
    console.error("Product description element not found");
  }

  if (productPrice) {
    productPrice.textContent = `$${product.price.toFixed(2)}`;
  } else {
    console.error("Product price element not found");
  }

  if (addToCartBtn) {
    addToCartBtn.dataset.productId = product.id;
    addToCartBtn.addEventListener("click", async () => {
      await addToCart(product.id);
    });
  } else {
    console.error("Add to Cart button not found");
  }
}

// Ensure event listener is attached
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  if (hamburger) {
    hamburger.addEventListener("click", toggleHamburgerMenu);
  }

  // Load the cart when the page loads
  loadCartFromLocalStorage();

  // Initialize the landing page with featured products and search functionality
  if (window.location.pathname.includes("index.html")) {
    displayFeaturedProducts().catch((error) =>
      console.error("Error displaying featured products:", error)
    );
    handleSearch();

    // Add event listeners to category links
    const categoryLinks = document.querySelectorAll(".categories a");
    categoryLinks.forEach((link) => {
      link.addEventListener("click", handleCategoryClick);
    });
  }

  // Display cart items if on cart.html
  if (window.location.pathname.includes("cart.html")) {
    displayCartItems();
  }

  // Display product details if on product.html
  if (window.location.pathname.includes("product.html")) {
    displayProductDetails().catch((error) =>
      console.error("Error displaying product details:", error)
    );
  }
});
 