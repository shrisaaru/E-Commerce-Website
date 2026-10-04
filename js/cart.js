// =============================================
//  NEXMART — Cart Manager
//  All cart logic and local storage handling
// =============================================

const Cart = (() => {
  const STORAGE_KEY = "nexmart_cart";
  const WISHLIST_KEY = "nexmart_wishlist";

  // ── Internal helpers ──────────────────────────────────────────
  function _load(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
      return [];
    }
  }

  function _save(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // ── Cart Operations ───────────────────────────────────────────
  function getItems() {
    return _load(STORAGE_KEY);
  }

  function addItem(product, qty = 1) {
    const items = getItems();
    const existing = items.find((i) => i.id === product.id);
    if (existing) {
      existing.qty = Math.min(existing.qty + qty, product.stock || 99);
    } else {
      items.push({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        oldPrice: product.oldPrice,
        image: product.image,
        qty,
        stock: product.stock || 99,
      });
    }
    _save(STORAGE_KEY, items);
    updateCartUI();
    showToast(`"${product.name}" added to cart 🛒`, "success");
    return items;
  }

  function removeItem(id) {
    const items = getItems().filter((i) => i.id !== id);
    _save(STORAGE_KEY, items);
    updateCartUI();
    return items;
  }

  function updateQty(id, qty) {
    const items = getItems();
    const item = items.find((i) => i.id === id);
    if (item) {
      if (qty <= 0) return removeItem(id);
      item.qty = Math.min(qty, item.stock);
      _save(STORAGE_KEY, items);
      updateCartUI();
    }
    return items;
  }

  function clearCart() {
    _save(STORAGE_KEY, []);
    updateCartUI();
  }

  function getCount() {
    return getItems().reduce((sum, i) => sum + i.qty, 0);
  }

  function getSubtotal() {
    return getItems().reduce((sum, i) => sum + i.price * i.qty, 0);
  }

  // ── Wishlist Operations ───────────────────────────────────────
  function getWishlist() {
    return _load(WISHLIST_KEY);
  }

  function toggleWishlist(productId) {
    const list = getWishlist();
    const idx = list.indexOf(productId);
    if (idx >= 0) {
      list.splice(idx, 1);
      showToast("Removed from wishlist", "info");
    } else {
      list.push(productId);
      showToast("Added to wishlist ❤️", "success");
    }
    _save(WISHLIST_KEY, list);
    updateWishlistUI();
    return list;
  }

  function isWishlisted(productId) {
    return getWishlist().includes(productId);
  }

  // ── UI Updates ────────────────────────────────────────────────
  function updateCartUI() {
    const count = getCount();
    document.querySelectorAll(".cart-count").forEach((el) => {
      el.textContent = count;
      el.style.display = count > 0 ? "flex" : "none";
    });
  }

  function updateWishlistUI() {
    const count = getWishlist().length;
    document.querySelectorAll(".wishlist-count").forEach((el) => {
      el.textContent = count;
      el.style.display = count > 0 ? "flex" : "none";
    });
  }

  function init() {
    updateCartUI();
    updateWishlistUI();
  }

  return {
    getItems,
    addItem,
    removeItem,
    updateQty,
    clearCart,
    getCount,
    getSubtotal,
    getWishlist,
    toggleWishlist,
    isWishlisted,
    init,
  };
})();

// ── Toast Notification System ─────────────────────────────────
function showToast(message, type = "success") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"}</span>
    <span class="toast-msg">${message}</span>
  `;
  container.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("toast--show"));
  setTimeout(() => {
    toast.classList.remove("toast--show");
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// ── Build a Product Card (shared across pages) ────────────────
function buildProductCard(product) {
  const discount = getDiscount(product.price, product.oldPrice);
  const wishlisted = Cart.isWishlisted(product.id);

  const card = document.createElement("div");
  card.className = "product-card";
  card.setAttribute("data-id", product.id);
  card.setAttribute("data-category", product.category);
  card.setAttribute("data-price", product.price);
  card.setAttribute("data-name", product.name);

  card.innerHTML = `
    <div class="product-card__image-wrap">
      <img
        src="${product.image}"
        alt="${product.name}"
        class="product-card__img"
        loading="lazy"
        onerror="this.src='';this.onerror=null;this.parentElement.classList.add('img-placeholder')"
      />
      ${product.badge ? `<span class="product-card__badge badge--${product.badge.toLowerCase()}">${product.badge}</span>` : ""}
      ${discount > 0 ? `<span class="product-card__discount">-${discount}%</span>` : ""}
      <button
        class="product-card__wishlist ${wishlisted ? "active" : ""}"
        data-id="${product.id}"
        aria-label="Toggle Wishlist"
        title="${wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}"
      >
        ${wishlisted ? "❤️" : "🤍"}
      </button>
    </div>
    <div class="product-card__body">
      <span class="product-card__category">${product.category}</span>
      <h3 class="product-card__name">${product.name}</h3>
      <div class="product-card__rating">
        ${generateStars(product.rating)}
        <span class="rating-value">${product.rating}</span>
        <span class="rating-count">(${product.reviews.toLocaleString()})</span>
      </div>
      <div class="product-card__pricing">
        <span class="price-current">${formatPrice(product.price)}</span>
        ${product.oldPrice ? `<span class="price-old">${formatPrice(product.oldPrice)}</span>` : ""}
      </div>
    </div>
    <div class="product-card__actions">
      <button class="btn btn--cart" data-id="${product.id}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        Add to Cart
      </button>
      <a href="products.html?id=${product.id}" class="btn btn--view">View</a>
    </div>
  `;

  // Wishlist toggle
  card.querySelector(".product-card__wishlist").addEventListener("click", (e) => {
    e.stopPropagation();
    Cart.toggleWishlist(product.id);
    const btn = e.currentTarget;
    const wishlisted = Cart.isWishlisted(product.id);
    btn.textContent = wishlisted ? "❤️" : "🤍";
    btn.classList.toggle("active", wishlisted);
  });

  // Add to cart
  card.querySelector(".btn--cart").addEventListener("click", () => {
    Cart.addItem(product);
    const btn = card.querySelector(".btn--cart");
    btn.textContent = "✓ Added!";
    btn.classList.add("added");
    setTimeout(() => {
      btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> Add to Cart`;
      btn.classList.remove("added");
    }, 1500);
  });

  return card;
}

// Initialize cart on every page
document.addEventListener("DOMContentLoaded", () => Cart.init());
