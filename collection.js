// collection.js - Filter, search, sort, pagination, cart & wishlist
let currentPage = 1;
const perPage = 12;

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

function addToCart(id) {
  const item = allProducts.find(p => p.id === id);
  if (!item) return;
  const cart = getCart();
  const existing = cart.find(c => c.id === id);
  if (existing) existing.qty += 1;
  else cart.push({ ...item, qty: 1 });
  saveCart(cart);
  alert(`${item.title} added to Cart!`);
}

function toggleWishlist(id) {
  const item = allProducts.find(p => p.id === id);
  if (!item) return;
  let wish = getWish();
  const exists = wish.some(w => w.id === id);
  if (exists) {
    wish = wish.filter(w => w.id !== id);
    alert("Removed from Wishlist");
  } else {
    wish.push(item);
    alert("Added to Wishlist");
  }
  saveWish(wish);
  renderCollections();
}

function getFilteredProducts() {
  const checked = Array.from(document.querySelectorAll(".cat-filter:checked")).map(cb => cb.value);
  const query = (document.getElementById("searchInput")?.value || "").toLowerCase().trim();
  const sort = document.getElementById("sortSelect")?.value || "default";

  let list = allProducts.filter(p =>
    checked.includes(p.category) &&
    (p.title.toLowerCase().includes(query) || p.category.toLowerCase().includes(query))
  );

  if (sort === "low-high") list.sort((a, b) => a.price - b.price);
  if (sort === "high-low") list.sort((a, b) => b.price - a.price);
  return list;
}

function renderCollections() {
  const grid = document.getElementById("productGrid");
  const countEl = document.getElementById("productCount");
  const pagEl = document.getElementById("pagination");
  if (!grid) return;

  const filtered = getFilteredProducts();
  const wishIds = getWish().map(w => w.id);
  countEl.textContent = `Showing ${filtered.length} Products`;

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  if (currentPage > totalPages) currentPage = 1;

  const start = (currentPage - 1) * perPage;
  const pageItems = filtered.slice(start, start + perPage);

  if (pageItems.length === 0) {
    grid.innerHTML = `<p class="col-span-full text-center py-10 text-gray-500">No products found for selected category.</p>`;
    pagEl.innerHTML = "";
    return;
  }

  grid.innerHTML = pageItems.map(p => {
    const isWished = wishIds.includes(p.id);
    return `
      <div class="product-card bg-white border rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
        <div>
          <a href="product-details.html?id=${p.id}" class="block overflow-hidden">
            <img src="${p.image}" alt="${p.title}" class="w-full h-52 object-cover">
          </a>
          <div class="p-4">
            <span class="text-xs uppercase font-bold text-gray-400">${p.category}</span>
            <h3 class="font-bold text-sm mt-1">
              <a href="product-details.html?id=${p.id}" class="hover:underline">${p.title}</a>
            </h3>
            <div class="flex items-center gap-2 mt-2">
              <span class="font-bold text-base">₹${p.price}</span>
              <span class="text-xs line-through text-gray-400">₹${p.oldPrice}</span>
            </div>
          </div>
        </div>
        <div class="px-4 pb-4 flex gap-2">
          <button onclick="addToCart(${p.id})" class="flex-1 bg-black text-white py-2 rounded-lg text-xs font-semibold hover:bg-gray-800">Add to Cart</button>
          <button onclick="toggleWishlist(${p.id})" class="px-3 py-2 rounded-lg border text-xs font-bold ${isWished ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-700'}">♥</button>
        </div>
      </div>
    `;
  }).join("");

  pagEl.innerHTML = Array.from({ length: totalPages }, (_, idx) => {
    const num = idx + 1;
    return `<button onclick="goPage(${num})" class="px-3 py-1.5 rounded border text-xs font-semibold ${num === currentPage ? 'bg-black text-white' : 'bg-white'}">${num}</button>`;
  }).join("");
}

function goPage(num) {
  currentPage = num;
  renderCollections();
}

document.addEventListener("DOMContentLoaded", () => {
  // Support URL ?category= or ?search=
  const params = new URLSearchParams(window.location.search);
  const catParam = params.get("category");
  const searchParam = params.get("search");

  if (catParam && categoriesList.includes(catParam)) {
    document.querySelectorAll(".cat-filter").forEach(cb => {
      cb.checked = (cb.value === catParam);
    });
  }
  if (searchParam && document.getElementById("searchInput")) {
    document.getElementById("searchInput").value = searchParam;
  }

  document.querySelectorAll(".cat-filter").forEach(cb => cb.addEventListener("change", () => { currentPage = 1; renderCollections(); }));
  document.getElementById("searchInput")?.addEventListener("input", () => { currentPage = 1; renderCollections(); });
  document.getElementById("sortSelect")?.addEventListener("change", renderCollections);

  updateBadges();
  renderCollections();
});