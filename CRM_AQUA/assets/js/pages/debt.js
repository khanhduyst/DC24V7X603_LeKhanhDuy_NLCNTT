function collectMoney(id) {
  const row = event.target.closest("tr");
  const name = row.cells[0].querySelector(".fw-bold").innerText;
  const currentDebt = row.cells[2].querySelector(".fw-bold").innerText;

  Swal.fire({
    title: '<h5 class="fw-bold mb-0">THU HỒI CÔNG NỢ</h5>',
    html: `
            <div class="text-start p-2">
                <p class="mb-2 small">Khách hàng: <strong>${name}</strong></p>
                <p class="mb-3 small text-danger">Dư nợ hiện tại: <strong>${currentDebt}</strong></p>
                
                <label class="small fw-bold mb-1">Số tiền thu được (VNĐ)</label>
                <input type="number" id="payAmount" class="form-control mb-3 py-2 border-0 bg-light" placeholder="Ví dụ: 10000000">
                
                <label class="small fw-bold mb-1">Hình thức thanh toán</label>
                <select id="payMethod" class="form-select mb-3 py-2 border-0 bg-light">
                    <option value="cash">Tiền mặt</option>
                    <option value="transfer">Chuyển khoản</option>
                </select>

                <label class="small fw-bold mb-1">Ghi chú nhanh</label>
                <textarea id="payNote" class="form-control border-0 bg-light" rows="2" placeholder="Khách hẹn ngày..."></textarea>
            </div>
        `,
    confirmButtonText: "Xác nhận thu tiền",
    confirmButtonColor: "#198754",
    cancelButtonText: "Hủy",
    showCancelButton: true,
    reverseButtons: true,
    preConfirm: () => {
      const amount = document.getElementById("payAmount").value;
      if (!amount || amount <= 0) {
        Swal.showValidationMessage("Vui lòng nhập số tiền thu thực tế!");
      }
      return {
        amount: amount,
        method: document.getElementById("payMethod").value,
        note: document.getElementById("payNote").value,
      };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        "Thành công!",
        "Đã cập nhật phiếu thu vào hệ thống.",
        "success",
      );
    }
  });
}

window.sortDebtList = function () {
  const sortBy = document.getElementById("sortDebt").value;
  const tbody = document.querySelector("table tbody");

  if (!tbody || sortBy === "none") return;

  const rows = Array.from(tbody.querySelectorAll("tr"));

  rows.sort((a, b) => {
    const getDebt = (row) => {
      const div = row.cells[2].querySelector(".fw-bold");
      return div ? parseFloat(div.innerText.replace(/[^0-9.-]+/g, "")) : 0;
    };

    const getDays = (row) => {
      const badge = row.cells[3].querySelector(".badge");
      if (!badge) return 0;
      const num = badge.innerText.match(/\d+/);
      return num ? parseInt(num[0]) : 0;
    };

    if (sortBy === "high-to-low") return getDebt(b) - getDebt(a);
    if (sortBy === "oldest") return getDays(b) - getDays(a);

    if (sortBy === "over-limit") {
      const isA = a.querySelector(".bg-danger") ? 1 : 0;
      const isB = b.querySelector(".bg-danger") ? 1 : 0;
      return isB - isA;
    }

    if (sortBy === "safety") {
      const isA = a.querySelector(".bg-success") ? 1 : 0;
      const isB = b.querySelector(".bg-success") ? 1 : 0;
      return isB - isA;
    }

    return 0;
  });

  tbody.innerHTML = "";
  rows.forEach((row) => tbody.appendChild(row));

  tbody.style.backgroundColor = "#d1e7dd";
  setTimeout(() => {
    tbody.style.backgroundColor = "transparent";
  }, 500);
};

window.formatMoneyInput = function (input) {
  let value = input.value.replace(/[^0-9]/g, "");
  document.getElementById("payAmountReal").value = value;
  if (value !== "") {
    input.value = Number(value).toLocaleString("en-US");
  } else {
    input.value = "";
  }
  window.generateQR();
};

function collectMoney(id) {
  const row = event.target.closest("tr");
  const name = row.cells[0].querySelector(".fw-bold").innerText;
  const debtStr = row.cells[2].querySelector(".fw-bold").innerText;

  const rawDebt = parseFloat(debtStr.replace(/[^0-9.-]+/g, ""));
  const debtAmount = debtStr.includes("M") ? rawDebt * 1000000 : rawDebt;

  const BANK_ID = "vietcombank";
  const ACCOUNT_NO = "123456789";
  const ACCOUNT_NAME = "CONG TY AQUA SOC TRANG";

  Swal.fire({
    title: '<h6 class="fw-bold text-primary">THU HỒI CÔNG NỢ</h6>',
    html: `
            <div class="text-start p-1" style="font-size: 0.9rem;">
                <div class="bg-light p-2 rounded mb-3 border-start border-primary border-4">
                    <div class="d-flex justify-content-between"><span>Khách:</span><strong>${name}</strong></div>
                    <div class="d-flex justify-content-between"><span>Dư nợ:</span><strong class="text-danger">${debtAmount.toLocaleString()}đ</strong></div>
                </div>

                <label class="fw-bold mb-1">Số tiền thu được (VNĐ)</label>
                <input type="text" id="payAmountDisplay" class="form-control mb-2 py-2 fw-bold text-primary" placeholder="0" oninput="formatMoneyInput(this)">
                <input type="hidden" id="payAmountReal">
                
                <div class="d-flex gap-1 mb-3 flex-wrap">
                    <button type="button" class="btn btn-outline-secondary btn-sm flex-grow-1" onclick="setAmount(${debtAmount})">Trả hết</button>
                    <button type="button" class="btn btn-outline-secondary btn-sm flex-grow-1" onclick="setAmount(${debtAmount / 2})">50%</button>
                    <button type="button" class="btn btn-outline-secondary btn-sm flex-grow-1" onclick="setAmount(10000000)">10M</button>
                    <button type="button" class="btn btn-outline-secondary btn-sm flex-grow-1" onclick="setAmount(50000000)">50M</button>
                </div>

                <label class="fw-bold mb-1">Hình thức thanh toán</label>
                <select id="payMethod" class="form-select mb-3 py-2" onchange="togglePayView()">
                    <option value="cash">💵 Tiền mặt</option>
                    <option value="transfer">🏦 Chuyển khoản (Quét QR)</option>
                </select>

                <div id="qrArea" class="text-center p-3 border rounded-4 bg-white shadow-sm" style="display: none;">
                    <img id="qrImage" src="" class="img-fluid rounded mb-2" style="max-width: 180px;">
                    <div class="alert alert-warning py-1 small mb-0">
                        Nội dung: <strong id="qrContent"></strong>
                    </div>
                </div>
            </div>
        `,
    confirmButtonText: "Xác nhận đã thu tiền",
    showCancelButton: true,
    confirmButtonColor: "#198754",
    cancelButtonText: "Đóng",
    didOpen: () => {
      window.setAmount = function (val) {
        const displayInput = document.getElementById("payAmountDisplay");
        const realInput = document.getElementById("payAmountReal");
        const roundedVal = Math.round(val);
        realInput.value = roundedVal;
        displayInput.value = roundedVal.toLocaleString("en-US");
        window.generateQR();
      };

      window.togglePayView = function () {
        const method = document.getElementById("payMethod").value;
        document.getElementById("qrArea").style.display =
          method === "transfer" ? "block" : "none";
        if (method === "transfer") generateQR();
      };

      window.generateQR = function () {
        const amount = document.getElementById("payAmountReal").value || 0;
        const description = `THU NO ${name
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/đ/g, "d")
          .toUpperCase()}`;
        const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;
        document.getElementById("qrImage").src = qrUrl;
        document.getElementById("qrContent").innerText = description;
      };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const finalAmount = Number(
        document.getElementById("payAmountReal").value,
      ).toLocaleString("vi-VN");
      const method =
        document.getElementById("payMethod").value === "cash"
          ? "Tiền mặt"
          : "Chuyển khoản";

      Swal.fire({
        title: "THU TIỀN THÀNH CÔNG!",
        html: `
                    <div class="py-3 text-center">
                        <i class="bi bi-check-circle-fill text-success" style="font-size: 4rem;"></i>
                        <h3 class="mt-3 fw-bold text-success">+ ${finalAmount}đ</h3>
                        <p class="text-muted">Hình thức: <strong>${method}</strong></p>
                    </div>
                `,
        confirmButtonText: "Xong",
        confirmButtonColor: "#198754",
      });
    }
  });
}

function viewHistory(id) {
    const row = event.target.closest('tr');
    const name = row.cells[0].querySelector('.fw-bold').innerText;
    const currentDebt = row.cells[2].querySelector('.fw-bold').innerText;

    Swal.fire({
        title: `<div class="mb-2"><span class="text-primary fw-bold">LỊCH SỬ CÔNG NỢ</span><br><small class="text-muted">${name}</small></div>`,
        width: '500px',
        showConfirmButton: false,
        html: `
            <div class="d-flex gap-2 justify-content-center mb-4">
                <button class="btn btn-sm rounded-pill px-3 filter-hist active" onclick="filterHistory('all', this)">Tất cả</button>
                <button class="btn btn-sm rounded-pill px-3 filter-hist" onclick="filterHistory('order', this)">Đơn hàng</button>
                <button class="btn btn-sm rounded-pill px-3 filter-hist" onclick="filterHistory('pay', this)">Phiếu thu</button>
            </div>

            <div class="text-start p-1" style="max-height: 380px; overflow-y: auto;">
                <div class="timeline-debt">
                    <div class="hist-item pay">
                        <div class="icon-node border-success text-success"><i class="bi bi-cash"></i></div>
                        <div class="hist-content">
                            <div>
                                <div class="fw-bold text-success small">THU NỢ (CK)</div>
                                <div class="text-muted" style="font-size: 11px;">"Thanh toán đợt 2"</div>
                            </div>
                            <div class="text-end">
                                <div class="fw-bold text-success">- 15.000.000</div>
                                <div class="text-muted" style="font-size: 10px;">10/05/2026</div>
                            </div>
                        </div>
                    </div>

                    <div class="hist-item order">
                        <div class="icon-node border-warning text-warning"><i class="bi bi-cart"></i></div>
                        <div class="hist-content">
                            <div>
                                <div class="fw-bold text-warning small">ĐƠN HÀNG #102</div>
                                <div class="text-muted" style="font-size: 11px;">Thuốc & Thức ăn</div>
                            </div>
                            <div class="text-end">
                                <div class="fw-bold text-danger">+ 120.000.000</div>
                                <div class="text-muted" style="font-size: 10px;">05/05/2026</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="summary-box mt-3 p-3 shadow-sm rounded-4 bg-light">
                    <div class="d-flex justify-content-between mb-2">
                        <span class="text-muted small">Tổng phát sinh:</span>
                        <span class="fw-bold text-danger">+ 665.000.000đ</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span class="text-muted small">Tổng đã trả:</span>
                        <span class="fw-bold text-success">- 120.000.000đ</span>
                    </div>
                    <hr class="my-2 border-secondary opacity-25">
                    <div class="d-flex justify-content-between align-items-center mt-2">
                        <span class="fw-bold">CÒN NỢ:</span>
                        <span class="h4 fw-bold text-primary mb-0">950.000.000đ</span>
                    </div>
                </div>
            </div>
            <button class="btn btn-secondary w-100 mt-3 rounded-pill" onclick="Swal.close()">Đóng</button>
        `
    });
}

window.filterHistory = function(type, btn) {
    // 1. Cập nhật màu nút
    document.querySelectorAll('.filter-hist').forEach(b => {
        b.classList.remove('active', 'btn-primary', 'text-white');
        b.classList.add('btn-outline-secondary'); // Trả về màu mặc định
    });
    
    // 2. Active nút đang bấm
    btn.classList.add('active', 'btn-primary', 'text-white');
    btn.classList.remove('btn-outline-secondary');

    // 3. Ẩn hiện các dòng timeline
    const items = document.querySelectorAll('.hist-item');
    items.forEach(item => {
        if (type === 'all' || item.classList.contains(type)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
};