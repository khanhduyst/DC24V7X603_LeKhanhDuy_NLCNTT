let currentPage = 1;
const rowsPerPage = 2;
let filteredData = [];

const historyData = [
  {
    time: "2026-05-05 10:30",
    code: "AQ-001",
    name: "AquaClean Pro",
    type: "Bán hàng",
    change: -5,
    balance: 145,
    user: "Duy (Admin)",
    note: "HĐ #1002 - Chú Tám",
  },
  {
    time: "2026-05-04 08:00",
    code: "AQ-001",
    name: "AquaClean Pro",
    type: "Nhập hàng",
    change: 150,
    balance: 150,
    user: "Duy (Admin)",
    note: "Nhập lô mới NSX",
  },
  {
    time: "2026-05-03 15:20",
    code: "AQ-005",
    name: "Anti-Vibrio Plus",
    type: "Kiểm kho",
    change: -2,
    balance: 8,
    user: "NV. Nam",
    note: "Chai bị rò rỉ",
  },
  {
    time: "2026-05-02 09:15",
    code: "AQ-012",
    name: "Iodine 9000",
    type: "Bán hàng",
    change: -10,
    balance: 45,
    user: "Duy (Admin)",
    note: "HĐ #1001 - Ao Anh Ba",
  },
];

document.addEventListener("DOMContentLoaded", function () {
  filteredData = [...historyData];
  updateTable();

  const btnFilter = document.querySelector(".btn-aqua");
  if (btnFilter) {
    btnFilter.addEventListener("click", applyHistoryFilter);
  }
});

function renderHistory(data) {
  const historyTableBody = document.getElementById("historyTableBody");
  if (!historyTableBody) return;

  historyTableBody.innerHTML = data
    .map((item) => {
      const changeClass = item.change > 0 ? "text-success" : "text-danger";
      const changePrefix = item.change > 0 ? "+" : "";
      const badgeClass =
        item.type === "Nhập hàng"
          ? "bg-success-subtle text-success"
          : item.type === "Bán hàng"
            ? "bg-primary-subtle text-primary"
            : "bg-warning-subtle text-warning";

      return `
            <tr>
                <td class="small text-muted">${item.time}</td>
                <td class="fw-bold">${item.code}</td>
                <td>${item.name}</td>
                <td><span class="badge ${badgeClass} border-0">${item.type}</span></td>
                <td class="text-center ${changeClass} fw-bold">${changePrefix}${item.change}</td>
                <td class="text-center fw-bold">${item.balance}</td>
                <td class="small">${item.user}</td>
                <td class="small text-muted italic">"${item.note}"</td>
                <td class="text-end">
                    <button class="btn btn-sm btn-light border" title="Xem chi tiết" onclick="viewDetail('${item.time}')">
                        <i class="bi bi-eye text-aqua"></i>
                    </button>
                </td>
            </tr>
        `;
    })
    .join("");
}
window.viewDetail = function (ticketId) {
  const data = {
    id: ticketId || "#HĐ1002",
    time: "05/05/2026 10:30",
    userOffice: "Lê Thị Hồng",
    userMarket: "Trần Văn Nam",
    customer: {
      name: "Chú Tám (Ao tôm Sóc Trăng)",
      phone: "0901.234.567",
      address: "Kênh 3, Mỹ Xuyên, Sóc Trăng",
    },
    products: [
      {
        name: "AquaClean Pro - Men vi sinh xử lý đáy ao siêu tốc đặc trị khí độc",
        code: "AQ-001",
        qty: 5,
        price: 150000,
        discount: 50000,
      },
      {
        name: "Iodine 9000 - Thuốc sát trùng nước cực mạnh",
        code: "AQ-012",
        qty: 2,
        price: 210000,
        discount: 0,
      },
    ],
    extraFee: 30000,
  };

  // Đổ dử liệu Text
  document.getElementById("detail-ticket-id").innerText = data.id;
  document.getElementById("detail-time").innerText = data.time;
  document.getElementById("detail-user-office").innerText = data.userOffice;
  document.getElementById("detail-user-market").innerText = data.userMarket;
  document.getElementById("detail-cust-name").innerText = data.customer.name;
  document.getElementById("detail-cust-phone").innerText = data.customer.phone;
  document.getElementById("detail-cust-addr").innerText = data.customer.address;

  // Render bảng sản phẩm
  let totalRaw = 0;
  let totalDiscount = 0;
  const listBody = document.getElementById("detail-product-list");

  listBody.innerHTML = data.products
    .map((p) => {
      const itemTotalRaw = p.qty * p.price;
      totalRaw += itemTotalRaw;
      totalDiscount += p.discount;

      return `
            <tr>
                <td class="ps-3">
                    <div class="fw-bold text-dark text-wrap-name">${p.name}</div>
                    <small class="text-muted x-small">${p.code}</small>
                </td>
                <td class="text-center fw-bold text-danger">-${p.qty}</td>
                <td class="text-end text-muted small">${p.price.toLocaleString()}đ</td>
                <td class="text-end text-success small">-${p.discount.toLocaleString()}đ</td>
                <td class="text-end fw-bold pe-3 text-dark">${(itemTotalRaw - p.discount).toLocaleString()}đ</td>
            </tr>
        `;
    })
    .join("");

  document.getElementById("sum-product-price").innerText =
    totalRaw.toLocaleString() + "đ";
  document.getElementById("sum-extra-fee").innerText =
    "+" + data.extraFee.toLocaleString() + "đ";
  document.getElementById("sum-discount").innerText =
    "-" + totalDiscount.toLocaleString() + "đ";
  document.getElementById("sum-total-final").innerText =
    (totalRaw - totalDiscount + data.extraFee).toLocaleString() + "đ";

  new bootstrap.Modal(document.getElementById("detailHistoryModal")).show();
};

function updateTable() {
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedItems = filteredData.slice(startIndex, endIndex);

  renderHistory(paginatedItems);

  const startIdxEl = document.getElementById("start-index");
  const endIdxEl = document.getElementById("end-index");
  const totalCountEl = document.getElementById("total-count");

  if (startIdxEl)
    startIdxEl.innerText = filteredData.length ? startIndex + 1 : 0;
  if (endIdxEl) endIdxEl.innerText = Math.min(endIndex, filteredData.length);
  if (totalCountEl) totalCountEl.innerText = filteredData.length;

  renderPagination();
}

function renderPagination() {
  const paginationControls = document.getElementById("pagination-controls");
  if (!paginationControls) return;

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  let paginationHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    paginationHTML += `
            <li class="page-item ${i === currentPage ? "active" : ""}">
                <a class="page-link" href="javascript:void(0)" onclick="changePage(${i})">${i}</a>
            </li>`;
  }
  paginationControls.innerHTML = paginationHTML;
}

window.changePage = function (page) {
  currentPage = page;
  updateTable();
};

window.applyHistoryFilter = function () {
  const fromDate = document.getElementById("fromDate").value;
  const toDate = document.getElementById("toDate").value;
  const type = document.getElementById("filterType").value;

  filteredData = historyData.filter((item) => {
    const itemDate = item.time.split(" ")[0];
    const matchFrom = !fromDate || itemDate >= fromDate;
    const matchTo = !toDate || itemDate <= toDate;
    const matchType = !type || item.type === type;
    return matchFrom && matchTo && matchType;
  });

  currentPage = 1;
  updateTable();
};

window.exportHistory = function () {
  alert("Hệ thống đang chuẩn bị xuất file Excel...");
};
