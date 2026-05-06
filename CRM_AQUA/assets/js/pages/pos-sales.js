const products = [
  { id: 1, name: "Men vi sinh Eco-Pro", code: "MEN02", price: 350000 },
  { id: 2, name: "AquaClean Pro - Xử lý đáy", code: "AQ001", price: 150000 },
  { id: 3, name: "Thuốc tím khử trùng", code: "TIM01", price: 85000 },
];

let cart = [];
let currentCustomer = null;
let selectedPaymentMethod = "cash";

document.addEventListener("DOMContentLoaded", () => {
  initSearchProduct();
  initSearchCustomer();
  loadProvinces();
  document
    .getElementById("extra-fee")
    .addEventListener("input", calculateTotal);
  document
    .getElementById("order-discount")
    .addEventListener("input", calculateTotal);
  initPaymentMethodSelection();
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
  const existingIndex = cart.findIndex((item) => item.id === product.id);

  if (existingIndex !== -1) {
    cart[existingIndex].qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      code: product.code,
      customPrice: product.price,
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

const mockCustomers = [
  { id: 101, name: "Chú Tám (Sóc Trăng)", phone: "0901234567" },
  { id: 102, name: "Anh Bảy (Trần Đề)", phone: "0988777666" },
  { id: 103, name: "Chị Năm (Vĩnh Châu)", phone: "0911222333" },
];

function initSearchCustomer() {
  const custInput = document.getElementById("search-customer");
  let resultsContainer = document.getElementById("customer-results-container");

  if (!resultsContainer) {
    resultsContainer = document.createElement("div");
    resultsContainer.id = "customer-results-container";
    resultsContainer.className = "d-none";
    custInput.closest(".input-group").style.position = "relative";
    custInput.closest(".input-group").appendChild(resultsContainer);
  }

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

    html += `
            <div class="customer-item add-new-cust-item text-center py-2" onclick="openAddCustomerModal()">
                <i class="bi bi-plus-lg me-1"></i> Thêm khách hàng mới
            </div>
        `;

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
  if (modalEl) {
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  } else {
    alert("Chưa có Modal Thêm khách hàng trong HTML!");
  }
};

window.saveNewCustomer = function () {
  const inputs = document.querySelectorAll(
    "#formAddCustomer .form-control, #formAddCustomer .form-select",
  );
  inputs.forEach((el) => el.classList.remove("is-invalid", "shake-error"));

  let hasError = false;
  const name = document.getElementById("new-cust-name");
  const phone = document.getElementById("new-cust-phone");

  // Lấy các element select địa chỉ
  const provinceEl = document.getElementById("new-cust-province");
  const districtEl = document.getElementById("new-cust-district");
  const wardEl = document.getElementById("new-cust-ward");
  const addressDetail = document.getElementById("new-cust-address");
  const staff = document.getElementById("new-cust-staff");

  // Kiểm tra nhanh các trường bắt buộc
  if (name.value.trim() === "") {
    name.classList.add("is-invalid", "shake-error");
    hasError = true;
  }
  if (provinceEl.value === "") {
    provinceEl.classList.add("is-invalid", "shake-error");
    hasError = true;
  }

  if (hasError) return;

  // --- PHẦN QUAN TRỌNG: GỘP ĐỊA CHỈ ---
  // Lấy text hiển thị của option được chọn thay vì lấy ID/Code
  const provinceText = provinceEl.options[provinceEl.selectedIndex].text;
  const districtText =
    districtEl.value !== ""
      ? districtEl.options[districtEl.selectedIndex].text
      : "";
  const wardText =
    wardEl.value !== "" ? wardEl.options[wardEl.selectedIndex].text : "";

  // Tạo chuỗi địa chỉ đầy đủ
  let fullAddress = addressDetail.value.trim();
  if (wardText) fullAddress += (fullAddress ? ", " : "") + wardText;
  if (districtText) fullAddress += (fullAddress ? ", " : "") + districtText;
  if (provinceText) fullAddress += (fullAddress ? ", " : "") + provinceText;

  const newCustomer = {
    id: Date.now(),
    name: name.value.trim(),
    phone: phone.value.trim(),
    address: fullAddress, // Lưu địa chỉ đã gộp vào đây
    staff: staff.value.trim() || "Chưa phân công",
  };

  mockCustomers.push(newCustomer);
  currentCustomer = newCustomer;
  renderCustomerCard(newCustomer);

  Swal.fire({
    icon: "success",
    title: "Thành công!",
    text: "Đã thêm khách hàng với địa chỉ đầy đủ",
    showConfirmButton: false,
    timer: 1500,
  });

  document.getElementById("formAddCustomer").reset();
  bootstrap.Modal.getInstance(
    document.getElementById("addCustomerModal"),
  ).hide();
};

const provinceSelect = document.getElementById("new-cust-province");
const districtSelect = document.getElementById("new-cust-district");
const wardSelect = document.getElementById("new-cust-ward");

async function loadProvinces() {
  try {
    const response = await fetch("https://provinces.open-api.vn/api/p/");
    const data = await response.json();
    data.forEach((p) => {
      let opt = document.createElement("option");
      opt.value = p.code;
      opt.text = p.name;
      provinceSelect.add(opt);
    });
  } catch (error) {
    console.error("Lỗi lấy tỉnh thành:", error);
  }
}

provinceSelect.addEventListener("change", async function () {
  districtSelect.innerHTML = '<option value="">-- Chọn Huyện --</option>';
  wardSelect.innerHTML = '<option value="">-- Chọn Xã --</option>';
  wardSelect.disabled = true;

  if (!this.value) {
    districtSelect.disabled = true;
    return;
  }

  try {
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
  } catch (error) {
    console.error("Lỗi lấy huyện:", error);
  }
});

districtSelect.addEventListener("change", async function () {
  wardSelect.innerHTML = '<option value="">-- Chọn Xã --</option>';

  if (!this.value) {
    wardSelect.disabled = true;
    return;
  }

  try {
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
  } catch (error) {
    console.error("Lỗi lấy xã:", error);
  }
});

window.selectCustomer = function (customer) {
  if (currentCustomer) {
    Swal.fire({
      title: "Thông báo!",
      text: "Mỗi hóa đơn chỉ xuất được cho 1 khách hàng. Duy vui lòng xóa khách cũ trước khi chọn khách mới nhé!",
      icon: "warning",
      confirmButtonText: "Đã hiểu",
      confirmButtonColor: "#0d6efd",
      timer: 4000,
    });
    return;
  }

  const resultsContainer = document.getElementById(
    "customer-results-container",
  );
  const custInput = document.getElementById("search-customer");

  currentCustomer = customer;
  renderCustomerCard(customer);

  resultsContainer.classList.add("d-none");
  custInput.value = "";
};

function renderCustomerCard(customer) {
  const infoBox = document.getElementById("customer-info");
  infoBox.innerHTML = `
        <div class="text-start p-3 bg-white rounded border border-primary position-relative shadow-sm w-100 animate__animated animate__fadeIn">
            <button type="button" class="btn-close position-absolute" 
                    style="top: 10px; right: 10px; z-index: 10;" 
                    onclick="removeCustomer()"></button>
            <div class="fw-bold text-primary mb-1">
                <i class="bi bi-person-badge-fill me-2"></i>${customer.name}
            </div>
            <div class="small text-muted mb-1">
                <i class="bi bi-telephone-fill me-2"></i>${customer.phone}
            </div>
            <div class="x-small text-muted border-top pt-2 mt-2">
                <i class="bi bi-geo-alt-fill me-1"></i>${customer.address || "Chưa có địa chỉ"}
            </div>
            <div class="badge bg-light text-primary border mt-2 fw-normal" style="font-size: 10px;">
                NV: ${customer.staff || "Chưa phân công"}
            </div>
        </div>
    `;
}

window.removeCustomer = function () {
  currentCustomer = null;
  document.getElementById("customer-info").innerHTML = `
        <i class="bi bi-person-plus fs-2 text-muted"></i>
        <p class="small text-muted mb-0 mt-2">Chưa có thông tin khách hàng</p>
    `;
};

// Hàm xử lý việc chọn nút thanh toán
function initPaymentMethodSelection() {
  const paymentButtons = document.querySelectorAll("#payment-methods button");

  paymentButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Xóa class active (btn-primary) và trả về btn-outline-primary cho tất cả
      paymentButtons.forEach((b) => {
        b.classList.remove("btn-primary");
        b.classList.add("btn-outline-primary");
      });

      // Kích hoạt nút được chọn
      btn.classList.remove("btn-outline-primary");
      btn.classList.add("btn-primary");

      // Lưu giá trị phương thức thanh toán
      selectedPaymentMethod = btn.getAttribute("data-method");
    });
  });
}

// Cập nhật lại hàm tạo đơn hàng của Duy
window.createOrder = function () {
  if (cart.length === 0) {
    Swal.fire("Lỗi!", "Vui lòng chọn sản phẩm trước khi thanh toán.", "error");
    return;
  }

  if (!currentCustomer) {
    Swal.fire("Thông báo", "Vui lòng chọn hoặc thêm khách hàng.", "warning");
    return;
  }

  const totalMoney = document.getElementById("total-final").innerText;
  const amount = totalMoney.replace(/\D/g, "");

  if (selectedPaymentMethod === "cash") {
    // Trường hợp tiền mặt: Thông báo thành công luôn
    Swal.fire({
      icon: "success",
      title: "Tạo đơn thành công!",
      text: `Đơn hàng của ${currentCustomer.name} đã được ghi nhận bằng tiền mặt.`,
      confirmButtonColor: "#0d6efd",
    }).then(() => {
      location.reload(); // Reset lại trang sau khi xong
    });
  } else if (selectedPaymentMethod === "momo") {
    // XỬ LÝ MOMO SANDBOX
    // Link QR MoMo Test (Đây là link mẫu để quét ra thông tin thanh toán test)
    const momoTestQR = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=2|99|0901234567|MoMo_Sandbox|${amount}|0|0|CRM_AQUA_PAYMENT`;

    Swal.fire({
      title:
        '<img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" width="40"> Thanh toán MoMo',
      html: `
                <div class="text-center">
                    <p class="mb-2">Số tiền test: <b class="text-danger fs-4">${totalMoney}</b></p>
                    <div class="bg-light p-3 rounded mb-3">
                        <img src="${momoTestQR}" class="img-fluid" style="max-width: 200px;">
                    </div>
                    <div class="alert alert-warning py-2 x-small">
                        <i class="bi bi-info-circle me-1"></i> Duy hãy dùng App MoMo quét mã này để test luồng nhé!
                    </div>
                </div>
            `,
      showCancelButton: true,
      confirmButtonText: "Đã hoàn tất thanh toán",
      confirmButtonColor: "#af2070", // Màu tím MoMo
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          "Thành công",
          "Đơn hàng đã được thanh toán qua MoMo Sandbox",
          "success",
        ).then(() => location.reload());
      }
    });
  } else {
    // Trường hợp VietQR hoặc VNPay: Hiện mã QR để quét
    let qrUrl = "";
    if (selectedPaymentMethod === "vietqr") {
      // Demo link VietQR (Duy có thể thay bằng API ngân hàng thật sau này)
      qrUrl =
        "https://img.vietqr.io/image/970423-123456789-compact.jpg?amount=" +
        totalMoney.replace(/\D/g, "");
    } else {
      // Demo VNPay
      qrUrl =
        "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=VNPAY_PAYMENT";
    }

    Swal.fire({
      title: "Quét mã thanh toán",
      html: `
                <div class="text-center">
                    <p class="mb-2">Tổng tiền: <b class="text-danger fs-4">${totalMoney}</b></p>
                    <img src="${qrUrl}" class="img-fluid rounded mb-3" style="max-width: 250px;" alt="QR Code">
                    <p class="small text-muted">Vui lòng quét mã qua ứng dụng ngân hàng của bạn</p>
                </div>
            `,
      showCancelButton: true,
      confirmButtonText: "Xác nhận đã chuyển khoản",
      cancelButtonText: "Hủy bỏ",
      confirmButtonColor: "#0d6efd",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          "Thành công!",
          "Hệ thống đang kiểm tra giao dịch.",
          "success",
        ).then(() => {
          location.reload();
        });
      }
    });
  }
};
