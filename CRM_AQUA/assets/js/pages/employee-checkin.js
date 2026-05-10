function handleCheckIn() {
  const customer = document.getElementById("customerSelect").value;
  const statusText = document.getElementById("locationStatus");

  if (!customer) {
    alert("Vui lòng chọn khách hàng trước!");
    return;
  }

  if (navigator.geolocation) {
    statusText.style.display = "block";
    statusText.innerHTML =
      '<span class="spinner-border spinner-border-sm me-2"></span>Đang lấy vị trí...';

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        statusText.innerHTML = `<i class="bi bi-check-circle-fill text-success"></i> Tọa độ: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;

        alert(
          `Check-in thành công tại ${customer}!\nDữ liệu đã được gửi về hệ thống.`,
        );
      },
      (error) => {
        alert("Không thể lấy vị trí. Vui lòng bật định vị!");
        statusText.style.display = "none";
      },
    );
  } else {
    alert("Trình duyệt của bạn không hỗ trợ định vị.");
  }
}
let stream;
let cameraModal;

// Tự động load Modal khi trang web sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
  cameraModal = new bootstrap.Modal(document.getElementById("cameraModal"));
});

async function startCamera() {
  const video = document.getElementById("video");
  const startBtn = document.getElementById("start-camera-btn");
  const liveTime = document.getElementById("live-time");
  const liveLocation = document.getElementById("live-location");

  try {
    // 1. Xin quyền mở camera sau
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false,
    });
    video.srcObject = stream;

    // 2. Mở Modal toàn màn hình
    cameraModal.show();
    startBtn.classList.add("d-none");

    // 3. Hiển thị thông tin TimeStamp live
    updateLiveStamp(liveTime, liveLocation);
  } catch (err) {
    alert("Không thể truy cập Camera. Vui lòng kiểm tra quyền trình duyệt!");
  }
}

function updateLiveStamp(timeEl, locEl) {
  const now = new Date();
  timeEl.innerText = now.toLocaleString("vi-VN");

  // Lấy tọa độ
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        locEl.innerText = `GPS: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`;
      },
      () => {
        locEl.innerText = "GPS: Không xác định";
      },
    );
  }
}

function takePhoto() {
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const photoPreview = document.getElementById("photo-preview");
  const previewContainer = document.getElementById("preview-container");
  const ctx = canvas.getContext("2d");

  // Thiết lập kích thước canvas
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // 1. Vẽ hình từ video lên canvas
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // 2. Vẽ Watermark Đóng dấu (TimeStamp)
  // Duy copy logic vẽ đè (DrawImage, WrapText) mà anh đã hướng dẫn ở câu trước dán vào đây nhé.
  // ... logic vẽ đè của câu trước ...
  // (Bổ sung: Ở đây, Duy hãy vẽ thông tin vào ảnh thật)

  // 3. Chuyển canvas thành ảnh
  const data = canvas.toDataURL("image/png");
  photoPreview.src = data;

  // 4. Đóng camera và quay về web
  previewContainer.classList.remove("d-none");
  closeCamera();
}

function closeCamera() {
  // Tắt stream để tiết kiệm pin
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
  cameraModal.hide();
  const startBtn = document.getElementById("start-camera-btn");
  if (document.getElementById("photo-preview").src === "") {
    startBtn.classList.remove("d-none");
  }
}

function retakePhoto() {
  document.getElementById("preview-container").classList.add("d-none");
  document.getElementById("photo-preview").src = "";
  startCamera();
}
