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

async function startCamera() {
  const video = document.getElementById("video");
  cameraModal = new bootstrap.Modal(document.getElementById("cameraModal"));

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "environment",
        width: { ideal: 1920 },
        height: { ideal: 1080 },
      },
      audio: false,
    });
    video.srcObject = stream;
    cameraModal.show();
    updateLiveInfo();
  } catch (err) {
    alert("Lỗi camera: " + err);
  }
}

function updateLiveInfo() {
  const addr = document.getElementById("live-address");
  const data = document.getElementById("live-data");
  const now = new Date();

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude.toFixed(4);
      const lng = pos.coords.longitude.toFixed(4);
      data.innerText = `${now.toLocaleDateString("vi-VN")} | GPS: ${lat}, ${lng}`;

      // Gọi API lấy địa chỉ thực tế (OSM)
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        );
        const json = await res.json();
        addr.innerText =
          json.address.city || json.address.state || "SÓC TRĂNG, VIỆT NAM";
      } catch (e) {
        addr.innerText = "SÓC TRĂNG, VIỆT NAM";
      }
    });
  }
}

function takePhoto() {
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const preview = document.getElementById("photo-preview");
  const ctx = canvas.getContext("2d");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);

  // Đóng dấu lên ảnh
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(0, canvas.height - 100, canvas.width, 100);
  ctx.fillStyle = "white";
  ctx.font = "bold 40px Arial";
  ctx.fillText(
    document.getElementById("live-address").innerText,
    30,
    canvas.height - 60,
  );
  ctx.font = "30px Arial";
  ctx.fillText(
    document.getElementById("live-data").innerText,
    30,
    canvas.height - 25,
  );

  preview.src = canvas.toDataURL("image/jpeg");
  document.getElementById("preview-container").classList.remove("d-none");
  closeCamera();
}

function closeCamera() {
  if (stream) stream.getTracks().forEach((t) => t.stop());
  bootstrap.Modal.getInstance(document.getElementById("cameraModal")).hide();
}
