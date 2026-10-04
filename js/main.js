// =============================================
//  NEXMART — Main JS
//  Navigation, search, page-specific logic
// =============================================

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initSearch();
  initScrollEffects();
  initPageSpecific();
});

// ── Navbar ────────────────────────────────────────────────────
function initNavbar() {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");
  const navbar = document.getElementById("navbar");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("open");
      navMenu.classList.toggle("open");
      document.body.classList.toggle("nav-open");
    });

    // Close menu on nav link click
    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("open");
        navMenu.classList.remove("open");
        document.body.classList.remove("nav-open");
      });
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!navbar.contains(e.target)) {
        hamburger.classList.remove("open");
        navMenu.classList.remove("open");
        document.body.classList.remove("nav-open");
      }
    });
  }

  // Scroll effect
  if (navbar) {
    window.addEventListener("scroll", () => {
      navbar.classList.toggle("scrolled", window.scrollY > 50);
    });
  }

  // Set active nav link
  const currentPage = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
}

// ── Search ────────────────────────────────────────────────────
function initSearch() {
  const searchToggle = document.getElementById("search-toggle");
  const searchBar = document.getElementById("search-bar");
  const searchInput = document.getElementById("search-input");

  if (searchToggle && searchBar) {
    searchToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      searchBar.classList.toggle("open");
      if (searchBar.classList.contains("open")) searchInput.focus();
    });

    document.addEventListener("click", (e) => {
      if (!searchBar.contains(e.target) && e.target !== searchToggle) {
        searchBar.classList.remove("open");
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const q = searchInput.value.trim();
        if (q) window.location.href = `products.html?search=${encodeURIComponent(q)}`;
      }
    });
  }
}

// ── Scroll Effects ────────────────────────────────────────────
function initScrollEffects() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
  );

  document.querySelectorAll(".fade-in, .slide-up, .slide-left, .slide-right").forEach((el) => {
    observer.observe(el);
  });
}

// ── Page-Specific Logic ───────────────────────────────────────
function initPageSpecific() {
  const page = location.pathname.split("/").pop() || "index.html";

  if (page === "index.html" || page === "") initHomePage();
  else if (page === "products.html") initProductsPage();
  else if (page === "cart.html") initCartPage();
  else if (page === "checkout.html") initCheckoutPage();
  else if (page === "login.html") initLoginPage();
}

// ═══════════════════════════════════════════
//  HOME PAGE
// ═══════════════════════════════════════════
function initHomePage() {
  renderFeaturedProducts();
  initHeroAnimation();
  initCounters();
  initNewsletterForm();
}

function initHeroAnimation() {
  const heroContent = document.querySelector(".hero__content");
  const heroVisual = document.querySelector(".hero__visual");
  if (heroContent) {
    setTimeout(() => heroContent.classList.add("visible"), 100);
  }
  if (heroVisual) {
    setTimeout(() => heroVisual.classList.add("visible"), 400);
  }
}

function renderFeaturedProducts() {
  const grid = document.getElementById("featured-grid");
  if (!grid || !window.PRODUCTS) return;

  const featured = PRODUCTS.slice(0, 8);
  featured.forEach((p) => grid.appendChild(buildProductCard(p)));
}

function initCounters() {
  const counters = document.querySelectorAll(".stat-number[data-target]");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  });
  counters.forEach((c) => observer.observe(c));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || "";
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const update = () => {
    current += step;
    if (current >= target) {
      el.textContent = target.toLocaleString() + suffix;
    } else {
      el.textContent = Math.floor(current).toLocaleString() + suffix;
      requestAnimationFrame(update);
    }
  };
  requestAnimationFrame(update);
}

function initNewsletterForm() {
  const form = document.getElementById("newsletter-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = form.querySelector("input[type='email']").value;
    if (email) {
      showToast("Subscribed successfully! 🎉", "success");
      form.reset();
    }
  });
}

// ═══════════════════════════════════════════
//  PRODUCTS PAGE
// ═══════════════════════════════════════════
function initProductsPage() {
  let filteredProducts = [...PRODUCTS];

  const grid = document.getElementById("products-grid");
  const searchInput = document.getElementById("products-search");
  const sortSelect = document.getElementById("sort-select");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const priceMin = document.getElementById("price-min");
  const priceMax = document.getElementById("price-max");
  const priceDisplay = document.getElementById("price-display");
  const resultCount = document.getElementById("result-count");

  let activeCategory = "All";
  let activeSort = "default";
  let searchQuery = "";
  let maxPrice = 100000;

  // Init max price
  const globalMax = Math.max(...PRODUCTS.map((p) => p.price));
  if (priceMax) {
    priceMax.max = globalMax;
    priceMax.value = globalMax;
    maxPrice = globalMax;
  }

  function applyFilters() {
    filteredProducts = PRODUCTS.filter((p) => {
      const matchCat = activeCategory === "All" || p.category === activeCategory;
      const matchSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery) ||
        p.category.toLowerCase().includes(searchQuery) ||
        p.description.toLowerCase().includes(searchQuery);
      const matchPrice = p.price <= maxPrice;
      return matchCat && matchSearch && matchPrice;
    });

    // Sort
    switch (activeSort) {
      case "price-asc":
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "rating":
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
    }

    renderGrid(filteredProducts);
  }

  function renderGrid(products) {
    if (!grid) return;
    grid.innerHTML = "";
    if (products.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>No products found</h3>
          <p>Try adjusting your filters or search term</p>
          <button class="btn btn--primary" onclick="location.reload()">Reset Filters</button>
        </div>
      `;
      return;
    }

    products.forEach((p, i) => {
      const card = buildProductCard(p);
      card.style.animationDelay = `${i * 60}ms`;
      card.classList.add("slide-up", "visible");
      grid.appendChild(card);
    });

    if (resultCount) resultCount.textContent = `${products.length} Products`;
  }

  // Events
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      searchQuery = searchInput.value.trim().toLowerCase();
      applyFilters();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      activeSort = sortSelect.value;
      applyFilters();
    });
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeCategory = btn.dataset.category;
      applyFilters();
    });
  });

  if (priceMax) {
    priceMax.addEventListener("input", () => {
      maxPrice = parseInt(priceMax.value);
      if (priceDisplay) priceDisplay.textContent = formatPrice(maxPrice);
      applyFilters();
    });
    if (priceDisplay) priceDisplay.textContent = formatPrice(globalMax);
  }

  // URL params
  const params = new URLSearchParams(location.search);
  if (params.get("search")) {
    searchQuery = params.get("search").toLowerCase();
    if (searchInput) searchInput.value = params.get("search");
  }
  if (params.get("category")) {
    activeCategory = params.get("category");
    filterBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.category === activeCategory);
    });
  }

  applyFilters();
}

// ═══════════════════════════════════════════
//  CART PAGE
// ═══════════════════════════════════════════
function initCartPage() {
  renderCartPage();
}

function renderCartPage() {
  const cartContainer = document.getElementById("cart-items");
  const emptyState = document.getElementById("cart-empty");
  const cartSummary = document.getElementById("cart-summary");
  const items = Cart.getItems();

  if (!cartContainer) return;

  if (items.length === 0) {
    cartContainer.style.display = "none";
    if (cartSummary) cartSummary.style.display = "none";
    if (emptyState) emptyState.style.display = "flex";
    return;
  }

  if (emptyState) emptyState.style.display = "none";
  cartContainer.style.display = "block";
  if (cartSummary) cartSummary.style.display = "block";

  cartContainer.innerHTML = items
    .map(
      (item) => `
    <div class="cart-item" data-id="${item.id}">
      <div class="cart-item__image-wrap">
        <img src="${item.image}" alt="${item.name}" class="cart-item__img"
          onerror="this.src='';this.onerror=null;this.parentElement.classList.add('img-placeholder')">
      </div>
      <div class="cart-item__info">
        <span class="cart-item__category">${item.category}</span>
        <h3 class="cart-item__name">${item.name}</h3>
        <div class="cart-item__price">
          <span class="cart-item__current">${formatPrice(item.price)}</span>
          ${item.oldPrice ? `<span class="cart-item__old">${formatPrice(item.oldPrice)}</span>` : ""}
        </div>
      </div>
      <div class="cart-item__controls">
        <div class="qty-control">
          <button class="qty-btn" data-action="dec" data-id="${item.id}">−</button>
          <input class="qty-input" type="number" value="${item.qty}" min="1" max="${item.stock}" data-id="${item.id}" readonly>
          <button class="qty-btn" data-action="inc" data-id="${item.id}">+</button>
        </div>
        <div class="cart-item__line-total">${formatPrice(item.price * item.qty)}</div>
        <button class="cart-item__remove" data-id="${item.id}" aria-label="Remove item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
        </button>
      </div>
    </div>
  `
    )
    .join("");

  updateCartSummary();
  bindCartEvents();
}

function bindCartEvents() {
  document.querySelectorAll(".qty-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const action = btn.dataset.action;
      const items = Cart.getItems();
      const item = items.find((i) => i.id === id);
      if (!item) return;
      if (action === "inc") Cart.updateQty(id, item.qty + 1);
      else Cart.updateQty(id, item.qty - 1);
      renderCartPage();
    });
  });

  document.querySelectorAll(".cart-item__remove").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      btn.closest(".cart-item").style.opacity = "0";
      btn.closest(".cart-item").style.transform = "translateX(30px)";
      setTimeout(() => {
        Cart.removeItem(id);
        renderCartPage();
      }, 300);
    });
  });

  const clearBtn = document.getElementById("clear-cart");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (confirm("Clear entire cart?")) {
        Cart.clearCart();
        renderCartPage();
      }
    });
  }
}

function updateCartSummary() {
  const subtotal = Cart.getSubtotal();
  const shipping = subtotal > 5000 ? 0 : 99;
  const discount = Math.floor(subtotal * 0.05);
  const total = subtotal + shipping - discount;

  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  set("summary-subtotal", formatPrice(subtotal));
  set("summary-shipping", shipping === 0 ? "FREE" : formatPrice(shipping));
  set("summary-discount", "−" + formatPrice(discount));
  set("summary-total", formatPrice(total));
  set("summary-items", Cart.getCount() + " items");
}

// ═══════════════════════════════════════════
//  CHECKOUT PAGE
// ═══════════════════════════════════════════
function initCheckoutPage() {
  renderCheckoutSummary();
  initCheckoutForm();
  initPaymentToggle();
}

function renderCheckoutSummary() {
  const list = document.getElementById("checkout-item-list");
  if (!list) return;
  const items = Cart.getItems();

  if (items.length === 0) {
    window.location.href = "cart.html";
    return;
  }

  list.innerHTML = items
    .map(
      (item) => `
    <div class="checkout-item">
      <img src="${item.image}" alt="${item.name}" class="checkout-item__img"
        onerror="this.src='';this.onerror=null;this.classList.add('img-placeholder')">
      <div class="checkout-item__details">
        <p class="checkout-item__name">${item.name}</p>
        <p class="checkout-item__qty">Qty: ${item.qty}</p>
      </div>
      <span class="checkout-item__price">${formatPrice(item.price * item.qty)}</span>
    </div>
  `
    )
    .join("");

  const subtotal = Cart.getSubtotal();
  const shipping = subtotal > 5000 ? 0 : 99;
  const discount = Math.floor(subtotal * 0.05);
  const total = subtotal + shipping - discount;

  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };
  set("co-subtotal", formatPrice(subtotal));
  set("co-shipping", shipping === 0 ? "FREE" : formatPrice(shipping));
  set("co-discount", "−" + formatPrice(discount));
  set("co-total", formatPrice(total));
}

function initCheckoutForm() {
  const form = document.getElementById("checkout-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = form.querySelector(".btn--place-order");
    btn.textContent = "Processing...";
    btn.disabled = true;

    setTimeout(() => {
      Cart.clearCart();
      document.getElementById("order-success").style.display = "flex";
      document.getElementById("checkout-main").style.display = "none";
    }, 2000);
  });
}

function initPaymentToggle() {
  const methods = document.querySelectorAll(".payment-method-btn");
  const panels = document.querySelectorAll(".payment-panel");

  methods.forEach((btn) => {
    btn.addEventListener("click", () => {
      methods.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      panels.forEach((p) => (p.style.display = "none"));
      const target = document.getElementById("panel-" + btn.dataset.method);
      if (target) target.style.display = "block";
    });
  });
}

// ═══════════════════════════════════════════
//  LOGIN PAGE
// ═══════════════════════════════════════════
function initLoginPage() {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const tabBtns = document.querySelectorAll(".tab-btn");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const target = btn.dataset.tab;
      loginForm.style.display = target === "login" ? "block" : "none";
      signupForm.style.display = target === "signup" ? "block" : "none";
    });
  });

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      showToast("Logged in successfully! 👋", "success");
      setTimeout(() => (window.location.href = "index.html"), 1500);
    });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const pw = signupForm.querySelector("#signup-password").value;
      const cpw = signupForm.querySelector("#signup-confirm").value;
      if (pw !== cpw) {
        showToast("Passwords do not match!", "error");
        return;
      }
      showToast("Account created! Welcome 🎉", "success");
      setTimeout(() => (window.location.href = "index.html"), 1500);
    });
  }

  // Toggle password visibility
  document.querySelectorAll(".toggle-password").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = btn.previousElementSibling;
      if (input.type === "password") {
        input.type = "text";
        btn.textContent = "🙈";
      } else {
        input.type = "password";
        btn.textContent = "👁️";
      }
    });
  });
}
