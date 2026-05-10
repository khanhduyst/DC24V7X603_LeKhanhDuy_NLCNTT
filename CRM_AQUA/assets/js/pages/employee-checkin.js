let stream;
let cameraModal;

document.addEventListener("DOMContentLoaded", () => {
  const modalEl = document.getElementById("cameraModal");
  if (modalEl) {
    cameraModal = new bootstrap.Modal(modalEl);
  }
});

async function startCamera() {
  const video = document.getElementById("video");
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false,
    });
    video.srcObject = stream;
    cameraModal.show();
    updateLiveStamp();
  } catch (err) {
    Swal.fire({
      title: "Truy cập thất bại",
      text: "Hệ thống không thể kết nối với thiết bị Camera. Vui lòng kiểm tra quyền truy cập của trình duyệt.",
      icon: "error",
      confirmButtonColor: "#0d6efd",
      confirmButtonText: "Xác nhận",
    });
  }
}

function updateLiveStamp() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude.toFixed(4);
      const lng = pos.coords.longitude.toFixed(4);
      const liveDataEl = document.getElementById("live-data");
      if (liveDataEl) {
        liveDataEl.innerText = `${new Date().toLocaleDateString("vi-VN")} | Tọa độ GPS: ${lat}, ${lng}`;
      }
    });
  }
}

async function processCapture() {
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  Swal.fire({
    title: 'Đang xử lý dữ liệu',
    text: 'Hệ thống đang xác thực vị trí và trích xuất địa chỉ...',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);

  const finalAddr = document.getElementById("final-address");

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
        );
        const data = await res.json();
        const a = data.address;
        const ap = a.road || a.village || a.hamlet || "";
        const huyen = a.district || a.county || "";
        const tinh = a.city || a.state || "";
        const cleanAddr = [ap, huyen, tinh].filter(Boolean).join(", ");

        finalAddr.innerText = cleanAddr || data.display_name;
        document.getElementById("final-coords").innerText = `Tọa độ chi tiết: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;

        document.getElementById("photo-preview").src = canvas.toDataURL("image/jpeg");
        document.getElementById("preview-container").classList.remove("d-none");
        document.getElementById("start-camera-btn").classList.add("d-none");
        
        Swal.close();
      } catch (e) {
        Swal.fire({
          icon: 'warning',
          title: 'Cảnh báo hệ thống',
          text: 'Không thể truy xuất địa chỉ chi tiết từ máy chủ. Vui lòng kiểm tra kết nối mạng.',
          confirmButtonColor: "#0d6efd",
        });
        finalAddr.innerText = "Dữ liệu địa chỉ không khả dụng.";
      }
      closeCamera();
    }, (err) => {
        Swal.fire({
            icon: 'error',
            title: 'Lỗi định vị',
            text: 'Yêu cầu kích hoạt GPS để thực hiện tính năng Check-in.',
            confirmButtonColor: "#0d6efd",
        });
    });
  }
}

function closeCamera() {
  if (stream) stream.getTracks().forEach((t) => t.stop());
  if (cameraModal) cameraModal.hide();
}

function retakePhoto() {
  document.getElementById("preview-container").classList.add("d-none");
  document.getElementById("start-camera-btn").classList.remove("d-none");
  startCamera();
}

function handleCheckIn() {
  const customer = document.getElementById("customerSelect").value;
  const previewImg = document.getElementById("photo-preview").src;

  if (!customer || customer.includes("--")) {
    Swal.fire({
      title: "Thông tin không hợp lệ",
      text: "Vui lòng chọn Khách hàng hoặc Đại lý trước khi xác nhận.",
      icon: "warning",
      confirmButtonColor: "#0d6efd",
      confirmButtonText: "Quay lại",
    });
    return;
  }

  if (!previewImg || previewImg === window.location.href) {
     Swal.fire({
      title: "Thiếu dữ liệu hình ảnh",
      text: "Vui lòng cung cấp hình ảnh thực tế tại địa điểm check-in.",
      icon: "info",
      confirmButtonColor: "#0d6efd",
    });
    return;
  }

  Swal.fire({
    title: "Check-in thành công",
    text: "Dữ liệu vị trí và hình ảnh đã được ghi nhận trên hệ thống.",
    icon: "success",
    confirmButtonColor: "#0d6efd",
    confirmButtonText: "Hoàn tất",
    timer: 3000,
  });
}