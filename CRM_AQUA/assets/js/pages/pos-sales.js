const products = [
  { id: 1, name: "Men vi sinh Eco-Pro", code: "MEN02", price: 350000 },
  { id: 2, name: "AquaClean Pro - Xử lý đáy", code: "AQ001", price: 150000 },
  { id: 3, name: "Thuốc tím khử trùng", code: "TIM01", price: 85000 },
];

let cart = [];
let currentCustomer = null;
let selectedPaymentMethod = "cash";
let editingIndex = null;

document.addEventListener("DOMContentLoaded", () => {
  initSearchProduct();
  initSearchCustomer();
  loadProvinces();
  initPaymentMethodSelection();

  document
    .getElementById("extra-fee")
    .addEventListener("input", calculateTotal);
  document
    .getElementById("order-discount")
    .addEventListener("input", calculateTotal);
});

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
      resultsBox.innerHTML = "";
      filtered.forEach((p) => {
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
        item.addEventListener("click", () => handleSelectProduct(p));
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
  const existingIndex = cart.findIndex((item) => item.id === product.id);
  if (existingIndex !== -1) {
    cart[existingIndex].qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      code: product.code,
      originPrice: product.price, // Lưu lại giá gốc cố định
      customPrice: product.price, // Giá này có thể thay đổi
      qty: 1,
    });
  }
  document.getElementById("search-results").classList.add("d-none");
  document.getElementById("search-product").value = "";
  renderCart();
}

function renderCart() {
  const cartList = document.getElementById("cart-list");
  const emptyMsg = document.getElementById("cart-empty");

  if (cart.length === 0) {
    if (emptyMsg) emptyMsg.classList.remove("d-none");
    cartList.innerHTML = "";
    if (emptyMsg) cartList.appendChild(emptyMsg);
    document.getElementById("subtotal").innerText = "0đ";
    calculateTotal();
    return;
  }

  if (emptyMsg) emptyMsg.classList.add("d-none");

  let subtotal = 0;
  cartList.innerHTML = "";

  cart.forEach((item, index) => {
    const itemTotal = item.qty * item.customPrice;
    subtotal += itemTotal;

    // Logic hiển thị giá gốc nếu có thay đổi
    let priceHTML = `<span class="text-primary fw-bold small me-2">${item.customPrice.toLocaleString()}đ</span>`;
    if (item.customPrice !== item.originPrice) {
      priceHTML = `
        <span class="text-muted small text-decoration-line-through me-2">${item.originPrice.toLocaleString()}đ</span>
        <span class="text-danger fw-bold small me-2">${item.customPrice.toLocaleString()}đ</span>
      `;
    }

    const row = document.createElement("div");
    row.className = "cart-item border-bottom py-3";
    row.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <div style="flex: 1;">
          <div class="fw-bold small text-dark mb-1">${item.name}</div>
          <div class="d-flex align-items-center">
            <div class="cursor-pointer d-flex align-items-center" onclick="openEditPriceModal(${index})">
              ${priceHTML}
              <i class="bi bi-gear-fill text-muted" style="font-size: 10px;"></i>
            </div>
            <div class="ms-3 d-flex align-items-center bg-light rounded px-2 border">
              <button class="btn btn-link btn-sm text-decoration-none p-0 fw-bold" onclick="updateQty(${index}, -1)">-</button>
              <input type="text" class="qty-input bg-transparent border-0 mx-2 text-center" style="width:30px; font-size:13px" value="${item.qty}" readonly>
              <button class="btn btn-link btn-sm text-decoration-none p-0 fw-bold" onclick="updateQty(${index}, 1)">+</button>
            </div>
          </div>
        </div>
        <div class="text-end">
          <div class="text-danger fw-bold mb-1">${itemTotal.toLocaleString()}đ</div>
          <i class="bi bi-trash3 text-muted cursor-pointer" onclick="removeItem(${index})"></i>
        </div>
      </div>
    `;
    cartList.appendChild(row);
  });

  document.getElementById("subtotal").innerText =
    subtotal.toLocaleString() + "đ";
  calculateTotal();
}

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

function initSearchCustomer() {
  const custInput = document.getElementById("search-customer");
  let resultsContainer = document.getElementById("customer-results-container");

  custInput.addEventListener("input", (e) => {
    const key = e.target.value.trim().toLowerCase();
    if (key === "") {
      resultsContainer.classList.add("d-none");
      return;
    }
    const filtered = mockCustomers.filter(
      (c) => c.name.toLowerCase().includes(key) || c.phone.includes(key),
    );
    resultsContainer.classList.remove("d-none");
    let html = filtered
      .map(
        (c) => `
      <div class="customer-item" onclick='selectCustomer(${JSON.stringify(c)})'>
        <div class="fw-bold small text-dark">${c.name}</div>
        <div class="x-small text-muted">${c.phone}</div>
      </div>
    `,
      )
      .join("");
    html += `<div class="customer-item add-new-cust-item text-center py-2" onclick="openAddCustomerModal()"><i class="bi bi-plus-lg me-1"></i> Thêm mới</div>`;
    resultsContainer.innerHTML = html;
  });

  document.addEventListener("click", (e) => {
    if (!custInput.contains(e.target) && !resultsContainer.contains(e.target)) {
      resultsContainer.classList.add("d-none");
    }
  });
}

window.openAddCustomerModal = function () {
  const modalEl = document.getElementById("addCustomerModal");
  if (modalEl) new bootstrap.Modal(modalEl).show();
};

window.saveNewCustomer = function () {
  const name = document.getElementById("new-cust-name");
  const phone = document.getElementById("new-cust-phone");
  const provinceEl = document.getElementById("new-cust-province");
  const districtEl = document.getElementById("new-cust-district");
  const wardEl = document.getElementById("new-cust-ward");
  const addressDetail = document.getElementById("new-cust-address");
  const staff = document.getElementById("new-cust-staff");

  if (!name.value.trim() || !provinceEl.value) {
    Swal.fire("Lỗi", "Vui lòng nhập tên và tỉnh thành!", "error");
    return;
  }

  const provinceText = provinceEl.options[provinceEl.selectedIndex].text;
  const districtText = districtEl.value
    ? districtEl.options[districtEl.selectedIndex].text
    : "";
  const wardText = wardEl.value
    ? wardEl.options[wardEl.selectedIndex].text
    : "";

  let fullAddress = addressDetail.value.trim();
  if (wardText) fullAddress += (fullAddress ? ", " : "") + wardText;
  if (districtText) fullAddress += (fullAddress ? ", " : "") + districtText;
  if (provinceText) fullAddress += (fullAddress ? ", " : "") + provinceText;

  const newCustomer = {
    id: Date.now(),
    name: name.value.trim(),
    phone: phone.value.trim(),
    address: fullAddress,
    staff: staff.value.trim() || "Chưa phân công",
  };

  mockCustomers.push(newCustomer);
  currentCustomer = newCustomer;
  renderCustomerCard(newCustomer);
  Swal.fire({
    icon: "success",
    title: "Thành công!",
    timer: 1500,
    showConfirmButton: false,
  });
  document.getElementById("formAddCustomer").reset();
  bootstrap.Modal.getInstance(
    document.getElementById("addCustomerModal"),
  ).hide();
};

async function loadProvinces() {
  try {
    const response = await fetch("https://provinces.open-api.vn/api/p/");
    const data = await response.json();
    const provinceSelect = document.getElementById("new-cust-province");
    data.forEach((p) => {
      let opt = document.createElement("option");
      opt.value = p.code;
      opt.text = p.name;
      provinceSelect.add(opt);
    });
  } catch (error) {
    console.error(error);
  }
}

document
  .getElementById("new-cust-province")
  .addEventListener("change", async function () {
    const districtSelect = document.getElementById("new-cust-district");
    const wardSelect = document.getElementById("new-cust-ward");
    districtSelect.innerHTML = '<option value="">-- Chọn Huyện --</option>';
    wardSelect.innerHTML = '<option value="">-- Chọn Xã --</option>';
    if (!this.value) return;
    const response = await fetch(
      `https://provinces.open-api.vn/api/p/${this.value}?depth=2`,
    );
    const data = await response.json();
    data.districts.forEach((d) => {
      let opt = document.createElement("option");
      opt.value = d.code;
      opt.text = d.name;
      districtSelect.add(opt);
    });
    districtSelect.disabled = false;
  });

document
  .getElementById("new-cust-district")
  .addEventListener("change", async function () {
    const wardSelect = document.getElementById("new-cust-ward");
    wardSelect.innerHTML = '<option value="">-- Chọn Xã --</option>';
    if (!this.value) return;
    const response = await fetch(
      `https://provinces.open-api.vn/api/d/${this.value}?depth=2`,
    );
    const data = await response.json();
    data.wards.forEach((w) => {
      let opt = document.createElement("option");
      opt.value = w.code;
      opt.text = w.name;
      wardSelect.add(opt);
    });
    wardSelect.disabled = false;
  });

window.selectCustomer = function (customer) {
  if (currentCustomer) {
    Swal.fire({
      title: "Thông báo!",
      text: "Xóa khách cũ trước khi chọn khách mới!",
      icon: "warning",
    });
    return;
  }
  currentCustomer = customer;
  renderCustomerCard(customer);
  document.getElementById("customer-results-container").classList.add("d-none");
  document.getElementById("search-customer").value = "";
};

function renderCustomerCard(customer) {
  document.getElementById("customer-info").innerHTML = `
    <div class="text-start p-3 bg-white rounded border border-primary position-relative shadow-sm w-100">
      <button type="button" class="btn-close position-absolute" style="top: 10px; right: 10px;" onclick="removeCustomer()"></button>
      <div class="fw-bold text-primary mb-1"><i class="bi bi-person-badge-fill me-2"></i>${customer.name}</div>
      <div class="small text-muted mb-1"><i class="bi bi-telephone-fill me-2"></i>${customer.phone}</div>
      <div class="x-small text-muted border-top pt-2 mt-2"><i class="bi bi-geo-alt-fill me-1"></i>${customer.address || "Chưa có địa chỉ"}</div>
    </div>
  `;
}

window.removeCustomer = function () {
  currentCustomer = null;
  document.getElementById("customer-info").innerHTML =
    `<i class="bi bi-person-plus fs-2 text-muted"></i><p class="small text-muted mb-0 mt-2">Chưa có thông tin khách hàng</p>`;
};

function initPaymentMethodSelection() {
  const paymentButtons = document.querySelectorAll("#payment-methods button");
  paymentButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      paymentButtons.forEach((b) => {
        b.classList.remove("btn-primary");
        b.classList.add("btn-outline-primary");
      });
      btn.classList.remove("btn-outline-primary");
      btn.classList.add("btn-primary");
      selectedPaymentMethod = btn.getAttribute("data-method");
    });
  });
}

window.createOrder = function () {
  if (cart.length === 0 || !currentCustomer) {
    Swal.fire("Lỗi!", "Vui lòng chọn sản phẩm và khách hàng!", "error");
    return;
  }

  const totalMoney = document.getElementById("total-final").innerText;
  const amount = totalMoney.replace(/\D/g, "");

  if (selectedPaymentMethod === "cash") {
    Swal.fire({
      icon: "success",
      title: "Tạo đơn thành công!",
      text: "Đơn hàng thanh toán tiền mặt đã được ghi nhận.",
      confirmButtonColor: "#0d6efd",
    }).then(() => {
      location.reload();
    });
  } else {
    let qrUrl = "";
    if (selectedPaymentMethod === "momo") {
      qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=2|99|0901234567|MoMo_Sandbox|${amount}|0|0|CRM_AQUA`;
    } else {
      qrUrl = `https://img.vietqr.io/image/970423-123456789-compact.jpg?amount=${amount}&addInfo=AQUA_${currentCustomer.phone}`;
    }

    Swal.fire({
      title: "Quét mã thanh toán",
      html: `
        <div class="text-center">
            <p class="mb-2">Phương thức: <b class="text-primary">${selectedPaymentMethod.toUpperCase()}</b></p>
            <p class="mb-2">Tổng tiền: <b class="text-danger fs-4">${totalMoney}</b></p>
            <div class="p-2 border rounded bg-white d-inline-block mb-3">
                <img src="${qrUrl}" class="img-fluid" style="max-width: 250px;">
            </div>
            <p class="small text-muted">Vui lòng quét mã qua ứng dụng Ngân hàng/Ví điện tử</p>
        </div>`,
      showCancelButton: true,
      confirmButtonText: "Xác nhận đã chuyển khoản",
      cancelButtonText: "Hủy bỏ",
      confirmButtonColor: "#0d6efd",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "Thành công!",
          text: "Hệ thống đã xác nhận đơn hàng.",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          location.reload();
        });
      }
    });
  }
};
window.openEditPriceModal = function (index) {
  editingIndex = index;
  const item = cart[index];
  document.getElementById("modal-product-name").innerText = item.name;
  document.getElementById("new-price-input").value = item.customPrice;
  new bootstrap.Modal(document.getElementById("priceModal")).show();
};

window.confirmNewPrice = function () {
  const newPrice = parseInt(document.getElementById("new-price-input").value);
  if (isNaN(newPrice) || newPrice < 0) return;
  cart[editingIndex].customPrice = newPrice;
  bootstrap.Modal.getInstance(document.getElementById("priceModal")).hide();
  renderCart();
};

const mockCustomers = [
  { id: 101, name: "Chú Tám (Sóc Trăng)", phone: "0901234567" },
  { id: 102, name: "Anh Bảy (Trần Đề)", phone: "0988777666" },
];
