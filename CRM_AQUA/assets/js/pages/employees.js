const employees = [
  {
    id: "NV001",
    name: "Nguyễn Văn A",
    phone: "0901234567",
    role: "Kỹ thuật viên",
    status: "active",
  },
  {
    id: "NV002",
    name: "Trần Thị B",
    phone: "0988777666",
    role: "Bán hàng",
    status: "active",
  },
  {
    id: "NV003",
    name: "Lê Văn C",
    phone: "0911222333",
    role: "Quản lý",
    status: "inactive",
  },
];

window.renderEmployees = function (data = employees) {
  const tableBody = document.getElementById("employee-table-body");
  const cardList = document.getElementById("employee-card-list");

  if (data.length === 0) {
    const noData = `<div class="text-center p-5 text-muted w-100">Không tìm thấy nhân viên phù hợp</div>`;
    if (tableBody)
      tableBody.innerHTML = `<tr><td colspan="5" class="text-center p-4 text-muted">Không có dữ liệu</td></tr>`;
    if (cardList) cardList.innerHTML = noData;
    return;
  }

  if (tableBody) {
    tableBody.innerHTML = data
      .map(
        (emp) => `
            <tr onclick="showDetail('${emp.id}')" style="cursor:pointer">
                <td class="ps-4 text-muted small">${emp.id}</td>
                <td class="fw-bold text-primary">${emp.name}</td>
                <td>${emp.phone}</td>
                <td><span class="badge bg-info-subtle text-info border border-info-subtle">${emp.role}</span></td>
                <td class="text-end pe-4" onclick="event.stopPropagation()">
                    <button class="btn btn-sm btn-light border me-1" onclick="showDetail('${emp.id}')"><i class="bi bi-eye"></i></button>
                    <button class="btn btn-sm btn-light border text-danger"><i class="bi bi-trash"></i></button>
                </td>
            </tr>
        `,
      )
      .join("");
  }

  if (cardList) {
    cardList.innerHTML = data
      .map(
        (emp) => `
            <div class="card border-0 shadow-sm mb-3 mx-0" onclick="showDetail('${emp.id}')">
                <div class="card-body p-3">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <div class="d-flex align-items-center">
                            <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style="width: 40px; height: 40px; min-width: 40px;">
                                ${emp.name.charAt(0)}
                            </div>
                            <div>
                                <h6 class="fw-bold mb-0 text-truncate" style="max-width: 150px;">${emp.name}</h6>
                                <div class="x-small text-muted">${emp.id} • ${emp.role}</div>
                            </div>
                        </div>
                        <span class="badge ${emp.status === "active" ? "bg-success" : "bg-secondary"}" style="font-size: 9px;">
                            ${emp.status === "active" ? "Đang làm" : "Đang nghỉ"}
                        </span>
                    </div>
                    <div class="row g-2 border-top pt-2 mt-1">
                        <div class="col-12" onclick="event.stopPropagation()">
                             <button class="btn btn-light w-100 btn-sm border" onclick="showDetail('${emp.id}')">
                                <i class="bi bi-eye me-1"></i> Xem chi tiết
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `,
      )
      .join("");
  }
};

window.showDetail = function (empId, isUpdate = false) {
  if (isUpdate) {
    const backdrops = document.querySelectorAll(".modal-backdrop");
    backdrops.forEach((b) => b.remove());
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  }

  const emp = employees.find((e) => e.id === empId);
  if (!emp) return;

  document.getElementById("modal-emp-name").innerHTML =
    `<i class="bi bi-info-circle me-2"></i> Hồ sơ nhân viên`;

  const infoPane = document.getElementById("info-pane");
  if (infoPane) {
    infoPane.innerHTML = `
            <div class="row g-3">
                <div class="col-12 col-md-4 text-center border-md-end">
                    <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm" style="width: 80px; height: 80px; font-size: 30px;">
                        ${emp.name.charAt(0)}
                    </div>
                    <h5 class="fw-bold mb-1" id="info-name-text">${emp.name}</h5>
                    <div class="badge bg-primary-subtle text-primary border-0 mb-3" id="info-role-text">${emp.role}</div>
                    <div class="p-2 rounded bg-light border-0 mb-2 text-center shadow-sm">
                        <div class="x-small text-muted mb-1 text-uppercase fw-bold">Trạng thái</div>
                        <div class="fw-bold small" id="info-status-text">
                            ${emp.status === "active" ? "🟢 Đang đi làm" : "🔴 Đã nghỉ việc"}
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-8">
                    <div class="row g-3 text-start">
                        <div class="col-6">
                            <label class="x-small text-muted fw-bold">MÃ NHÂN VIÊN</label>
                            <div class="fw-bold text-dark border-bottom pb-1" id="info-id-text">${emp.id}</div>
                        </div>
                        <div class="col-6">
                            <label class="x-small text-muted fw-bold">GIỚI TÍNH</label>
                            <div class="fw-bold text-dark border-bottom pb-1" id="info-gender-text">Nam</div>
                        </div>
                        <div class="col-12">
                            <label class="x-small text-muted fw-bold">SỐ CCCD</label>
                            <div class="fw-bold text-dark border-bottom pb-1" id="info-cccd-text">080099001234</div>
                        </div>
                        <div class="col-6">
                            <label class="x-small text-muted fw-bold">SỐ ĐIỆN THOẠI</label>
                            <div class="fw-bold text-dark border-bottom pb-1 text-primary" id="info-phone-text">${emp.phone}</div>
                        </div>
                        <div class="col-6">
                            <label class="x-small text-muted fw-bold">NGÀY VÀO LÀM</label>
                            <div class="fw-bold text-dark border-bottom pb-1" id="info-date-text">01/05/2024</div>
                        </div>
                        <div class="col-12">
                            <label class="x-small text-muted fw-bold">KHU VỰC TRỰC</label>
                            <div class="fw-bold text-dark border-bottom pb-1" id="info-area-text">Ao số 5 - Trần Đề</div>
                        </div>
                        <div class="col-12">
                            <label class="x-small text-muted fw-bold">ĐỊA CHỈ</label>
                            <div class="fw-bold text-dark border-bottom pb-1" id="info-address-text">P4, TP. Sóc Trăng, Sóc Trăng</div>
                        </div>
                        <div class="col-12">
                            <label class="x-small text-muted fw-bold">GHI CHÚ</label>
                            <div class="small text-muted bg-light p-2 rounded" id="info-note-text">Nhân viên tích cực, đang thử việc thị trường.</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
  }

  const workPane = document.getElementById("work-pane");
  if (workPane) {
    workPane.innerHTML = `
            <div class="row g-3 text-start p-2">
                <h6 class="fw-bold mb-2 small text-uppercase text-muted">Báo cáo khách hàng hôm nay</h6>
                <div class="list-group list-group-flush rounded-3 border overflow-hidden shadow-sm">
                    <button class="list-group-item list-group-item-action p-3" onclick="viewReport('Chú Năm Ao Tôm', '08:30 AM', 'Trần Đề, Sóc Trăng')">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <div class="fw-bold text-primary">Chú Năm Ao Tôm</div>
                                <div class="x-small text-muted">Bấm để xem ảnh check-in & nội dung...</div>
                            </div>
                            <i class="bi bi-chevron-right text-muted"></i>
                        </div>
                    </button>
                    <button class="list-group-item list-group-item-action p-3" onclick="viewReport('Đại lý Thanh Sang', '10:15 AM', 'Mỹ Xuyên, Sóc Trăng')">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <div class="fw-bold text-primary">Đại lý Thanh Sang</div>
                                <div class="x-small text-muted">Bấm để xem ảnh check-in & nội dung...</div>
                            </div>
                            <i class="bi bi-chevron-right text-muted"></i>
                        </div>
                    </button>
                </div>
            </div>
        `;
  }

  const kpiPane = document.getElementById("kpi-pane");
  if (kpiPane) {
    kpiPane.innerHTML = `
            <div class="row g-3 text-start">
                <div class="col-6">
                    <div class="p-3 border-0 rounded-3 bg-white shadow-sm border-start border-primary border-4">
                        <div class="x-small text-muted fw-bold">DOANH SỐ GIỐNG</div>
                        <div class="fw-bold text-primary">85.0M <span class="text-muted small">/ 100M</span></div>
                        <div class="progress mt-2" style="height: 6px;">
                            <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: 85%"></div>
                        </div>
                        <div class="x-small mt-2 text-muted d-flex justify-content-between">
                            <span>Hoa hồng (3%):</span>
                            <span class="text-dark fw-bold">2.550.000đ</span>
                        </div>
                    </div>
                </div>
                <div class="col-6">
                    <div class="p-3 border-0 rounded-3 bg-white shadow-sm border-start border-success border-4">
                        <div class="x-small text-muted fw-bold">DOANH SỐ THUỐC</div>
                        <div class="fw-bold text-success">60.0M <span class="text-muted small">/ 50M</span></div>
                        <div class="progress mt-2" style="height: 6px;">
                            <div class="progress-bar bg-success" style="width: 100%"></div>
                        </div>
                        <div class="x-small mt-2 text-muted d-flex justify-content-between">
                            <span>Hoa hồng (5%):</span>
                            <span class="text-dark fw-bold">3.000.000đ</span>
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <div class="p-3 border-0 rounded-3 bg-light shadow-sm d-flex justify-content-between align-items-center">
                        <div>
                            <div class="x-small text-muted fw-bold text-uppercase">Chuyên cần (Ngày công)</div>
                            <div class="fw-bold fs-5">24 / 26 <span class="small text-muted font-normal">Ngày làm việc</span></div>
                        </div>
                        <div class="text-end border-start ps-3">
                            <div class="x-small text-muted fw-bold text-uppercase">Lương cứng nhận</div>
                            <div class="fw-bold text-dark fs-5">6.460.000đ</div>
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <div class="p-3 rounded-3 shadow-sm text-white" style="background: linear-gradient(135deg, #0d6efd 0%, #002d5f 100%);">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <div class="x-small opacity-75 fw-bold text-uppercase mb-1">Dự kiến thu nhập thực nhận</div>
                                <div class="fs-2 fw-bold" style="letter-spacing: 1px;">12.010.000đ</div>
                            </div>
                            <div class="bg-white bg-opacity-20 p-2 rounded-circle">
                                <i class="bi bi-wallet2 fs-2 text-white"></i>
                            </div>
                        </div>
                    </div>
                    <div class="x-small text-muted mt-2 text-center">
                        <i class="bi bi-info-circle me-1"></i>
                        Tổng = Lương cứng (theo ngày công) + Hoa hồng giống/thuốc + Thưởng KPI
                    </div>
                </div>
            </div>
        `;
  }

  const footer = document.querySelector("#modalDetail .modal-footer");
  if (footer) {
    footer.innerHTML = `
            <button type="button" class="btn btn-secondary px-4" data-bs-dismiss="modal">Đóng</button>
            <button type="button" class="btn btn-primary px-4" onclick="editEmployee()">
                <i class="bi bi-pencil-square me-2"></i>Chỉnh sửa
            </button>
        `;
  }

  if (!isUpdate) {
    const detailModal = new bootstrap.Modal(
      document.getElementById("modalDetail"),
    );
    detailModal.show();
  }
};

window.cancelEdit = function (empId) {
  showDetail(empId, true);
};

window.editEmployee = function () {
  const infoPane = document.getElementById("info-pane");
  if (!infoPane) return;

  const name = document.getElementById("info-name-text")?.innerText || "";
  const role = document.getElementById("info-role-text")?.innerText || "";
  const id = document.getElementById("info-id-text")?.innerText || "";
  const phone = document.getElementById("info-phone-text")?.innerText || "";
  const area = document.getElementById("info-area-text")?.innerText || "";
  const address = document.getElementById("info-address-text")?.innerText || "";
  const note = document.getElementById("info-note-text")?.innerText || "";

  infoPane.innerHTML = `
        <div class="row g-3 text-start">
            <div class="col-12 text-center border-bottom pb-2">
                <p class="x-small fw-bold text-primary mb-0">ĐANG CHỈNH SỬA HỒ SƠ</p>
            </div>
            <div class="col-12">
                <label class="x-small fw-bold text-muted">HỌ VÀ TÊN</label>
                <input type="text" id="edit-name" class="form-control form-control-sm border-0 bg-light" value="${name}">
            </div>
            <div class="col-6">
                <label class="x-small fw-bold text-muted">MÃ NV (Không sửa)</label>
                <input type="text" id="edit-id" class="form-control form-control-sm border-0 bg-light" value="${id}" readonly>
            </div>
            <div class="col-6">
                <label class="x-small fw-bold text-muted">CHỨC DANH</label>
                <select id="edit-role" class="form-select form-select-sm border-0 bg-light">
                    <option value="Kỹ thuật viên" ${role.includes("Kỹ thuật viên") ? "selected" : ""}>Kỹ thuật viên</option>
                    <option value="Bán hàng" ${role.includes("Bán hàng") ? "selected" : ""}>Bán hàng</option>
                    <option value="Quản lý" ${role.includes("Quản lý") ? "selected" : ""}>Quản lý</option>
                </select>
            </div>
            <div class="col-12">
                <label class="x-small fw-bold text-muted">SỐ ĐIỆN THOẠI</label>
                <input type="text" id="edit-phone" class="form-control form-control-sm border-0 bg-light" value="${phone}">
            </div>
            <div class="col-12">
                <label class="x-small fw-bold text-muted">KHU VỰC TRỰC</label>
                <input type="text" id="edit-area" class="form-control form-control-sm border-0 bg-light" value="${area}">
            </div>
            <div class="col-12">
                <label class="x-small fw-bold text-muted">ĐỊA CHỈ</label>
                <input type="text" id="edit-address" class="form-control form-control-sm border-0 bg-light" value="${address}">
            </div>
            <div class="col-12">
                <label class="x-small fw-bold text-muted">GHI CHÚ</label>
                <textarea id="edit-note" class="form-control form-control-sm border-0 bg-light" rows="2">${note}</textarea>
            </div>
        </div>
    `;

  const footer = document.querySelector("#modalDetail .modal-footer");
  if (footer) {
    footer.innerHTML = `
            <button type="button" class="btn btn-light border px-4" onclick="cancelEdit('${id}')">Hủy bỏ</button>
            <button type="button" class="btn btn-success px-4" onclick="saveEmployee('${id}')">Lưu thay đổi</button>
        `;
  }

  const infoTab = document.querySelector("#info-tab");
  if (infoTab) {
    bootstrap.Tab.getInstance(infoTab)?.show() ||
      new bootstrap.Tab(infoTab).show();
  }
};

window.viewReport = function (customerName, time, location) {
  document.getElementById("report-title").innerText =
    "Khách hàng: " + customerName;

  const notes = {
    "Chú Năm Ao Tôm":
      "Chú Năm quan tâm thuốc diệt khuẩn. Đã gửi mẫu dùng thử. Chú khen nhân viên nhiệt tình.",
    "Đại lý Thanh Sang":
      "Đại lý muốn nhập 100 vạn giống vào tháng sau. Cần chiết khấu thêm 2%.",
  };
  document.getElementById("report-note").innerText =
    notes[customerName] || "Nhân viên đã kiểm tra ao và tư vấn kỹ thuật.";

  const reportModal = new bootstrap.Modal(
    document.getElementById("modalReportDetail"),
  );
  reportModal.show();
};

window.saveEmployee = function (empId) {
  const newName = document.getElementById("edit-name").value;
  const newPhone = document.getElementById("edit-phone").value;
  const newRole = document.getElementById("edit-role").value;

  const empIndex = employees.findIndex((e) => e.id === empId);
  if (empIndex !== -1) {
    employees[empIndex].name = newName;
    employees[empIndex].phone = newPhone;
    employees[empIndex].role = newRole;
  }

  renderEmployees();
  showDetail(empId, true);

  const footer = document.querySelector("#modalDetail .modal-footer");
  footer.innerHTML = `
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
        <button type="button" class="btn btn-primary" onclick="editEmployee()">
            <i class="bi bi-pencil-square me-2"></i>Chỉnh sửa
        </button>
    `;
};

window.updateStatus = function (id, status) {
  const emp = employees.find((e) => e.id === id);
  if (emp) emp.status = status;
  renderEmployees();
};

window.filterEmployees = function () {
  const searchInput = document.getElementById("search-emp");
  const roleInput = document.getElementById("filter-role");

  if (!searchInput || !roleInput) return;

  const searchTerm = searchInput.value.toLowerCase();
  const roleTerm = roleInput.value;

  const filtered = employees.filter((emp) => {
    const matchSearch =
      emp.name.toLowerCase().includes(searchTerm) ||
      emp.phone.includes(searchTerm) ||
      emp.id.toLowerCase().includes(searchTerm);
    const matchRole = roleTerm === "all" || emp.role === roleTerm;
    return matchSearch && matchRole;
  });

  renderEmployees(filtered);
};

document.addEventListener("DOMContentLoaded", () => {
  renderEmployees();
});

function openAddEmployeeModal() {
  window.location.href = "/add-employee.html";
}