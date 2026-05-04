const ctx = document.getElementById("salesChart").getContext("2d");

new Chart(ctx, {
  type: "line",
  data: {
    labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6"],
    datasets: [
      {
        label: "Doanh số (VNĐ)",
        data: [
          320000000, 450000000, 390000000, 540000000, 480000000, 610000000,
        ],
        backgroundColor: "rgba(0, 96, 151, 0.1)",
        borderColor: "#006097",
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#006097",
        pointRadius: 5,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          callback: function (value) {
            return value / 1000000 + "M";
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  },
});
