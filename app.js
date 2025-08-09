const allProducts = [
  {
    id: "vase-1",
    name: "Vase",
    brand: "Hanan's",
    description: "Elegant ceramic vase perfect for home decoration",
    price: 59.99,
    category: "decor",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
  },
  {
    id: "stool-1",
    name: "Stool",
    brand: "John's",
    description: "Modern upholstered stool with wooden legs",
    price: 89.99,
    category: "furniture",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
  },
  {
    id: "chair-1",
    name: "Chair",
    brand: "BORDO",
    description: "Comfortable dining chair with modern design",
    price: 129.99,
    category: "furniture",
    image:
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
  },
  {
    id: "vase-2",
    name: "Vase",
    brand: "Pebbles",
    description: "Minimalist ceramic vase for modern homes",
    price: 45.99,
    category: "decor",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
  },
  {
    id: "painting-1",
    name: "Painting",
    brand: "SinCo",
    description: "Abstract landscape painting on canvas",
    price: 199.99,
    category: "decor",
    image:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
  },
  {
    id: "chair-2",
    name: "Chair",
    brand: "Hanan's",
    description: "Elegant upholstered dining chair",
    price: 149.99,
    category: "furniture",
    image:
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
  },
  {
    id: "chair-3",
    name: "Chair",
    brand: "Hanan's",
    description: "Modern black accent chair",
    price: 179.99,
    category: "furniture",
    image:
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
  },
  {
    id: "vase-3",
    name: "Vase",
    brand: "Hanan's",
    description: "Tall ceramic vase with textured finish",
    price: 79.99,
    category: "decor",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
  },
  {
    id: "shelves-1",
    name: "Shelves",
    brand: "Hanan's",
    description: "Geometric wall shelves for modern storage",
    price: 89.99,
    category: "storage",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
  },
];

let appState = {
  cart: {},
  isCartOpen: false,
  currentCategory: "all",
  searchQuery: "",
  showFavoritesOnly: false,
  minPrice: 0, 
  maxPrice: 1000,
  products: [...allProducts], 
};

//localStorage
function loadStateFromStorage() {
  try {
    const savedState = localStorage.getItem("ecommerce-state");
    if (savedState) {
      const parsed = JSON.parse(savedState);
      appState.cart = parsed.cart || {};
      appState.products = allProducts.map((product) => {
        const savedProduct = parsed.products?.find((p) => p.id === product.id);
        return {
          ...product,
          isFavorite: savedProduct ? savedProduct.isFavorite : false,
        };
      });
      
      appState.minPrice = parsed.minPrice !== undefined ? parsed.minPrice : 0;
      appState.maxPrice =
        parsed.maxPrice !== undefined ? parsed.maxPrice : 1000;
    }
  } catch (error) {
    console.error("Error loading state from localStorage:", error);
  }
}

// Save localStorage
function saveStateToStorage() {
  try {
    const stateToSave = {
      cart: appState.cart,
      products: appState.products.map((p) => ({
        id: p.id,
        isFavorite: p.isFavorite,
      })),
      minPrice: appState.minPrice,
      maxPrice: appState.maxPrice,
    };
    localStorage.setItem("ecommerce-state", JSON.stringify(stateToSave));
  } catch (error) {
    console.error("Error saving state to localStorage:", error);
  }
}

function toggleCart() {
  appState.isCartOpen = !appState.isCartOpen;
  reRenderUI();
}

function addToCart(productId) {
  const product = appState.products.find((p) => p.id === productId);
  if (product) {
    appState.cart[productId] = (appState.cart[productId] || 0) + 1;
    saveStateToStorage();
    reRenderUI();
    showNotification(`${product.name} added to cart!`);
  }
}

function removeFromCart(productId) {
  if (appState.cart[productId]) {
    appState.cart[productId]--;
    if (appState.cart[productId] <= 0) {
      delete appState.cart[productId];
    }
    saveStateToStorage();
    reRenderUI();
  }
}

function removeItemFromCart(productId) {
  if (appState.cart[productId]) {
    const product = appState.products.find((p) => p.id === productId);
    delete appState.cart[productId];
    saveStateToStorage();
    reRenderUI();
    showNotification(`${product.name} removed from cart!`);
  }
}

function increaseQuantity(productId) {
  if (appState.cart[productId]) {
    appState.cart[productId]++;
    saveStateToStorage();
    reRenderUI();
  }
}

function decreaseQuantity(productId) {
  if (appState.cart[productId] && appState.cart[productId] > 1) {
    appState.cart[productId]--;
    saveStateToStorage();
    reRenderUI();
  } else if (appState.cart[productId] === 1) {
    delete appState.cart[productId];
    saveStateToStorage();
    reRenderUI();
  }
}

function toggleFavorite(productId) {
  const product = appState.products.find((p) => p.id === productId);
  if (product) {
    product.isFavorite = !product.isFavorite;
    saveStateToStorage();
    reRenderUI();
    showNotification(
      product.isFavorite
        ? `${product.name} added to favorites!`
        : `${product.name} removed from favorites!`
    );
  }
}

function setCategory(category) {
  appState.currentCategory = category;
  reRenderUI();
}

function setSearchQuery(query) {
  appState.searchQuery = query.toLowerCase();
  reRenderUI();
}

function toggleShowFavoritesOnly() {
  appState.showFavoritesOnly = !appState.showFavoritesOnly;
  reRenderUI();
}

// min and max
function setPriceRange(type, value) {
  if (type === "min") {
    appState.minPrice = value;
    if (appState.minPrice > appState.maxPrice) {
      appState.maxPrice = appState.minPrice;
    }
  } else if (type === "max") {
    appState.maxPrice = value;
    if (appState.maxPrice < appState.minPrice) {
      appState.minPrice = appState.maxPrice;
    }
  }
  reRenderUI();
}

function closeCart() {
  appState.isCartOpen = false;
  reRenderUI();
}

function getFilteredProducts() {
  return appState.products.filter((product) => {
    if (
      appState.currentCategory !== "all" &&
      product.category !== appState.currentCategory
    ) {
      return false;
    }

    if (
      appState.searchQuery &&
      !product.name.toLowerCase().includes(appState.searchQuery) &&
      !product.brand.toLowerCase().includes(appState.searchQuery) &&
      !product.description.toLowerCase().includes(appState.searchQuery)
    ) {
      return false;
    }


    if (appState.showFavoritesOnly && !product.isFavorite) {
      return false;
    }

    if (
      product.price < appState.minPrice ||
      product.price > appState.maxPrice
    ) {
      return false;
    }

    return true;
  });
}

function getCartItems() {
  return Object.keys(appState.cart)
    .map((productId) => {
      const product = appState.products.find((p) => p.id === productId);
      return {
        ...product,
        quantity: appState.cart[productId],
      };
    })
    .filter((item) => item.quantity > 0);
}

function getCartTotal() {
  return getCartItems().reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
}

function getCartItemCount() {
  return Object.values(appState.cart).reduce(
    (total, quantity) => total + quantity,
    0
  );
}

// UI rendering 
function reRenderUI() {
  renderProducts();
  renderCart();
  renderCartButton();
  renderFilters();
  renderPriceFilter();
}

function renderProducts() {
  const productsGrid = document.getElementById("products-grid");
  const filteredProducts = getFilteredProducts();

  productsGrid.innerHTML = "";

  if (filteredProducts.length === 0) {
    productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #6c757d;">
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms.</p>
            </div>
        `;
    return;
  }

  filteredProducts.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.innerHTML = `
            <img src="${product.image}" alt="${
      product.name
    }" class="product-image" />
            <div class="product-info">
                <div class="product-brand">${product.brand}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-actions">
                    <button class="btn btn-primary" onclick="addToCart('${
                      product.id
                    }')">
                        Order
                    </button>
                    <button class="btn-favorite ${
                      product.isFavorite ? "active" : ""
                    }" 
                            onclick="toggleFavorite('${product.id}')"
                            title="${
                              product.isFavorite
                                ? "Remove from favorites"
                                : "Add to favorites"
                            }">
                        <svg class="favorite-icon" viewBox="0 0 24 24" fill="${
                          product.isFavorite ? "currentColor" : "none"
                        }" stroke="currentColor">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    productsGrid.appendChild(productCard);
  });
}

function renderCart() {
  const cartSidebar = document.getElementById("cart-sidebar");
  const cartItems = document.getElementById("cart-items");
  const totalAmount = document.getElementById("total-amount");
  const overlay = document.getElementById("overlay");

  if (appState.isCartOpen) {
    cartSidebar.classList.add("open");
    overlay.classList.add("active");
  } else {
    cartSidebar.classList.remove("open");
    overlay.classList.remove("active");
  }

  const items = getCartItems();
  cartItems.innerHTML = "";

  if (items.length === 0) {
    cartItems.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #6c757d;">
                <h4>Your cart is empty</h4>
                <p>Add some products to get started!</p>
            </div>
        `;
  } else {
    items.forEach((item) => {
      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";
      cartItem.innerHTML = `
                <img src="${item.image}" alt="${
        item.name
      }" class="cart-item-image" />
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-brand">${item.brand}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="increaseQuantity('${
                      item.id
                    }')" title="Increase quantity">+</button>
                    <div class="quantity-display">${item.quantity}</div>
                    <button class="quantity-btn" onclick="decreaseQuantity('${
                      item.id
                    }')" title="Decrease quantity">-</button>
                    <button class="remove-item-btn" onclick="removeItemFromCart('${
                      item.id
                    }')" title="Remove item">Remove</button>
                </div>
            `;
      cartItems.appendChild(cartItem);
    });
  }

  const total = getCartTotal();
  totalAmount.textContent = total.toFixed(2);
}

function renderCartButton() {
  const cartCount = document.getElementById("cart-count");
  const itemCount = getCartItemCount();

  cartCount.textContent = itemCount;
  cartCount.style.display = itemCount > 0 ? "flex" : "none";
}

function renderFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn[data-category]");
  filterButtons.forEach((button) => {
    const category = button.getAttribute("data-category");
    if (category === appState.currentCategory) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });

  const favoritesToggle = document.getElementById("favorites-toggle");
  if (appState.showFavoritesOnly) {
    favoritesToggle.classList.add("active");
  } else {
    favoritesToggle.classList.remove("active");
  }
}

function renderPriceFilter() {
  const minPriceRange = document.getElementById("min-price-range");
  const maxPriceRange = document.getElementById("max-price-range");
  const minPriceValue = document.getElementById("min-price-value");
  const maxPriceValue = document.getElementById("max-price-value");

  if (minPriceRange && maxPriceRange && minPriceValue && maxPriceValue) {
    minPriceRange.value = appState.minPrice;
    maxPriceRange.value = appState.maxPrice;
    minPriceValue.textContent = appState.minPrice;
    maxPriceValue.textContent = appState.maxPrice;

    const range = maxPriceRange.max - minPriceRange.min;
    const minPercent = ((appState.minPrice - minPriceRange.min) / range) * 100;
    const maxPercent = ((appState.maxPrice - minPriceRange.min) / range) * 100;

    minPriceRange.style.background = `linear-gradient(to right, #dee2e6 ${minPercent}%, #007bff ${minPercent}%, #007bff ${maxPercent}%, #dee2e6 ${maxPercent}%)`;
    maxPriceRange.style.background = `linear-gradient(to right, #dee2e6 ${minPercent}%, #007bff ${minPercent}%, #007bff ${maxPercent}%, #dee2e6 ${maxPercent}%)`;
  }
}


function showNotification(message) {

  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("show");
  }, 100);

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, 3000);
}

document.addEventListener("DOMContentLoaded", function () {

  loadStateFromStorage();

  reRenderUI();

  const cartButton = document.getElementById("cart-button");
  if (cartButton) {
    cartButton.addEventListener("click", toggleCart);
  }

  const closeCartButton = document.getElementById("close-cart");
  if (closeCartButton) {
    closeCartButton.addEventListener("click", closeCart);
  }

  const overlay = document.getElementById("overlay");
  if (overlay) {
    overlay.addEventListener("click", closeCart);
  }

  const filterButtons = document.querySelectorAll(".filter-btn[data-category]");
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const category = this.getAttribute("data-category");
      setCategory(category);
    });
  });

  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      setSearchQuery(this.value);
    });
  }

  const favoritesToggle = document.getElementById("favorites-toggle");
  if (favoritesToggle) {
    favoritesToggle.addEventListener("click", toggleShowFavoritesOnly);
  }

  const minPriceRange = document.getElementById("min-price-range");
  const maxPriceRange = document.getElementById("max-price-range");

  if (minPriceRange && maxPriceRange) {
    minPriceRange.addEventListener("input", function () {
      setPriceRange("min", parseInt(this.value));
    });
    maxPriceRange.addEventListener("input", function () {
      setPriceRange("max", parseInt(this.value));
    });
  }

  // Keyboard shortcuts
  document.addEventListener("keydown", function (e) {

    if (e.key === "Escape" && appState.isCartOpen) {
      closeCart();
    }

    if (e.ctrlKey && e.key === "k") {
      e.preventDefault();
      const searchInput = document.getElementById("search-input");
      if (searchInput) {
        searchInput.focus();
      }
    }
  });
});
