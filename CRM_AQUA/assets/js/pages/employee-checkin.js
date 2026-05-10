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
    // Thông báo lỗi khi không mở được camera
    Swal.fire({
      title: "Lỗi Camera!",
      text: "Không thể truy cập camera. Vui lòng cấp quyền hoặc kiểm tra thiết bị.",
      icon: "error",
      confirmButtonColor: "#0d6efd",
      confirmButtonText: "Đã hiểu",
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
        liveDataEl.innerText = `${new Date().toLocaleDateString("vi-VN")} | GPS: ${lat}, ${lng}`;
      }
    });
  }
}

async function processCapture() {
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  // Hiển thị Loading trong khi xử lý
  Swal.fire({
    title: 'Đang xử lý...',
    text: 'Đang xác thực tọa độ và địa chỉ',
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
        document.getElementById("final-coords").innerText = `GPS: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;

        document.getElementById("photo-preview").src = canvas.toDataURL("image/jpeg");
        document.getElementById("preview-container").classList.remove("d-none");
        document.getElementById("start-camera-btn").classList.add("d-none");
        
        // Đóng Loading sau khi hoàn tất
        Swal.close();
      } catch (e) {
        Swal.fire({
          icon: 'warning',
          title: 'Lưu ý',
          text: 'Không thể lấy địa chỉ chi tiết, nhưng ảnh đã được lưu.',
        });
        finalAddr.innerText = "Không lấy được địa chỉ mạng.";
      }
      closeCamera();
    }, (err) => {
        Swal.fire({
            icon: 'error',
            title: 'Lỗi GPS',
            text: 'Vui lòng bật định vị để chụp ảnh check-in!',
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

  // Kiểm tra khách hàng
  if (!customer || customer.includes("--")) {
    Swal.fire({
      title: "Thiếu thông tin!",
      text: "Duy ơi, em chưa chọn khách hàng/đại lý kìa.",
      icon: "warning",
      confirmButtonColor: "#0d6efd",
      confirmButtonText: "Để em chọn lại",
    });
    return;
  }

  // Kiểm tra xem đã chụp hình chưa
  if (!previewImg || previewImg.includes("window.location")) {
     Swal.fire({
      title: "Chưa chụp ảnh!",
      text: "Em cần chụp ảnh tại ao để làm bằng chứng check-in nhé.",
      icon: "info",
      confirmButtonColor: "#0d6efd",
    });
    return;
  }

  // Thông báo thành công cuối cùng
  Swal.fire({
    title: "Thành công!",
    text: "Đã ghi nhận hình ảnh và vị trí check-in của Duy.",
    icon: "success",
    confirmButtonColor: "#0d6efd",
    confirmButtonText: "Tuyệt vời",
    timer: 2500,
  });
}