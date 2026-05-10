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

async function takePhoto() {
  console.log("Đã bấm nút chụp!"); // Kiểm tra xem nút có ăn lệnh không

  const video = document.querySelector("#video");
  const canvas = document.querySelector("#canvas");
  const photoPreview = document.querySelector("#photo-preview");
  const finalAddress = document.querySelector("#final-address");

  if (!video || !finalAddress) {
    console.error(
      "LỖI: Không tìm thấy thẻ video hoặc final-address trong HTML!",
    );
    alert("Lỗi giao diện, hãy kiểm tra Console Eruda");
    return;
  }

  // Chụp ảnh ngay
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);

  if (navigator.geolocation) {
    finalAddress.innerText = "Đang định vị GPS...";
    console.log("Đang gọi GPS...");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        console.log("Tọa độ lấy được:", lat, lng);

        try {
          // Gọi API lấy địa chỉ
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
          );
          const data = await response.json();
          const displayAddr = data.display_name;

          console.log("Địa chỉ lấy được:", displayAddr);

          // Cập nhật ra ngoài
          finalAddress.innerText = displayAddr;
          photoPreview.src = canvas.toDataURL("image/jpeg");

          // Hiện khung preview
          document
            .querySelector("#preview-container")
            .classList.remove("d-none");

          // Đóng camera
          closeCamera();
          console.log("Check-in thành công!");
        } catch (err) {
          console.error("Lỗi API:", err);
          finalAddress.innerText = "Lỗi kết nối địa chỉ!";
        }
      },
      (error) => {
        console.error("Lỗi GPS:", error.message);
        finalAddress.innerText = "Lỗi: " + error.message;
      },
      { enableHighAccuracy: true, timeout: 5000 },
    );
  } else {
    console.error("Trình duyệt không hỗ trợ Geolocation");
  }
}


function handleCaptureAndCheckin() {
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const photoPreview = document.getElementById("photo-preview");
  const ctx = canvas.getContext("2d");

  // 1. Chụp ảnh từ Video
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // 2. Lấy dữ liệu để đóng dấu (Watermark)
  const address = document.getElementById("live-address").innerText;
  const info = document.getElementById("live-data").innerText;

  // Vẽ nền mờ cho chữ
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, canvas.height - 150, canvas.width, 150);

  // Vẽ chữ đóng dấu
  ctx.fillStyle = "white";
  ctx.font = "bold 28px Arial";
  ctx.fillText(address, 30, canvas.height - 90);
  ctx.font = "22px Arial";
  ctx.fillText(info, 30, canvas.height - 50);
  ctx.fillText("XÁC NHẬN CHECK-IN TẠI AO", 30, canvas.height - 20);

  // 3. Hiển thị kết quả ra màn hình chính
  const finalImage = canvas.toDataURL("image/jpeg");
  photoPreview.src = finalImage;
  document.getElementById("preview-container").classList.remove("d-none");

  // 4. Thông báo và đóng Camera
  alert("Đã ghi nhận vị trí và hình ảnh check-in!");
  closeCamera();

  // Gợi ý: Ở đây em có thể gọi thêm hàm lưu vào Database luôn
  // saveCheckinData(finalImage, address, info);
}

function closeCamera() {
  if (stream) stream.getTracks().forEach((t) => t.stop());
  bootstrap.Modal.getInstance(document.getElementById("cameraModal")).hide();
}
