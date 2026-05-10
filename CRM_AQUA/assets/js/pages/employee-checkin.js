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

async function startCamera() {
  const video = document.getElementById("video");
  const cameraContainer = document.getElementById("camera-container");
  const startBtn = document.getElementById("start-camera-btn");

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }, // Ưu tiên camera sau của điện thoại
      audio: false,
    });
    video.srcObject = stream;
    cameraContainer.classList.remove("d-none");
    startBtn.classList.add("d-none");
  } catch (err) {
    alert("Không thể truy cập Camera. Vui lòng kiểm tra quyền trình duyệt!");
  }
}

function retakePhoto() {
  document.getElementById("preview-container").classList.add("d-none");
  startCamera();
}

async function takePhoto() {
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const photoPreview = document.getElementById("photo-preview");
  const cameraContainer = document.getElementById("camera-container");
  const previewContainer = document.getElementById("preview-container");
  const ctx = canvas.getContext("2d");

  // 1. Thiết lập kích thước canvas bằng video
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // 2. Vẽ hình ảnh từ camera lên canvas
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // 3. Lấy thông tin vị trí và thời gian
  const now = new Date();
  const timeStr = now.toLocaleString("vi-VN");

  // Lấy tọa độ từ trình duyệt (đã xin quyền ở bước trước)
  navigator.geolocation.getCurrentPosition(async (position) => {
    const lat = position.coords.latitude.toFixed(6);
    const lng = position.coords.longitude.toFixed(6);
    const coordsStr = `Tọa độ: ${lat}, ${lng}`;

    // Lấy địa chỉ thô (Dùng API miễn phí của OSM để demo)
    let addressStr = "Đang lấy địa chỉ...";
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      );
      const data = await response.json();
      addressStr = data.display_name;
    } catch (e) {
      addressStr = "Địa chỉ: Không xác định";
    }

    // 4. Vẽ lớp phủ (Watermark) giống TimeStamp
    // Vẽ hình chữ nhật mờ phía dưới để chữ nổi bật
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.fillRect(0, canvas.height - 120, canvas.width, 120);

    // Cấu hình chữ
    ctx.fillStyle = "white";
    ctx.font = "bold 20px Arial";

    // Vẽ Thời gian
    ctx.fillText(timeStr, 20, canvas.height - 85);

    // Vẽ Tọa độ
    ctx.font = "16px Arial";
    ctx.fillText(coordsStr, 20, canvas.height - 60);

    // Vẽ Địa chỉ (Tự động xuống dòng nếu quá dài)
    const maxWidth = canvas.width - 40;
    ctx.font = "italic 14px Arial";
    wrapText(ctx, addressStr, 20, canvas.height - 35, maxWidth, 20);

    // 5. Hiển thị ảnh đã đóng dấu
    const dataURL = canvas.toDataURL("image/png");
    photoPreview.src = dataURL;

    cameraContainer.classList.add("d-none");
    previewContainer.classList.remove("d-none");

    // Tắt stream camera
    stream.getTracks().forEach((track) => track.stop());
  });
}

// Hàm bổ trợ vẽ chữ xuống dòng
function wrapText(context, text, x, y, maxWidth, lineHeight) {
  var words = text.split(" ");
  var line = "";
  for (var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + " ";
    var metrics = context.measureText(testLine);
    var testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
}
