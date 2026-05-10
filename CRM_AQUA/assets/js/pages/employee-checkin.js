let stream;
let cameraModal;

document.addEventListener("DOMContentLoaded", () => {
  cameraModal = new bootstrap.Modal(document.getElementById("cameraModal"));
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
    alert("Không thể mở camera: " + err);
  }
}

function updateLiveStamp() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude.toFixed(4);
      const lng = pos.coords.longitude.toFixed(4);
      document.getElementById("live-data").innerText =
        `${new Date().toLocaleDateString("vi-VN")} | GPS: ${lat}, ${lng}`;
    });
  }
}

async function processCapture() {
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);

  const finalAddr = document.getElementById("final-address");
  finalAddr.innerText = "Đang lấy địa chỉ chi tiết...";

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
        document.getElementById("final-coords").innerText =
          `GPS: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;

        document.getElementById("photo-preview").src =
          canvas.toDataURL("image/jpeg");
        document.getElementById("preview-container").classList.remove("d-none");
        document.getElementById("start-camera-btn").classList.add("d-none");
      } catch (e) {
        finalAddr.innerText = "Lỗi lấy địa chỉ mạng.";
      }
      closeCamera();
    });
  }
}

function closeCamera() {
  if (stream) stream.getTracks().forEach((t) => t.stop());
  cameraModal.hide();
}

function retakePhoto() {
  document.getElementById("preview-container").classList.add("d-none");
  document.getElementById("start-camera-btn").classList.remove("d-none");
  startCamera();
}

function handleCheckIn() {
  const customer = document.getElementById("customerSelect").value;
  if (!customer || customer.includes("disabled")) {
    alert("Vui lòng chọn khách hàng!");
    return;
  }
  alert("Đã ghi nhận Check-in thành công!");
}
