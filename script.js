// ============================================================
//  script.js — Phần này do Bạn B làm (feature/cart)
//  Bạn A KHÔNG cần sửa file này.
//  Bạn A chỉ cần đảm bảo HTML gọi đúng tên hàm:
//    addToCart(name, price)
//    toggleCart()
// ============================================================

let cart = [];

// -------------------------------------------------------
// Thêm sản phẩm vào giỏ hàng
// -------------------------------------------------------
function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }

  updateCartUI();
  showToast(`Đã thêm "${name}" vào giỏ 🛍️`);
  bumpCartCount();
}

// -------------------------------------------------------
// Xóa 1 sản phẩm khỏi giỏ
// -------------------------------------------------------
function removeFromCart(name) {
  cart = cart.filter(item => item.name !== name);
  updateCartUI();
}

// -------------------------------------------------------
// Tăng / giảm số lượng
// -------------------------------------------------------
function changeQty(name, delta) {
  const item = cart.find(i => i.name === name);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(name);
    return;
  }
  updateCartUI();
}

// -------------------------------------------------------
// Render giỏ hàng + tính tổng
// -------------------------------------------------------
function updateCartUI() {
  const cartList = document.getElementById("cart-list");
  const totalEl = document.getElementById("total");
  const countEl = document.getElementById("cart-count");
  const checkoutBtn = document.getElementById("btn-checkout");
  const emptyMsg = document.getElementById("cart-empty-msg");

  // Clear list
  cartList.innerHTML = "";

  if (cart.length === 0) {
    const li = document.createElement("li");
    li.id = "cart-empty-msg";
    li.className = "cart-empty";
    li.innerHTML = `<span>🛍️</span><p>Giỏ hàng trống</p>`;
    cartList.appendChild(li);
    checkoutBtn.disabled = true;
  } else {
    checkoutBtn.disabled = false;
    cart.forEach(item => {
      const li = document.createElement("li");
      li.className = "cart-item";
      li.innerHTML = `
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${formatPrice(item.price)} VNĐ / cái</div>
        </div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="changeQty('${item.name}', -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty('${item.name}', 1)">+</button>
          <button class="btn-remove" onclick="removeFromCart('${item.name}')" title="Xóa">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
            </svg>
          </button>
        </div>
      `;
      cartList.appendChild(li);
    });
  }

  // Tính tổng tiền
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  totalEl.textContent = formatPrice(total) + " VNĐ";

  // Cập nhật số lượng trên badge
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  countEl.textContent = totalQty;
}

// -------------------------------------------------------
// Hiện / ẩn sidebar giỏ hàng
// -------------------------------------------------------
function toggleCart() {
  const sidebar = document.getElementById("cart-sidebar");
  sidebar.classList.toggle("open");

  // Overlay backdrop
  let overlay = document.getElementById("cart-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "cart-overlay";
    overlay.className = "overlay";
    overlay.onclick = toggleCart;
    document.body.appendChild(overlay);
  }
  overlay.classList.toggle("show");
}

// -------------------------------------------------------
// Toast thông báo
// -------------------------------------------------------
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

// -------------------------------------------------------
// Animation badge
// -------------------------------------------------------
function bumpCartCount() {
  const el = document.getElementById("cart-count");
  el.classList.remove("bump");
  void el.offsetWidth; // reflow trick
  el.classList.add("bump");
}

// -------------------------------------------------------
// Format số tiền: 200000 → "200.000"
// -------------------------------------------------------
function formatPrice(n) {
  return n.toLocaleString("vi-VN");
}
