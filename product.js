

const OPTIONS_BY_CATEGORY = {
  Dresses:  { label: "Size",     choices: ["XS", "S", "M", "L", "XL"] },
  Slippers: { label: "UK Size",  choices: ["6", "7", "8", "9", "10"] },
  Mobiles:  { label: "Storage",  choices: ["64 GB", "128 GB", "256 GB"] },
  Watches:  { label: "Strap",    choices: ["Leather", "Metal"] },
  Bags:     { label: "Colour",   choices: ["Black", "Tan", "Navy"] }
};

const DETAIL_ROWS = {
  Dresses:  ["Fit", "Free shipping above ₹999", "Easy 7-day returns"],
  Slippers: ["Fit", "Free shipping above ₹999", "Easy 7-day returns"],
  Mobiles:  ["Warranty", "Free shipping above ₹999", "7-day replacement"],
  Watches:  ["Warranty", "Free shipping above ₹999", "7-day returns"],
  Bags:     ["Material", "Free shipping above ₹999", "Easy 7-day returns"]
};

const selectedOptions = {};

function getCart() { return JSON.parse(localStorage.getItem("cart")) || []; }
function saveCart(c) { localStorage.setItem("cart", JSON.stringify(c)); updateBadges(); }
function getWish() { return JSON.parse(localStorage.getItem("wishlist")) || []; }
function saveWish(w) { localStorage.setItem("wishlist", JSON.stringify(w)); updateBadges(); }

function updateBadges() {
  const cartEl = document.getElementById("cartCount");
  const wishEl = document.getElementById("wishCount");
  if (cartEl) cartEl.textContent = getCart().length;
  if (wishEl) wishEl.textContent = getWish().length;
}

function findProduct(id) {
  return allProducts.find(p => p.id === id);
}

function getSelectedOption(product) {
  const config = OPTIONS_BY_CATEGORY[product.category];
  if (!config) return null;
  return selectedOptions[product.id] || config.choices[0];
}

function optionsHtml(product) {
  const config = OPTIONS_BY_CATEGORY[product.category];
  if (!config) return "";

  const current = getSelectedOption(product);
  const pills = config.choices.map(choice => `
    <button type="button" data-action="option" data-value="${choice}"
      class="option-pill border px-3 py-1.5 rounded-lg text-xs font-semibold ${choice === current ? "active" : ""}">
      ${choice}
    </button>
  `).join("");

  return `
    <div class="mt-6">
      <p class="text-xs font-bold uppercase text-gray-500 mb-2">Select ${config.label}</p>
      <div class="flex flex-wrap gap-2">${pills}</div>
    </div>
  `;
}

function productBlockHtml(product, isSingle) {
  const discount = Math.round((1 - product.price / product.oldPrice) * 100);
  const rows = (DETAIL_ROWS[product.category] || []).map(r => `<li>${r}</li>`).join("");
  const heading = isSingle
    ? `<h1 class="text-2xl md:text-3xl font-serif font-bold mt-1">${product.title}</h1>`
    : `<h2 class="text-xl md:text-2xl font-serif font-bold mt-1">${product.title}</h2>`;

  return `
    <article class="bg-white p-6 md:p-8 rounded-2xl border grid grid-cols-1 md:grid-cols-2 gap-8" data-product-id="${product.id}">
      <div>
        <img src="${product.image}" alt="${product.title}" class="w-full h-96 object-cover rounded-xl border">
      </div>

      <div class="flex flex-col justify-between">
        <div>
          <span class="text-xs uppercase font-bold text-gray-400">${product.category}</span>
          ${heading}

          <div class="flex items-center gap-3 mt-3">
            <span class="text-2xl font-bold">₹${product.price}</span>
            <span class="text-sm line-through text-gray-400">₹${product.oldPrice}</span>
            <span class="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded">${discount}% off</span>
          </div>

          <p class="text-sm text-gray-600 mt-4 leading-relaxed">${product.description}</p>

          ${optionsHtml(product)}

          <ul class="mt-6 text-sm text-gray-600 space-y-1 list-disc list-inside">${rows}</ul>
        </div>

        <div>
          <div class="flex gap-3 mt-8">
            <button type="button" data-action="cart" data-id="${product.id}"
              class="flex-1 bg-black text-white py-3 rounded-xl text-sm font-bold hover:bg-gray-800">Add to Cart</button>
            <button type="button" data-action="wish" data-id="${product.id}"
              class="px-5 py-3 border border-black rounded-xl text-sm font-bold hover:bg-gray-100">♡ Wishlist</button>
          </div>
          <p class="status hidden text-sm text-green-700 font-semibold mt-3"></p>
        </div>
      </div>
    </article>
  `;
}

function notFoundHtml() {
  return `
    <div class="bg-white p-10 rounded-2xl border text-center">
      <p class="text-lg font-semibold mb-3">Product not found</p>
      <a href="collection.html" class="inline-block bg-black text-white px-5 py-2.5 rounded-lg text-sm font-semibold">Back to Collections</a>
    </div>
  `;
}

function renderPage() {
  const box = document.getElementById("productDetailBox");
  if (!box || typeof allProducts === "undefined") return;

  const idParam = new URLSearchParams(window.location.search).get("id");

  if (idParam !== null) {
    const product = findProduct(parseInt(idParam, 10));

    if (!product) {
      document.title = "Product not found | Fabbro";
      box.className = "space-y-6";
      box.innerHTML = notFoundHtml();
      return;
    }

    document.title = `${product.title} | Fabbro`;
    box.className = "space-y-6";
    box.innerHTML = `
      <a href="product.html" class="text-sm font-semibold text-gray-600 hover:text-black">← All products</a>
      ${productBlockHtml(product, true)}
    `;
    return;
  }

  document.title = "All Products | Fabbro";
  box.className = "space-y-8";
  box.innerHTML = allProducts.map(p => productBlockHtml(p, false)).join("");
}

function showStatus(id, message) {
  const article = document.querySelector(`[data-product-id="${id}"]`);
  if (!article) return;
  const el = article.querySelector(".status");
  el.textContent = message;
  el.classList.remove("hidden");
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.add("hidden"), 2500);
}

function addToCart(id) {
  const product = findProduct(id);
  if (!product) return;

  const variant = getSelectedOption(product);
  const cart = getCart();
  const line = cart.find(c => c.id === id && c.variant === variant);

  if (line) {
    line.qty = (line.qty || 1) + 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      category: product.category,
      price: product.price,
      oldPrice: product.oldPrice,
      image: product.image,
      description: product.description,
      variant: variant,
      qty: 1
    });
  }

  saveCart(cart);
  const suffix = variant ? ` (${variant})` : "";
  showStatus(id, `${product.title}${suffix} added to cart`);
}

function addToWishlist(id) {
  const product = findProduct(id);
  if (!product) return;

  const wish = getWish();
  if (wish.some(w => w.id === id)) {
    showStatus(id, "Already in your wishlist");
    return;
  }

  wish.push(product);
  saveWish(wish);
  showStatus(id, "Saved to wishlist");
}

function handleClick(e) {
  const optionBtn = e.target.closest('[data-action="option"]');
  if (optionBtn) {
    const article = optionBtn.closest("[data-product-id]");
    const id = Number(article.dataset.productId);
    selectedOptions[id] = optionBtn.dataset.value;
    article.querySelectorAll('[data-action="option"]').forEach(b => {
      b.classList.toggle("active", b === optionBtn);
    });
    return;
  }

  const actionBtn = e.target.closest('[data-action="cart"], [data-action="wish"]');
  if (!actionBtn) return;

  const id = Number(actionBtn.dataset.id);
  if (actionBtn.dataset.action === "cart") addToCart(id);
  else addToWishlist(id);
}

document.addEventListener("DOMContentLoaded", () => {
  updateBadges();
  renderPage();
  document.getElementById("productDetailBox")?.addEventListener("click", handleClick);
});