// 1. DỮ LIỆU TEST
const products = [
  { id: 1, name: "Men vi sinh Eco-Pro", code: "MEN02", price: 350000 },
  { id: 2, name: "AquaClean Pro - Xử lý đáy", code: "AQ001", price: 150000 },
  { id: 3, name: "Thuốc tím khử trùng", code: "TIM01", price: 85000 },
];

let cart = [];

document.addEventListener("DOMContentLoaded", () => {
  initSearchProduct();
  document
    .getElementById("extra-fee")
    .addEventListener("input", calculateTotal);
  document
    .getElementById("order-discount")
    .addEventListener("input", calculateTotal);
});

// --- BOX TRÁI: TÌM KIẾM ---

function initSearchProduct() {
  const searchInput = document.getElementById("search-product");
  const resultsBox = document.getElementById("search-results");

  searchInput.addEventListener("input", (e) => {
    const key = e.target.value.trim().toLowerCase();
    if (key.length < 1) {
      resultsBox.classList.add("d-none");
      return;
    }

    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(key) ||
        p.code.toLowerCase().includes(key),
    );

    if (filtered.length > 0) {
      resultsBox.innerHTML = ""; // Xóa trắng kết quả cũ
      filtered.forEach((p) => {
        // TẠO ELEMENT THỦ CÔNG ĐỂ KHÔNG BỊ LỖI CLICK
        const item = document.createElement("div");
        item.className =
          "list-group-item list-group-item-action d-flex justify-content-between align-items-center cursor-pointer py-2";
        item.innerHTML = `
                    <div>
                        <div class="fw-bold small text-dark">${p.name}</div>
                        <div class="x-small text-muted">Mã: ${p.code}</div>
                    </div>
                    <div class="text-primary fw-bold small">${p.price.toLocaleString()}đ</div>
                `;
        // BẮT SỰ KIỆN CLICK TRỰC TIẾP VÀO ĐÂY
        item.addEventListener("click", () => {
          handleSelectProduct(p);
        });
        resultsBox.appendChild(item);
      });
      resultsBox.classList.remove("d-none");
    } else {
      resultsBox.innerHTML =
        '<div class="list-group-item small text-muted">Không tìm thấy thuốc</div>';
      resultsBox.classList.remove("d-none");
    }
  });
}

function handleSelectProduct(product) {
  console.log("Đã chọn sản phẩm:", product.name); // Để Duy kiểm tra trong Console (F12)

  const existingIndex = cart.findIndex((item) => item.id === product.id);

  if (existingIndex !== -1) {
    cart[existingIndex].qty += 1;
  } else {
    // Thêm món mới vào mảng
    cart.push({
      id: product.id,
      name: product.name,
      code: product.code,
      customPrice: product.price,
      qty: 1,
    });
  }

  // Ẩn tìm kiếm
  document.getElementById("search-results").classList.add("d-none");
  document.getElementById("search-product").value = "";

  // Vẽ lại giỏ hàng
  renderCart();
}

function renderCart() {
  const cartList = document.getElementById("cart-list");
  const emptyMsg = document.getElementById("cart-empty");

  // Nếu giỏ hàng trống
  if (cart.length === 0) {
    if (emptyMsg) emptyMsg.classList.remove("d-none"); // Kiểm tra có emptyMsg mới chạy
    cartList.innerHTML = "";
    if (emptyMsg) cartList.appendChild(emptyMsg);
    document.getElementById("subtotal").innerText = "0đ";
    calculateTotal();
    return;
  }

  // Nếu có hàng: Ẩn thông báo "Chưa có thông tin"
  if (emptyMsg) emptyMsg.classList.add("d-none"); // Thêm dấu if này để né lỗi 'classList' của null

  let subtotal = 0;
  cartList.innerHTML = "";

  cart.forEach((item, index) => {
    const itemTotal = item.qty * item.customPrice;
    subtotal += itemTotal;

    const row = document.createElement("div");
    row.className = "cart-item border-bottom py-3";
    row.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div style="flex: 1;">
                    <div class="fw-bold small text-dark mb-1">${item.name}</div>
                    <div class="d-flex align-items-center">
                        <span class="text-primary fw-bold small me-3 cursor-pointer btn-edit-price">
                            ${item.customPrice.toLocaleString()}đ <i class="bi bi-gear-fill ms-1" style="font-size: 10px;"></i>
                        </span>
                        <div class="d-flex align-items-center bg-light rounded px-2 border">
                            <button class="btn btn-link btn-sm text-decoration-none p-0 fw-bold btn-minus">-</button>
                            <input type="text" class="qty-input bg-transparent border-0 mx-2 text-center" style="width:30px; font-size:13px" value="${item.qty}" readonly>
                            <button class="btn btn-link btn-sm text-decoration-none p-0 fw-bold btn-plus">+</button>
                        </div>
                    </div>
                </div>
                <div class="text-end">
                    <div class="text-danger fw-bold mb-1">${itemTotal.toLocaleString()}đ</div>
                    <i class="bi bi-trash3 text-muted cursor-pointer btn-remove"></i>
                </div>
            </div>
        `;

    row.querySelector(".btn-minus").onclick = () => updateQty(index, -1);
    row.querySelector(".btn-plus").onclick = () => updateQty(index, 1);
    row.querySelector(".btn-remove").onclick = () => removeItem(index);
    // Nếu Duy có modal sửa giá thì mở dòng dưới
    // row.querySelector('.btn-edit-price').onclick = () => openPriceModal(index);

    cartList.appendChild(row);
  });

  document.getElementById("subtotal").innerText =
    subtotal.toLocaleString() + "đ";
  calculateTotal();
}

// --- CÁC HÀM CẬP NHẬT ---

window.updateQty = (idx, delta) => {
  cart[idx].qty = Math.max(1, cart[idx].qty + delta);
  renderCart();
};

window.removeItem = (idx) => {
  cart.splice(idx, 1);
  renderCart();
};

function calculateTotal() {
  const subText = document.getElementById("subtotal").innerText;
  const sub = parseInt(subText.replace(/\D/g, "")) || 0;
  const fee = parseInt(document.getElementById("extra-fee").value) || 0;
  const dis = parseInt(document.getElementById("order-discount").value) || 0;
  const final = sub + fee - dis;
  document.getElementById("total-final").innerText =
    final.toLocaleString() + "đ";
}
