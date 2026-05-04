// ============================================
// AQUACORE - Navigation & Page Switching
// ============================================
// Species data based on research from PDF
const speciesData = {
  tilapia: {
    name: "Nile Tilapia",
    tempRange: [26, 30],
    lightRange: [1000, 2000],
    flowRange: [0.05, 0.3], // m/s
    tempOptimal: "26-30°C",
    lightOptimal: "1000-2000 Lux",
    flowOptimal: "0.05-0.30 m/s",
  },
  mullet: {
    name: "Grey Mullet",
    tempRange: [20, 26],
    lightRange: [540, 1080],
    flowRange: [0.2, 0.6],
    tempOptimal: "20-26°C",
    lightOptimal: "540-1080 Lux",
    flowOptimal: "0.20-0.60 m/s",
  },
  catfish: {
    name: "African Catfish",
    tempRange: [24, 29],
    lightRange: [70, 500],
    flowRange: [0.05, 0.2],
    tempOptimal: "24-29°C",
    lightOptimal: "70-500 Lux",
    flowOptimal: "0.05-0.20 m/s",
  },
};
document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initFirebase(); // لو عندك Firebase
});

// ===== NAVIGATION =====
function initNavigation() {
  const navButtons = document.querySelectorAll(".nav-btn");

  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetPage = button.getAttribute("data-page");
      switchPage(targetPage);

      // Update active button
      navButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
    });
  });

  console.log("✅ Navigation initialized");
}

function switchPage(pageId) {
  // Hide all pages
  const allPages = document.querySelectorAll(".comic-page");
  allPages.forEach((page) => {
    page.classList.remove("active");
  });

  // Show target page
  const targetPage = document.getElementById(`page-${pageId}`);
  if (targetPage) {
    targetPage.classList.add("active");

    // Animation effect
    targetPage.style.animation = "none";
    setTimeout(() => {
      targetPage.style.animation = "comicPop 0.4s ease-out";
    }, 10);
  }

  console.log(`📄 Switched to: ${pageId}`);
}

// ===== FIREBASE (لو عندك) =====
function initFirebase() {
  // Listen for sensor data
  database.ref("sensors").on("value", (snapshot) => {
    const data = snapshot.val();
    if (data) {
      document.getElementById("temp-value").textContent =
        data.temperature.toFixed(1);
      document.getElementById("light-value").textContent = data.light;
      document.getElementById("flow-value").textContent = data.flow.toFixed(1);
      document.getElementById("species-display").textContent =
        `${data.fishName} (Optimal: ${data.tempMin}-${data.tempMax}°C)`;
    }
  });

  // Listen for device states
  database.ref("devices").on("value", (snapshot) => {
    const devices = snapshot.val();
    if (devices) {
      document.getElementById("pump-status").textContent = devices.pumpStatus;
      document.getElementById("fan-status").textContent = devices.fan1Status;
    }
  });
}
