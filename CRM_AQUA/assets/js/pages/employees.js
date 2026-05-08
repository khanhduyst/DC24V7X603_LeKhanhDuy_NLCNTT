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

window.showDetail = function(empId) {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;

    document.getElementById("modal-emp-name").innerHTML = `<i class="bi bi-info-circle me-2"></i> Hồ sơ nhân viên`;

    const infoPane = document.getElementById("tab-info-content");
    infoPane.innerHTML = `
        <div class="row g-3">
            <div class="col-12 col-md-4 text-center border-md-end">
                <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm" 
                     style="width: 100px; height: 100px; font-size: 40px; border: 4px solid #fff;">
                    ${emp.name.charAt(0)}
                </div>
                <h5 class="fw-bold mb-1">${emp.name}</h5>
                <div class="badge bg-primary-subtle text-primary border-0 mb-3">${emp.role}</div>
                
                <div class="p-2 rounded bg-light border-0 mb-2">
                    <div class="x-small text-muted">Trạng thái làm việc</div>
                    <select class="form-select form-select-sm border-0 bg-transparent text-center fw-bold" onchange="updateStatus('${emp.id}', this.value)">
                        <option value="active" ${emp.status === 'active' ? 'selected' : ''}>🟢 Đang đi làm</option>
                        <option value="leave" ${emp.status === 'leave' ? 'selected' : ''}>🟡 Xin nghỉ phép</option>
                        <option value="inactive" ${emp.status === 'inactive' ? 'selected' : ''}>🔴 Đã nghỉ việc</option>
                    </select>
                </div>
            </div>

            <div class="col-12 col-md-8">
                <div class="row g-3">
                    <div class="col-6">
                        <label class="x-small text-muted fw-bold">MÃ NHÂN VIÊN</label>
                        <div class="fw-bold text-dark border-bottom pb-1">${emp.id}</div>
                    </div>
                    <div class="col-6">
                        <label class="x-small text-muted fw-bold">GIỚI TÍNH</label>
                        <div class="fw-bold text-dark border-bottom pb-1">Nam</div>
                    </div>
                    <div class="col-12">
                        <label class="x-small text-muted fw-bold">SỐ CCCD</label>
                        <div class="fw-bold text-dark border-bottom pb-1">080099001234</div>
                    </div>
                    <div class="col-6">
                        <label class="x-small text-muted fw-bold">NGÀY VÀO LÀM</label>
                        <div class="fw-bold text-dark border-bottom pb-1">01/05/2024</div>
                    </div>
                    <div class="col-6">
                        <label class="x-small text-muted fw-bold">KHU VỰC TRỰC</label>
                        <div class="fw-bold text-dark border-bottom pb-1">Ao số 5 - Trần Đề</div>
                    </div>
                    <div class="col-12">
                        <label class="x-small text-muted fw-bold">SỐ ĐIỆN THOẠI</label>
                        <div class="fw-bold text-dark border-bottom pb-1 text-primary">${emp.phone}</div>
                    </div>
                    <div class="col-12">
                        <label class="x-small text-muted fw-bold">ĐỊA CHỈ</label>
                        <div class="fw-bold text-dark border-bottom pb-1">P4, TP. Sóc Trăng, Sóc Trăng</div>
                    </div>
                    <div class="col-12">
                        <label class="x-small text-muted fw-bold">GHI CHÚ</label>
                        <div class="small text-muted bg-light p-2 rounded">Nhân viên nhiệt tình, có kinh nghiệm xử lý phèn trong ao nuôi.</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const detailModal = new bootstrap.Modal(document.getElementById('modalDetail'));
    detailModal.show();
}

window.updateStatus = function(id, status) {
    const emp = employees.find(e => e.id === id);
    if(emp) emp.status = status;
    renderEmployees(); 
}

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
