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

document.getElementById("empType").addEventListener("change", function () {
  const salaryGroup = document.getElementById("baseSalaryGroup");
  const salaryInput = salaryGroup.querySelector("input");

  if (this.value === "collaborator") {
    salaryInput.value = "0";
    salaryInput.disabled = true;
    salaryGroup.style.opacity = "0.5";
  } else {
    salaryInput.disabled = false;
    salaryGroup.style.opacity = "1";
  }
});

function generatePass() {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#";
  let pass = "";
  for (let i = 0; i < 8; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  document.getElementById("tempPassword").value = "Aqua@" + pass;
}
