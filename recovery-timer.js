/* ============================================
   RECOVERY TIMER LOGIC - AquaCore Capstone Core
   Red Sea STEM School - Grade 11 - 2025/2026
   
   Logic:
   - When a parameter leaves optimal range → START timer
   - When parameter returns to optimal range → STOP timer
   - Track: Individual Recovery Time + Total System Recovery Time
   ============================================ */

// Recovery Timer State
const RecoveryState = {
  // Current timer states for each parameter
  timers: {
    temperature: { startTime: null, isRunning: false, currentDuration: 0 },
    light: { startTime: null, isRunning: false, currentDuration: 0 },
    flow: { startTime: null, isRunning: false, currentDuration: 0 },
  },

  // Historical log of all recovery events
  log: [],

  // Statistics
  stats: {
    totalAlerts: 0,
    totalRecoveryTime: 0, // in milliseconds
    longestOutage: 0,
    systemStartTime: Date.now(),
  },

  // Active alerts (parameters currently out of range)
  activeAlerts: new Set(),
};

// Species optimal ranges
const SpeciesRanges = {
  tilapia: {
    temperature: { min: 25, max: 28 },
    light: { min: 800, max: 1500 },
    flow: { min: 4, max: 6 },
  },
  catfish: {
    temperature: { min: 26, max: 30 },
    light: { min: 500, max: 1000 },
    flow: { min: 3, max: 5 },
  },
  mullet: {
    temperature: { min: 20, max: 25 },
    light: { min: 1000, max: 2000 },
    flow: { min: 5, max: 8 },
  },
  barramundi: {
    temperature: { min: 27, max: 30 },
    light: { min: 1500, max: 2500 },
    flow: { min: 6, max: 10 },
  },
};

let currentSpecies = "tilapia";

// Initialize recovery system
document.addEventListener("DOMContentLoaded", () => {
  // Load saved data from localStorage
  loadRecoveryData();

  // Start the display update interval
  setInterval(updateRecoveryDisplay, 1000);

  // Update species selector listener
  const speciesSelect = document.getElementById("species-select");
  if (speciesSelect) {
    speciesSelect.addEventListener("change", (e) => {
      currentSpecies = e.target.value;
      updateRangeDisplay();
      // Re-check current values against new ranges
      checkAllThresholds();
    });
  }

  updateRangeDisplay();
});

// Update the displayed ranges based on selected species
function updateRangeDisplay() {
  const ranges = SpeciesRanges[currentSpecies];

  const tempRangeEl = document.getElementById("temp-range");
  const lightRangeEl = document.getElementById("light-range");
  const flowRangeEl = document.getElementById("flow-range");

  if (tempRangeEl)
    tempRangeEl.textContent = `${ranges.temperature.min}-${ranges.temperature.max}`;
  if (lightRangeEl)
    lightRangeEl.textContent = `${ranges.light.min}-${ranges.light.max}`;
  if (flowRangeEl)
    flowRangeEl.textContent = `${ranges.flow.min}-${ranges.flow.max}`;
}

// Get current ranges
function getCurrentRanges() {
  return SpeciesRanges[currentSpecies];
}

// Check if a value is within optimal range
function isInRange(value, range) {
  return value >= range.min && value <= range.max;
}

// Check all thresholds and manage recovery timers
function checkThresholds(sensors) {
  const ranges = getCurrentRanges();

  checkParameter("temperature", sensors.temperature, ranges.temperature);
  checkParameter("light", sensors.light, ranges.light);
  checkParameter("flow", sensors.flow, ranges.flow);

  updateRecoveryDisplay();
  updateAlertStatus();
}

// Check individual parameter
function checkParameter(paramName, value, range) {
  const timer = RecoveryState.timers[paramName];
  const inRange = isInRange(value, range);

  if (!inRange && !timer.isRunning) {
    // Parameter just went OUT of range - START timer
    startRecoveryTimer(paramName, value, range);
  } else if (inRange && timer.isRunning) {
    // Parameter just returned IN range - STOP timer
    stopRecoveryTimer(paramName, value);
  } else if (!inRange && timer.isRunning) {
    // Still out of range - update current duration
    timer.currentDuration = Date.now() - timer.startTime;
  }
}

// Start recovery timer for a parameter
function startRecoveryTimer(paramName, value, range) {
  const timer = RecoveryState.timers[paramName];
  timer.startTime = Date.now();
  timer.isRunning = true;
  timer.currentDuration = 0;

  RecoveryState.activeAlerts.add(paramName);
  RecoveryState.stats.totalAlerts++;

  // Create log entry
  const logEntry = {
    id: RecoveryState.log.length + 1,
    parameter: paramName,
    value: parseFloat(value).toFixed(1),
    optimalRange: `${range.min}-${range.max}`,
    startTime: new Date().toLocaleTimeString(),
    startTimestamp: Date.now(),
    endTime: null,
    endTimestamp: null,
    duration: null,
    status: "ACTIVE",
  };

  RecoveryState.log.unshift(logEntry); // Add to beginning

  // Trigger visual alert
  showParameterAlert(paramName, value, range);

  // Update sensor card styling
  const card = document.getElementById(`${paramName}-card`);
  if (card) card.classList.add("alert");

  const statusEl = document.getElementById(`${paramName}-status`);
  if (statusEl) {
    statusEl.textContent = "● ALERT!";
    statusEl.className = "sensor-status red";
  }

  console.log(
    `⚠️ ALERT: ${paramName} = ${value} (optimal: ${range.min}-${range.max})`,
  );

  saveRecoveryData();
}

// Stop recovery timer for a parameter
function stopRecoveryTimer(paramName, value) {
  const timer = RecoveryState.timers[paramName];
  const endTime = Date.now();
  const duration = endTime - timer.startTime;

  timer.isRunning = false;
  timer.currentDuration = 0;
  timer.startTime = null;

  RecoveryState.activeAlerts.delete(paramName);

  // Update log entry
  const activeEntry = RecoveryState.log.find(
    (entry) => entry.parameter === paramName && entry.status === "ACTIVE",
  );

  if (activeEntry) {
    activeEntry.endTime = new Date().toLocaleTimeString();
    activeEntry.endTimestamp = endTime;
    activeEntry.duration = duration;
    activeEntry.status = "RESOLVED";
    activeEntry.resolvedValue = parseFloat(value).toFixed(1);
  }

  // Update statistics
  RecoveryState.stats.totalRecoveryTime += duration;
  if (duration > RecoveryState.stats.longestOutage) {
    RecoveryState.stats.longestOutage = duration;
  }

  // Remove alert styling
  const card = document.getElementById(`${paramName}-card`);
  if (card) card.classList.remove("alert");

  const statusEl = document.getElementById(`${paramName}-status`);
  if (statusEl) {
    statusEl.textContent = "● OPTIMAL";
    statusEl.className = "sensor-status green";
  }

  console.log(
    `✅ RESOLVED: ${paramName} recovered in ${formatDuration(duration)}`,
  );

  saveRecoveryData();
  updateLogTable();
}

// Update recovery timer display
function updateRecoveryDisplay() {
  const ranges = getCurrentRanges();

  // Update individual timers
  ["temperature", "light", "flow"].forEach((param) => {
    const timer = RecoveryState.timers[param];
    const displayEl = document.getElementById(`${param}-recovery`);

    if (displayEl) {
      if (timer.isRunning) {
        const currentDuration = Date.now() - timer.startTime;
        displayEl.textContent = formatDuration(currentDuration);
        displayEl.style.color = "#f44336";
      } else {
        // Show last recovery time or 00:00:00
        const lastEntry = RecoveryState.log.find(
          (e) => e.parameter === param && e.status === "RESOLVED",
        );
        displayEl.textContent = lastEntry
          ? formatDuration(lastEntry.duration)
          : "00:00:00";
        displayEl.style.color = "#2e7d32";
      }
    }
  });

  // Calculate total system recovery time
  let totalActiveTime = 0;
  ["temperature", "light", "flow"].forEach((param) => {
    const timer = RecoveryState.timers[param];
    if (timer.isRunning) {
      totalActiveTime += Date.now() - timer.startTime;
    }
  });

  const totalRecovery = RecoveryState.stats.totalRecoveryTime + totalActiveTime;
  const totalEl = document.getElementById("total-recovery");
  if (totalEl) {
    totalEl.textContent = formatDuration(totalRecovery);
  }

  // Update recovery status indicator
  const statusEl = document.getElementById("recovery-status");
  if (statusEl) {
    const hasActiveAlerts = RecoveryState.activeAlerts.size > 0;
    if (hasActiveAlerts) {
      statusEl.innerHTML =
        '<span class="status-indicator red">●</span> RECOVERY IN PROGRESS!';
      statusEl.style.background = "#ffebee";
      statusEl.style.color = "#c62828";
    } else {
      statusEl.innerHTML =
        '<span class="status-indicator green">●</span> ALL SYSTEMS NOMINAL';
      statusEl.style.background = "#c8e6c9";
      statusEl.style.color = "#2e7d32";
    }
  }
}

// Update alert status display
function updateAlertStatus() {
  const hasAlerts = RecoveryState.activeAlerts.size > 0;

  if (hasAlerts) {
    // Trigger screen shake
    const shakeContainer = document.getElementById("shake-container");
    if (shakeContainer && !shakeContainer.classList.contains("shake-active")) {
      shakeContainer.classList.add("shake-active");
      setTimeout(() => {
        shakeContainer.classList.remove("shake-active");
      }, 500);
    }
  }
}

// Show parameter-specific alert modal
function showParameterAlert(paramName, value, range) {
  const modal = document.getElementById("alert-modal");
  const textEl = document.getElementById("alert-text");
  const subtextEl = document.getElementById("alert-subtext");
  const valueEl = document.getElementById("alert-value");

  const paramLabels = {
    temperature: "🌡️ TEMPERATURE",
    light: "💡 LIGHT",
    flow: "💧 WATER FLOW",
  };

  if (modal && textEl && subtextEl && valueEl) {
    textEl.textContent = "WARNING!";
    subtextEl.textContent = `${paramLabels[paramName]} OUT OF RANGE!`;
    valueEl.textContent = `Current: ${parseFloat(value).toFixed(1)} | Optimal: ${range.min}-${range.max}`;

    modal.classList.remove("hidden");
  }
}

// Dismiss alert modal
function dismissAlert() {
  const modal = document.getElementById("alert-modal");
  if (modal) {
    modal.classList.add("hidden");
  }
}

// Format duration in HH:MM:SS
function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// Update the recovery log table
function updateLogTable() {
  const tbody = document.getElementById("recovery-log-body");
  if (!tbody) return;

  if (RecoveryState.log.length === 0) {
    tbody.innerHTML = `
            <tr class="empty-row">
                <td colspan="8">No recovery events recorded yet. System is running optimally!</td>
            </tr>
        `;
    return;
  }

  tbody.innerHTML = RecoveryState.log
    .map(
      (entry) => `
        <tr>
            <td><strong>#${entry.id}</strong></td>
            <td>${getParameterEmoji(entry.parameter)} ${entry.parameter.toUpperCase()}</td>
            <td>${entry.value}</td>
            <td>${entry.optimalRange}</td>
            <td>${entry.startTime}</td>
            <td>${entry.endTime || "--:--:--"}</td>
            <td>${entry.duration ? formatDuration(entry.duration) : formatDuration(Date.now() - entry.startTimestamp)}</td>
            <td>
                <span class="status-${entry.status.toLowerCase()}">
                    ${entry.status === "ACTIVE" ? "⚠️ ACTIVE" : "✅ RESOLVED"}
                </span>
            </td>
        </tr>
    `,
    )
    .join("");

  // Update summary stats
  updateSummaryStats();
}

function getParameterEmoji(param) {
  const emojis = { temperature: "🌡️", light: "💡", flow: "💧" };
  return emojis[param] || "📡";
}

function updateSummaryStats() {
  const totalAlertsEl = document.getElementById("total-alerts");
  const avgRecoveryEl = document.getElementById("avg-recovery");
  const longestOutageEl = document.getElementById("longest-outage");
  const systemUptimeEl = document.getElementById("system-uptime");

  if (totalAlertsEl)
    totalAlertsEl.textContent = RecoveryState.stats.totalAlerts;

  const resolvedEntries = RecoveryState.log.filter(
    (e) => e.status === "RESOLVED",
  );
  if (resolvedEntries.length > 0 && avgRecoveryEl) {
    const avgDuration =
      resolvedEntries.reduce((sum, e) => sum + e.duration, 0) /
      resolvedEntries.length;
    avgRecoveryEl.textContent = formatDuration(avgDuration);
  }

  if (longestOutageEl)
    longestOutageEl.textContent = formatDuration(
      RecoveryState.stats.longestOutage,
    );
  if (systemUptimeEl)
    systemUptimeEl.textContent = formatDuration(
      Date.now() - RecoveryState.stats.systemStartTime,
    );
}

// Export recovery log as CSV
function exportRecoveryLog() {
  if (RecoveryState.log.length === 0) {
    alert("No recovery events to export!");
    return;
  }

  const headers = [
    "Event #",
    "Parameter",
    "Value",
    "Optimal Range",
    "Start Time",
    "End Time",
    "Duration (ms)",
    "Status",
  ];
  const rows = RecoveryState.log.map((entry) => [
    entry.id,
    entry.parameter,
    entry.value,
    entry.optimalRange,
    entry.startTime,
    entry.endTime || "",
    entry.duration || Date.now() - entry.startTimestamp,
    entry.status,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `aquacore-recovery-log-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  console.log("📥 Recovery log exported");
}

// Clear recovery log
function clearRecoveryLog() {
  if (
    !confirm(
      "Are you sure you want to clear all recovery data? This cannot be undone!",
    )
  ) {
    return;
  }

  RecoveryState.log = [];
  RecoveryState.stats.totalAlerts = 0;
  RecoveryState.stats.totalRecoveryTime = 0;
  RecoveryState.stats.longestOutage = 0;
  RecoveryState.stats.systemStartTime = Date.now();

  // Reset all timers
  ["temperature", "light", "flow"].forEach((param) => {
    RecoveryState.timers[param] = {
      startTime: null,
      isRunning: false,
      currentDuration: 0,
    };
  });
  RecoveryState.activeAlerts.clear();

  // Reset displays
  ["temp", "light", "flow"].forEach((param) => {
    const displayEl = document.getElementById(`${param}-recovery`);
    if (displayEl) {
      displayEl.textContent = "00:00:00";
      displayEl.style.color = "#2e7d32";
    }

    const card = document.getElementById(`${param}-card`);
    if (card) card.classList.remove("alert");

    const statusEl = document.getElementById(`${param}-status`);
    if (statusEl) {
      statusEl.textContent = "● OPTIMAL";
      statusEl.className = "sensor-status green";
    }
  });

  updateLogTable();
  updateRecoveryDisplay();
  saveRecoveryData();

  console.log("🗑️ Recovery log cleared");
}

// Save recovery data to localStorage
function saveRecoveryData() {
  try {
    const data = {
      log: RecoveryState.log,
      stats: RecoveryState.stats,
      timers: RecoveryState.timers,
    };
    localStorage.setItem("aquacore-recovery-data", JSON.stringify(data));
  } catch (e) {
    console.warn("Could not save recovery data:", e);
  }
}

// Load recovery data from localStorage
function loadRecoveryData() {
  try {
    const saved = localStorage.getItem("aquacore-recovery-data");
    if (saved) {
      const data = JSON.parse(saved);
      RecoveryState.log = data.log || [];
      RecoveryState.stats = data.stats || RecoveryState.stats;
      RecoveryState.timers = data.timers || RecoveryState.timers;

      // Restore active alerts set
      RecoveryState.activeAlerts.clear();
      ["temperature", "light", "flow"].forEach((param) => {
        if (RecoveryState.timers[param].isRunning) {
          RecoveryState.activeAlerts.add(param);
        }
      });

      updateLogTable();
      updateRecoveryDisplay();
    }
  } catch (e) {
    console.warn("Could not load recovery data:", e);
  }
}

// Re-check all thresholds (called when species changes)
function checkAllThresholds() {
  // Get current sensor values from display
  const temp =
    parseFloat(document.getElementById("temp-value")?.textContent) || 0;
  const light =
    parseFloat(document.getElementById("light-value")?.textContent) || 0;
  const flow =
    parseFloat(document.getElementById("flow-value")?.textContent) || 0;

  checkThresholds({ temperature: temp, light: light, flow: flow });
}

// Export functions for use in other modules
window.RecoveryState = RecoveryState;
window.checkThresholds = checkThresholds;
window.dismissAlert = dismissAlert;
window.exportRecoveryLog = exportRecoveryLog;
window.clearRecoveryLog = clearRecoveryLog;
window.formatDuration = formatDuration;
window.updateLogTable = updateLogTable;
