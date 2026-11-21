 // home.js - Renders categories, featured items & badges
function updateHeaderBadges() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const wish = JSON.parse(localStorage.getItem("wishlist")) || [];
  const cartEl = document.getElementById("cartCount");
  const wishEl = document.getElementById("wishCount");
  if (cartEl) cartEl.textContent = cart.length;
  if (wishEl) wishEl.textContent = wish.length;
}

function renderHomeCategories() {
  const box = document.getElementById("homeCategories");
  if (!box) return;
  box.innerHTML = categoriesList.map(cat => `
    <a href="collections.html?category=${encodeURIComponent(cat)}" class="bg-white p-3 rounded-xl border text-center hover:shadow transition">
      <img src="${categoryImages[cat][0]}" alt="${cat}" class="w-full h-28 object-cover rounded-lg mb-2">
      <p class="font-semibold text-sm">${cat}</p>
    </a>
  `).join("");
}

function renderHomeProducts() {
  const grid = document.getElementById("homeProducts");
  if (!grid || typeof allProducts === "undefined") return;
  grid.innerHTML = allProducts.slice(0, 8).map(p => `
    <div class="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
      <a href="product-details.html?id=${p.id}">
        <img src="${p.image}" alt="${p.title}" class="w-full h-48 object-cover">
      </a>
      <div class="p-3">
        <span class="text-[11px] uppercase text-gray-400 font-bold">${p.category}</span>
        <h3 class="font-semibold text-sm truncate mt-0.5">
          <a href="product-details.html?id=${p.id}" class="hover:underline">${p.title}</a>
        </h3>
        <p class="font-bold text-base mt-1">₹${p.price}</p>
      </div>
    </div>
  `).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  updateHeaderBadges();
  renderHomeCategories();
  renderHomeProducts();
});