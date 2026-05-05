var globalFilter = document.getElementById("globalMonthFilter");
var revenueStat = document.getElementById("statRevenue");
var orderTableBody = document.getElementById("orderTableBody");
var orderCountBadge = document.getElementById("orderTableCount");

var dashboardData = {
  "2026-05": {
    revenue: "540.000.000đ",
    chartLabels: ["T1", "T2", "T3", "T4", "T5", "T6"],
    chartValues: [320, 450, 390, 540, 480, 610],
    orders: [
      {
        id: "#ORD-8821",
        customer: "Anh Bảy Đầm Tôm",
        product: "Vi sinh AquaClean",
        total: "12.500.000đ",
        status: "Đã giao",
        class: "bg-success",
      },
      {
        id: "#ORD-8822",
        customer: "Đại lý Minh Trí",
        product: "Kháng sinh thảo dược",
        total: "45.000.000đ",
        status: "Chờ duyệt",
        class: "bg-warning text-dark",
      },
    ],
  },
  "2026-04": {
    revenue: "410.000.000đ",
    chartLabels: ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"],
    chartValues: [100, 150, 130, 180],
    orders: [
      {
        id: "#ORD-7710",
        customer: "Chú Năm Ao Cá",
        product: "Sát trùng Iodine",
        total: "8.200.000đ",
        status: "Đã giao",
        class: "bg-success",
      },
    ],
  },
};

var salesChart;
var ctx = document.getElementById("salesChart").getContext("2d");

salesChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: dashboardData["2026-05"].chartLabels,
    datasets: [
      {
        data: dashboardData["2026-05"].chartValues,
        backgroundColor: "rgba(0, 96, 151, 0.1)",
        borderColor: "#006097",
        borderWidth: 3,
        tension: 0.4,
        fill: true,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
  },
});

function updateDashboard(month) {
  var data = dashboardData[month] || {
    revenue: "0đ",
    orders: [],
    chartLabels: [],
    chartValues: [],
  };

  revenueStat.innerText = data.revenue;
  orderCountBadge.innerText = data.orders.length + " đơn hàng";

  orderTableBody.innerHTML = data.orders
    .map(function (item) {
      return (
        "<tr>" +
        "<td>" +
        item.id +
        "</td>" +
        "<td>" +
        item.customer +
        "</td>" +
        "<td>" +
        item.product +
        "</td>" +
        '<td class="fw-bold">' +
        item.total +
        "</td>" +
        '<td><span class="badge ' +
        item.class +
        '">' +
        item.status +
        "</span></td>" +
        '<td><button class="btn btn-sm btn-light border"><i class="bi bi-eye"></i></button></td>' +
        "</tr>"
      );
    })
    .join("");

  salesChart.data.labels = data.chartLabels;
  salesChart.data.datasets[0].data = data.chartValues;
  salesChart.update();
}

if (globalFilter) {
  globalFilter.addEventListener("change", function () {
    updateDashboard(this.value);
  });

  // Gọi hàm chạy lần đầu tiên với giá trị đang có sẵn trong input
  updateDashboard(globalFilter.value);
} else {
  // Nếu không tìm thấy filter, mặc định chạy tháng 05
  updateDashboard("2026-05");
}
