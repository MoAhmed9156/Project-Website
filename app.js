<<<<<<< HEAD
/* ============================================
   AQUACORE MAIN APP - Dashboard Controller
   Red Sea STEM School - Grade 11 - 2025/2026
   ============================================ */

// Application State
const AppState = {
  currentPage: "dashboard",
  isDemoMode: false,
  sensorUpdateInterval: null,
};

// Initialize application
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 AquaCore Dashboard initializing...");
  console.log("📚 Red Sea STEM School - Grade 11 - 2025/2026");
  console.log("👥 Team: Omar, Moamen, Mohamed, Yassin");

  initNavigation();
  initKeyboardShortcuts();
  addHalftoneOverlay();

  console.log("✅ AquaCore Dashboard ready!");
});

// Navigation System
function initNavigation() {
  const navButtons = document.querySelectorAll(".nav-btn");
  const pages = document.querySelectorAll(".comic-page");

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetPage = btn.dataset.page;

      // Update active button
      navButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Update active page with animation
      pages.forEach((page) => {
        if (page.id === `page-${targetPage}`) {
          page.classList.add("active");
          // Trigger page-specific initialization
          initPage(targetPage);
        } else {
          page.classList.remove("active");
        }
      });

      AppState.currentPage = targetPage;

      // Play navigation sound effect (visual feedback)
      btn.style.transform = "scale(0.95)";
      setTimeout(() => {
        btn.style.transform = "";
      }, 100);
    });
  });
}

// Page-specific initialization
function initPage(pageName) {
  switch (pageName) {
    case "dashboard":
      // Refresh charts if needed
      if (typeof tempChart !== "undefined" && tempChart) tempChart.update();
      if (typeof lightChart !== "undefined" && lightChart) lightChart.update();
      if (typeof flowChart !== "undefined" && flowChart) flowChart.update();
      break;

    case "recovery":
      // Refresh recovery log table
      if (typeof updateLogTable === "function") {
        updateLogTable();
      }
      break;

    case "team":
      // Animate hero stat bars
      animateStatBars();
      break;

    case "prototype":
      // Animate loop diagram
      animateLoopDiagram();
      break;
  }
}

// Animate stat bars on team page
function animateStatBars() {
  const progressBars = document.querySelectorAll(".stat-progress");
  progressBars.forEach((bar) => {
    const targetWidth = bar.style.width;
    bar.style.width = "0%";
    setTimeout(() => {
      bar.style.width = targetWidth;
    }, 100);
  });
}

// Animate loop diagram
function animateLoopDiagram() {
  const steps = document.querySelectorAll(".loop-step");
  steps.forEach((step, index) => {
    step.style.opacity = "0";
    step.style.transform = "translateY(20px)";
    setTimeout(() => {
      step.style.transition = "all 0.5s ease-out";
      step.style.opacity = "1";
      step.style.transform = "translateY(0)";
    }, index * 200);
  });
}

// Keyboard Shortcuts
function initKeyboardShortcuts() {
  document.addEventListener("keydown", (e) => {
    // Ctrl/Cmd + number keys for quick navigation
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "1":
          e.preventDefault();
          document.querySelector('[data-page="dashboard"]')?.click();
          break;
        case "2":
          e.preventDefault();
          document.querySelector('[data-page="prototype"]')?.click();
          break;
        case "3":
          e.preventDefault();
          document.querySelector('[data-page="team"]')?.click();
          break;
        case "4":
          e.preventDefault();
          document.querySelector('[data-page="recovery"]')?.click();
          break;
        case "r":
          e.preventDefault();
          if (typeof resetLaunchTimer === "function") {
            resetLaunchTimer();
            alert("🚀 Launch timer reset!");
          }
          break;
      }
    }

    // Escape to dismiss alerts
    if (e.key === "Escape") {
      if (typeof dismissAlert === "function") {
        dismissAlert();
      }
    }
  });
}

// Add halftone overlay for comic book feel
function addHalftoneOverlay() {
  const overlay = document.createElement("div");
  overlay.className = "halftone-overlay";
  document.body.appendChild(overlay);
}

// Utility: Format timestamp
function formatTimestamp(timestamp) {
  return new Date(timestamp).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

// Utility: Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Utility: Throttle function
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Handle window resize
window.addEventListener(
  "resize",
  debounce(() => {
    // Resize charts if they exist
    if (typeof tempChart !== "undefined" && tempChart) tempChart.resize();
    if (typeof lightChart !== "undefined" && lightChart) lightChart.resize();
    if (typeof flowChart !== "undefined" && flowChart) flowChart.resize();
  }, 250),
);

// Handle visibility change (pause/resume updates when tab is hidden)
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    console.log("⏸️ Tab hidden - pausing non-essential updates");
  } else {
    console.log("▶️ Tab visible - resuming updates");
  }
});

// Export app functions
window.AppState = AppState;
window.formatTimestamp = formatTimestamp;
window.debounce = debounce;
window.throttle = throttle;
=======
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
>>>>>>> 5433bed (New Files for website active with Firebase & Responsive)
