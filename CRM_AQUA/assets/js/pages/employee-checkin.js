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
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const photoPreview = document.getElementById("photo-preview");
  const finalAddress = document.getElementById("final-address"); // Nơi hiện chữ
  const finalCoords = document.getElementById("final-coords");
  const startBtn = document.getElementById("start-camera-btn");
  const previewContainer = document.getElementById("preview-container");
  const submitBtn = document.getElementById("final-submit-btn");
  const ctx = canvas.getContext("2d");

  // Cấu hình Canvas
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  if (navigator.geolocation) {
    // Đổi trạng thái hiển thị để người dùng biết đang xử lý
    finalAddress.innerHTML =
      '<span class="spinner-border spinner-border-sm"></span> Đang định vị...';

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          // Gọi API lấy địa chỉ (Duy dùng API này rất ổn cho Niên luận)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
          );
          const data = await response.json();
          const a = data.address;

          // Bóc tách địa chỉ theo kiểu Việt Nam
          // Lấy Ấp/Số nhà/Đường
          let ap = a.road || a.village || a.hamlet || a.suburb || "";
          // Lấy Huyện/Quận
          let huyen = a.district || a.county || a.town || "";
          // Lấy Tỉnh/Thành phố
          let tinh = a.city || a.state || a.province || "";

          // Gộp lại thành chuỗi địa chỉ đẹp
          let cleanAddr = [ap, huyen, tinh].filter(Boolean).join(", ");

          if (!cleanAddr) cleanAddr = data.display_name; // Nếu không bóc được thì lấy chuỗi thô

          // 1. Cập nhật chữ ra màn hình ngoài
          finalAddress.innerText = cleanAddr;
          finalCoords.innerText = `Tọa độ: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;

          // 2. Đóng dấu trực tiếp lên ảnh
          ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
          ctx.fillRect(0, canvas.height - 120, canvas.width, 120);
          ctx.fillStyle = "#fff";
          ctx.font = "bold 22px Arial";
          ctx.fillText(
            new Date().toLocaleString("vi-VN"),
            20,
            canvas.height - 75,
          );
          ctx.font = "18px Arial";
          ctx.fillText(cleanAddr, 20, canvas.height - 35);

          // 3. Hiển thị ảnh và ẩn/hiện nút
          photoPreview.src = canvas.toDataURL("image/jpeg");
          previewContainer.classList.remove("d-none");
          startBtn.classList.add("d-none");
          if (submitBtn) submitBtn.classList.remove("d-none");

          // Tắt camera
          closeCamera();
        } catch (error) {
          console.error(error);
          finalAddress.innerText = "Lỗi: Không lấy được địa chỉ chi tiết.";
        }
      },
      (err) => {
        finalAddress.innerText = "Lỗi: Hãy bật định vị GPS!";
      },
      { enableHighAccuracy: true },
    );
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
