// 1. Cấu hình Quill toàn cục để ImageResize hoạt động
window.Quill = Quill;

// 2. Dữ liệu mẫu (Data mẫu Duy cần đây)
var inventoryData = [
    {
        id: "AQ-001",
        name: "AquaClean Pro",
        type: "Vi sinh",
        stock: 150,
        unit: "Chai",
        expiry: "20-12-2026",
    },
    {
        id: "AQ-005",
        name: "Anti-Vibrio Plus",
        type: "Kháng sinh",
        stock: 8,
        unit: "Hộp",
        expiry: "15-08-2026",
    },
    {
        id: "AQ-012",
        name: "Iodine 9000",
        type: "Sát trùng",
        stock: 45,
        unit: "Can 5L",
        expiry: "01-01-2027",
    },
];

// 3. Hàm vẽ bảng dữ liệu ra màn hình
function renderInventory(data) {
    var inventoryTableBody = document.getElementById('inventoryTableBody');
    if (!inventoryTableBody) return;
    
    inventoryTableBody.innerHTML = data.map(function(item) {
        // Cảnh báo tồn kho thấp
        var stockClass = item.stock <= 10 ? 'text-danger fw-bold' : '';
        
        // Tính toán cảnh báo Hạn sử dụng
        var today = new Date();
        var expiryDate = new Date(item.expiry.split('-').reverse().join('-'));
        var diffDays = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
        
        var expiryClass = "";
        if (diffDays < 0) expiryClass = "text-danger fw-bold text-decoration-line-through";
        else if (diffDays <= 90) expiryClass = "text-warning fw-bold";

        return '<tr>' +
            '<td class="text-muted small">' + item.id + '</td>' +
            '<td class="fw-bold">' + item.name + '</td>' +
            '<td><span class="badge bg-light text-dark border">' + item.type + '</span></td>' +
            '<td class="' + stockClass + '">' + item.stock + '</td>' +
            '<td>' + item.unit + '</td>' +
            '<td class="' + expiryClass + '">' + item.expiry + '</td>' +
            '<td class="text-end">' +
                '<div class="btn-group">' +
                    '<button class="btn btn-sm btn-outline-aqua me-1" title="Sửa">' +
                        '<i class="bi bi-pencil-square"></i>' +
                    '</button>' +
                    '<button class="btn btn-sm btn-outline-danger" title="Xóa">' +
                        '<i class="bi bi-trash"></i>' +
                    '</button>' +
                '</div>' +
            '</td>' +
            '</tr>';
    }).join('');
}

// 4. Khởi tạo khi trang đã sẵn sàng
document.addEventListener("DOMContentLoaded", function () {
    // --- KHỞI TẠO QUILL (MÔ TẢ SẢN PHẨM) ---
    var editorContainer = document.querySelector("#quill-editor");
    if (editorContainer) {
        var quill = new Quill("#quill-editor", {
            theme: "snow",
            placeholder: "Nhập công dụng, liều lượng thuốc...",
            modules: {
                toolbar: [
                    [{ header: [1, 2, false] }],
                    ["bold", "italic", "underline"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    [{ align: [] }],
                    ["image", "link"],
                ],
                imageResize: { displaySize: true }, // Tính năng kéo dãn hình
            },
        });
        console.log("Quill đã sẵn sàng!");
    }

    // --- VẼ BẢNG DỮ LIỆU BAN ĐẦU ---
    renderInventory(inventoryData);

    // --- XỬ LÝ BỘ LỌC TÌM KIẾM ---
    var searchInput = document.getElementById("searchMedicine");
    var filterCat = document.getElementById("filterCategory");
    var filterStat = document.getElementById("filterStatus");

    function applyFilters() {
        var keyword = searchInput.value.toLowerCase();
        var category = filterCat.value;
        var status = filterStat.value;

        var filtered = inventoryData.filter(function (item) {
            var matchKeyword =
                item.name.toLowerCase().includes(keyword) ||
                item.id.toLowerCase().includes(keyword);
            var matchCategory = category === "" || item.type === category;
            var matchStatus =
                status === "" ||
                (status === "sap-het" ? item.stock <= 10 : item.stock > 10);

            return matchKeyword && matchCategory && matchStatus;
        });
        renderInventory(filtered);
    }

    if (searchInput) searchInput.addEventListener("input", applyFilters);
    if (filterCat) filterCat.addEventListener("change", applyFilters);
    if (filterStat) filterStat.addEventListener("change", applyFilters);
});
