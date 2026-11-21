// wishlist.js - Displays & moves saved wishlist items to cart
function getWish() { return JSON.parse(localStorage.getItem("wishlist")) || []; }
function saveWish(w) { localStorage.setItem("wishlist", JSON.stringify(w)); renderWishlist(); }
function getCart() { return JSON.parse(localStorage.getItem("cart")) || []; }
function saveCart(c) { localStorage.setItem("cart", JSON.stringify(c)); updateBadges(); }

function updateBadges() {
  const cartEl = document.getElementById("cartCount");
  const wishEl = document.getElementById("wishCount");
  if (cartEl) cartEl.textContent = getCart().length;
  if (wishEl) wishEl.textContent = getWish().length;
}

function removeWish(index) {
  const wish = getWish();
  wish.splice(index, 1);
  saveWish(wish);
}

function moveToCart(index) {
  const wish = getWish();
  const item = wish[index];
  if (!item) return;
  const cart = getCart();
  cart.push({ ...item, qty: 1 });
  saveCart(cart);
  wish.splice(index, 1);
  saveWish(wish);
  alert(`${item.title} moved to Cart!`);
}

function renderWishlist() {
  updateBadges();
  const grid = document.getElementById("wishlistGrid");
  if (!grid) return;

  const wish = getWish();
  if (wish.length === 0) {
    grid.innerHTML = `<p class="col-span-full text-sm text-gray-500">No items in wishlist yet. <a href="collections.html" class="underline font-semibold">Browse Collections</a></p>`;
    return;
  }

  grid.innerHTML = wish.map((item, idx) => `
    <div class="border rounded-xl overflow-hidden bg-white">
      <img src="${item.image}" alt="${item.title}" class="wish-img">
      <div class="p-4">
        <span class="text-xs uppercase text-gray-400 font-bold">${item.category}</span>
        <h3 class="font-bold text-sm mt-1">${item.title}</h3>
        <p class="font-bold text-base mt-1">₹${item.price}</p>
        <div class="flex gap-2 mt-3">
          <button onclick="moveToCart(${idx})" class="flex-1 bg-black text-white py-1.5 rounded-lg text-xs font-semibold">Move to Cart</button>
          <button onclick="removeWish(${idx})" class="px-3 py-1.5 border rounded-lg text-xs text-red-600 font-semibold">Remove</button>
        </div>
      </div>
    </div>
  `).join("");
}

document.addEventListener("DOMContentLoaded", renderWishlist);