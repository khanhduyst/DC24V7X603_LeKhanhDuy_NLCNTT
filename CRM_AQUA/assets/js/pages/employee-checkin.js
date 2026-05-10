function handleCheckIn() {
    const customer = document.getElementById('customerSelect').value;
    const statusText = document.getElementById('locationStatus');

    if (!customer) {
        alert("Vui lòng chọn khách hàng trước!");
        return;
    }

    if (navigator.geolocation) {
        statusText.style.display = "block";
        statusText.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Đang lấy vị trí...';

        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            statusText.innerHTML = `<i class="bi bi-check-circle-fill text-success"></i> Tọa độ: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            
            alert(`Check-in thành công tại ${customer}!\nDữ liệu đã được gửi về hệ thống.`);
            
        }, (error) => {
            alert("Không thể lấy vị trí. Vui lòng bật định vị!");
            statusText.style.display = "none";
        });
    } else {
        alert("Trình duyệt của bạn không hỗ trợ định vị.");
    }
}

let stream;

async function startCamera() {
    const video = document.getElementById('video');
    const cameraContainer = document.getElementById('camera-container');
    const startBtn = document.getElementById('start-camera-btn');

    try {
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "environment" }, // Ưu tiên camera sau của điện thoại
            audio: false 
        });
        video.srcObject = stream;
        cameraContainer.classList.remove('d-none');
        startBtn.classList.add('d-none');
    } catch (err) {
        alert("Không thể truy cập Camera. Vui lòng kiểm tra quyền trình duyệt!");
    }
}

function takePhoto() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const photoPreview = document.getElementById('photo-preview');
    const cameraContainer = document.getElementById('camera-container');
    const previewContainer = document.getElementById('preview-container');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);

    const data = canvas.toDataURL('image/png');
    photoPreview.src = data;

    cameraContainer.classList.add('d-none');
    previewContainer.classList.remove('d-none');

    // Tắt camera để tiết kiệm pin
    stream.getTracks().forEach(track => track.stop());
}

function retakePhoto() {
    document.getElementById('preview-container').classList.add('d-none');
    startCamera();
}