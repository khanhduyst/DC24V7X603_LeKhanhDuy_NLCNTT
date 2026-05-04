// CRM_AQUA/assets/js/index.js
window.addEventListener("DOMContentLoaded", () => {
  // 1. ADMIN: Biểu đồ doanh thu năm
  const ctxRevenue = document
    .getElementById("adminRevenueChart")
    ?.getContext("2d");
  if (ctxRevenue) {
    new Chart(ctxRevenue, {
      type: "line",
      data: {
        labels: ["T1", "T2", "T3", "T4", "T5", "T6"],
        datasets: [
          {
            label: "Doanh thu (Tỷ)",
            data: [1.2, 1.8, 1.5, 2.5, 2.1, 2.8],
            borderColor: "#0d6efd",
            tension: 0.4,
            fill: true,
            backgroundColor: "rgba(13, 110, 253, 0.05)",
          },
        ],
      },
      options: {
        layout: {
          padding: 0, // Loại bỏ khoảng trắng thừa quanh biểu đồ
        },
        maintainAspectRatio: false, // Cho phép co giãn tự do theo container
        // ... các options khác ...
      },
    });
  }

  // 2. MANAGER: Biểu đồ đơn hàng
  const ctxOrder = document
    .getElementById("orderStatusChart")
    ?.getContext("2d");
  if (ctxOrder) {
    new Chart(ctxOrder, {
      type: "pie",
      data: {
        labels: ["Chờ", "Đang giao", "Hoàn thành"],
        datasets: [
          {
            data: [15, 35, 50],
            backgroundColor: ["#ffc107", "#0dcaf0", "#198754"],
          },
        ],
      },
    });
  }

  // 3. MANAGER: Render Top Sản Phẩm
  const topProds = [
    { name: "Yucca Zeolite", sales: 450 },
    { name: "Kháng sinh đặc trị", sales: 320 },
  ];
  document.getElementById("top-products-list").innerHTML = topProds
    .map(
      (p) =>
        `<div class="d-flex justify-content-between mb-2 small border-bottom pb-1">
            <span>${p.name}</span> <span class="fw-bold">${p.sales} đơn</span>
        </div>`,
    )
    .join("");

  // 4. MANAGER: Render KPI Nhân viên
  const teamKpi = [
    { name: "Duy Nguyễn", kpi: 85 },
    { name: "An Trần", kpi: 70 },
  ];
  document.getElementById("manager-kpi-list").innerHTML = teamKpi
    .map(
      (s) =>
        `<div class="mb-3">
            <div class="d-flex justify-content-between small"><span>${s.name}</span><span>${s.kpi}%</span></div>
            <div class="progress" style="height: 5px;"><div class="progress-bar bg-warning" style="width: ${s.kpi}%"></div></div>
        </div>`,
    )
    .join("");
});
