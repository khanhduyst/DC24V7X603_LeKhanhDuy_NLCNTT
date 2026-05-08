document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formAddEmployee");

  if (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        } else {
          event.preventDefault();
          const formData = new FormData(form);
          const data = Object.fromEntries(formData.entries());

          console.log("Dữ liệu nhân viên đang được xử lý:", data);
          alert("Đã thêm nhân viên thành công!");
          // Logic gửi API sẽ nằm ở đây
        }

        form.classList.add("was-validated");
      },
      false,
    );
  }
});

function previewFile() {
  const preview = document.querySelector("#imgOut");
  const file = document.querySelector("#employeeAvatar").files[0];
  const icon = document.querySelector("#cameraIcon");
  const reader = new FileReader();

  reader.onloadend = function () {
    preview.src = reader.result;
    preview.style.display = "block"; // Hiện hình ảnh lên
    icon.style.display = "none"; // Ẩn icon máy ảnh đi
  };

  if (file) {
    reader.readAsDataURL(file);
  } else {
    preview.src = "";
  }
}