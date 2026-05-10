document.addEventListener("DOMContentLoaded", () => {
  const filterChips = document.querySelectorAll(".filter-chip");
  const searchInput = document.getElementById("searchInput");

  function filterCustomers() {
    const searchText = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const activeChip = document.querySelector(".filter-chip.active");
    const activeStatus = activeChip ? activeChip.getAttribute("data-status") : "all";
    const customerItems = document.querySelectorAll(".customer-item");

    customerItems.forEach((item) => {
      const customerName = item.querySelector("h6").innerText.toLowerCase();
      const customerAddr = item.querySelector("p").innerText.toLowerCase();
      const itemStatus = item.getAttribute("data-status");

      const matchesSearch = customerName.includes(searchText) || customerAddr.includes(searchText);
      const matchesStatus = activeStatus === "all" || itemStatus === activeStatus;

      if (matchesSearch && matchesStatus) {
        item.style.display = "block";
        item.style.animation = "fadeIn 0.3s ease forwards";
      } else {
        item.style.display = "none";
      }
    });
  }

  filterChips.forEach((chip) => {
    chip.addEventListener("click", function () {
      filterChips.forEach((c) => c.classList.remove("active"));
      this.classList.add("active");
      filterCustomers();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", filterCustomers);
  }
});

function goToDetail(id) {
  console.log("Chuyển tới khách hàng ID:", id);
}

const staffs = [
  { id: "NV001", name: "Nguyễn Văn A", phone: "0901234567" },
  { id: "NV002", name: "Trần Thị B", phone: "0988777666" },
];

function findStaff() {
  const val = document.getElementById("staffSearch").value.trim().toLowerCase();
  const resultDiv = document.getElementById("staffResult");

  if (val === "") {
    resultDiv.innerText = "";
    return;
  }

  const staff = staffs.find((s) => s.id.toLowerCase() === val || s.phone === val);

  if (staff) {
    resultDiv.innerHTML = `<i class="bi bi-person-check-fill"></i> Nhân viên: ${staff.name}`;
  } else {
    resultDiv.innerHTML = `<span class="text-danger small">Không tìm thấy nhân viên</span>`;
  }
}

function saveCustomer() {
  const name = document.getElementById("custName").value;
  const address = document.getElementById("custAddress").value;

  if (!name || !address) {
    Swal.fire({
      title: "Thiếu dữ liệu",
      text: "Tên khách hàng và Địa chỉ là bắt buộc!",
      icon: "error",
    });
    return;
  }

  Swal.fire({
    title: "Thành công!",
    text: "Đã thêm khách hàng mới vào hệ thống CRM.",
    icon: "success",
    timer: 2000,
    showConfirmButton: false,
  });

  const modalElement = document.getElementById("addCustomerModal");
  const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
  modal.hide();

  document.getElementById("addCustomerForm").reset();
  document.getElementById("staffResult").innerText = "";
}

function deleteCustomer(btn) {
  const card = btn.closest(".customer-item");
  const name = card.querySelector("h6").innerText;

  Swal.fire({
    title: "Xác nhận xóa?",
    text: `Bạn có chắc chắn muốn xóa khách hàng "${name}" không?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Đúng, xóa ngay!",
    cancelButtonText: "Hủy bỏ",
  }).then((result) => {
    if (result.isConfirmed) {
      card.style.transition = "0.4s";
      card.style.opacity = "0";
      card.style.transform = "translateX(20px)";

      setTimeout(() => {
        card.remove();
        Swal.fire({
          title: "Đã xóa!",
          text: "Dữ liệu khách hàng đã được loại bỏ.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }, 400);
    }
  });
}

let editingCard = null;

function editCustomer(btn) {
  editingCard = btn.closest(".customer-item");

  const currentName = editingCard.querySelector("h6").innerText;
  const currentAddr = editingCard.querySelector("p").innerText;
  const currentStatus = editingCard.getAttribute("data-status");

  document.getElementById("custName").value = currentName;
  document.getElementById("custAddress").value = currentAddr;
  document.getElementById("custStatus").value = currentStatus;

  document.querySelector("#addCustomerModal h5").innerText = "CHỈNH SỬA THÔNG TIN";
  const saveBtn = document.querySelector("#addCustomerModal .btn-primary");
  saveBtn.innerText = "Cập nhật thay đổi";
  saveBtn.setAttribute("onclick", "updateCustomer()");

  const modal = new bootstrap.Modal(document.getElementById("addCustomerModal"));
  modal.show();
}

function updateCustomer() {
  const newName = document.getElementById("custName").value;
  const newAddr = document.getElementById("custAddress").value;
  const newStatus = document.getElementById("custStatus").value;

  if (!newName || !newAddr) {
    Swal.fire("Chú ý", "Không được để trống Tên và Địa chỉ", "warning");
    return;
  }

  editingCard.querySelector("h6").innerText = newName;
  editingCard.querySelector("p").innerHTML = `<i class="bi bi-geo-alt me-1"></i> ${newAddr}`;
  editingCard.setAttribute("data-status", newStatus);

  const badge = editingCard.querySelector(".badge");
  if (newStatus === "success") {
    badge.className = "badge bg-success-subtle text-success small";
    badge.innerText = "Đang nợ thấp";
  } else if (newStatus === "danger") {
    badge.className = "badge bg-danger-subtle text-danger small";
    badge.innerText = "Nợ quá hạn";
  } else {
    badge.className = "badge bg-secondary-subtle text-secondary small";
    badge.innerText = "Khách mới";
  }

  Swal.fire({
    title: "Đã cập nhật!",
    text: "Thông tin khách hàng đã được thay đổi thành công.",
    icon: "success",
    timer: 1500,
    showConfirmButton: false,
  });

  const modalElement = document.getElementById("addCustomerModal");
  const modal = bootstrap.Modal.getInstance(modalElement);
  if (modal) modal.hide();
  
  resetModal();
}

function resetModal() {
  document.querySelector("#addCustomerModal h5").innerText = "THÊM KHÁCH HÀNG MỚI";
  const saveBtn = document.querySelector("#addCustomerModal .btn-primary");
  saveBtn.innerText = "Lưu dữ liệu khách hàng";
  saveBtn.setAttribute("onclick", "saveCustomer()");
  document.getElementById("addCustomerForm").reset();
  document.getElementById("staffResult").innerText = "";
  editingCard = null;
}
