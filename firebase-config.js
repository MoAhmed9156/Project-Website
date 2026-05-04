<<<<<<< HEAD
/* ============================================
   FIREBASE CONFIGURATION - AquaCore Dashboard
   Red Sea STEM School - Grade 11 - 2025/2026
   ============================================ */

// Firebase configuration template
// Replace with your actual Firebase project credentials
=======
// firebase-config.js
>>>>>>> 5433bed (New Files for website active with Firebase & Responsive)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
};

// Initialize Firebase
<<<<<<< HEAD
let firebaseApp;
let firebaseDatabase;
let sensorRef;

function initializeFirebase() {
  try {
    firebaseApp = firebase.initializeApp(firebaseConfig);
    firebaseDatabase = firebase.database();

    // Reference to sensor data node
    sensorRef = firebaseDatabase.ref("aquacore/sensors");

    console.log("✅ Firebase initialized successfully");
    updateFirebaseStatus(true);

    // Start listening to sensor data
    listenToSensors();
  } catch (error) {
    console.error("❌ Firebase initialization failed:", error);
    updateFirebaseStatus(false);

    // Fallback to demo mode
    console.log("🔄 Switching to DEMO MODE");
    startDemoMode();
  }
}

function updateFirebaseStatus(connected) {
  const statusEl = document.getElementById("firebase-status");
  if (statusEl) {
    statusEl.textContent = connected ? "🟢" : "🔴";
    statusEl.nextElementSibling.textContent = connected
      ? "FIREBASE ONLINE"
      : "FIREBASE OFFLINE";
  }
}

function updateESPStatus(connected) {
  const statusEl = document.getElementById("esp-status");
  if (statusEl) {
    statusEl.textContent = connected ? "🟢" : "🔴";
    statusEl.nextElementSibling.textContent = connected
      ? "ESP32 CONNECTED"
      : "ESP32 DISCONNECTED";
  }
}

// Listen to real-time sensor data from Firebase
function listenToSensors() {
  if (!sensorRef) return;

  sensorRef.on(
    "value",
    (snapshot) => {
      const data = snapshot.val();
      if (data) {
        updateESPStatus(true);
        processSensorData(data);
      } else {
        updateESPStatus(false);
      }
    },
    (error) => {
      console.error("Firebase read error:", error);
      updateESPStatus(false);
      updateFirebaseStatus(false);
    },
  );

  // Also listen to connection state
  const connectedRef = firebaseDatabase.ref(".info/connected");
  connectedRef.on("value", (snap) => {
    updateFirebaseStatus(snap.val() === true);
  });
}

// Process incoming sensor data
function processSensorData(data) {
  // Expected data structure from ESP32:
  // {
  //   temperature: 26.5,
  //   light: 1200,
  //   flow: 4.2,
  //   timestamp: 1234567890,
  //   pumpStatus: true,
  //   filterStatus: true
  // }

  const sensors = {
    temperature: data.temperature || data.temp || 0,
    light: data.light || data.lightIntensity || data.lux || 0,
    flow: data.flow || data.flowRate || data.waterFlow || 0,
    pumpStatus: data.pumpStatus || data.pump || false,
    filterStatus: data.filterStatus || data.filter || false,
  };

  // Update sensor displays
  updateSensorDisplay("temp", sensors.temperature, "°C");
  updateSensorDisplay("light", sensors.light, "Lux");
  updateSensorDisplay("flow", sensors.flow, "L/min");

  // Update system status
  updateSystemStatus(sensors);

  // Check thresholds and trigger alerts
  checkThresholds(sensors);

  // Update recovery timers
  updateRecoveryTimers(sensors);

  // Add data to charts
  addChartData(sensors);

  // Update last update time
  document.getElementById("last-update").textContent =
    new Date().toLocaleTimeString();
}

function updateSensorDisplay(type, value, unit) {
  const valueEl = document.getElementById(`${type}-value`);
  if (valueEl) {
    valueEl.textContent = parseFloat(value).toFixed(1);
  }
}

function updateSystemStatus(sensors) {
  const pumpEl = document.getElementById("pump-status");
  const filterEl = document.getElementById("filter-status");

  if (pumpEl) {
    pumpEl.textContent = sensors.pumpStatus ? "🟢" : "🔴";
  }
  if (filterEl) {
    filterEl.textContent = sensors.filterStatus ? "🟢" : "🟡";
  }
}

// DEMO MODE - Simulated sensor data for testing
let demoInterval;

function startDemoMode() {
  console.log("🎮 DEMO MODE: Simulating ESP32 sensor data");

  // Simulate realistic aquaculture data with occasional fluctuations
  let baseTemp = 26.0;
  let baseLight = 1000;
  let baseFlow = 4.5;

  demoInterval = setInterval(() => {
    // Add small random variations
    const temp = baseTemp + (Math.random() - 0.5) * 2;
    const light = baseLight + (Math.random() - 0.5) * 300;
    const flow = baseFlow + (Math.random() - 0.5) * 1.5;

    // Occasional spike to test alerts (5% chance)
    if (Math.random() < 0.05) {
      baseTemp += (Math.random() - 0.5) * 4;
      baseLight += (Math.random() - 0.5) * 800;
      baseFlow += (Math.random() - 0.5) * 4;
    }

    // Gradual return to normal
    baseTemp += (26 - baseTemp) * 0.1;
    baseLight += (1000 - baseLight) * 0.1;
    baseFlow += (4.5 - baseFlow) * 0.1;

    const demoData = {
      temperature: temp,
      light: light,
      flow: flow,
      pumpStatus: true,
      filterStatus: true,
      timestamp: Date.now(),
    };

    processSensorData(demoData);
  }, 3000); // Update every 3 seconds
}

function stopDemoMode() {
  if (demoInterval) {
    clearInterval(demoInterval);
    demoInterval = null;
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Try to initialize Firebase
  // If credentials are not set, it will fall back to demo mode
  initializeFirebase();
});

// Export for use in other modules
window.firebaseApp = firebaseApp;
window.firebaseDatabase = firebaseDatabase;
window.sensorRef = sensorRef;
window.stopDemoMode = stopDemoMode;
=======
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
>>>>>>> 5433bed (New Files for website active with Firebase & Responsive)
