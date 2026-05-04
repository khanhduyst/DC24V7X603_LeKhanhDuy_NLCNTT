async function loadLayout() {
  try {
    const sidebarRes = await fetch("components/sidebar.html");
    document.getElementById("sidebar-container").innerHTML =
      await sidebarRes.text();

    const headerRes = await fetch("components/header.html");
    document.getElementById("header-container").innerHTML =
      await headerRes.text();

    const btnToggle = document.getElementById("toggleSidebar");
    const sidebar = document.querySelector(".sidebar");

    let overlay = document.querySelector(".sidebar-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "sidebar-overlay";
      document.body.appendChild(overlay);
    }

    btnToggle.addEventListener("click", () => {
      sidebar.classList.toggle("show");
      overlay.classList.toggle("show");
    });

    overlay.addEventListener("click", () => {
      sidebar.classList.remove("show");
      overlay.classList.remove("show");
    });

    const currentPath =
      window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-link").forEach((link) => {
      if (link.getAttribute("href") === currentPath) {
        link.classList.add("active");
      }
    });
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", loadLayout);
