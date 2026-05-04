/* ============================================
   SENSORS MODULE - AquaCore Dashboard
   Red Sea STEM School - Grade 11 - 2025/2026
   ============================================ */

// Sensor display management
const SensorsModule = {
  currentValues: {
    temperature: 0,
    light: 0,
    flow: 0,
  },

  history: {
    temperature: [],
    light: [],
    flow: [],
  },

  maxHistoryLength: 100,

  init() {
    console.log("🌡️ Sensors module initialized");
  },

  // Update sensor display with new values
  update(type, value, unit) {
    this.currentValues[type] = parseFloat(value);

    // Update the display element
    const valueEl = document.getElementById(`${type}-value`);
    if (valueEl) {
      // Animate the number change
      this.animateValue(
        valueEl,
        parseFloat(valueEl.textContent) || 0,
        parseFloat(value),
        500,
      );
    }

    // Add to history for charts
    this.addToHistory(type, parseFloat(value));
  },

  // Animate number transition
  animateValue(element, start, end, duration) {
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * easeOut;

      element.textContent = current.toFixed(1);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  },

  // Add value to history array
  addToHistory(type, value) {
    this.history[type].push({
      value: value,
      timestamp: Date.now(),
    });

    // Keep only last N entries
    if (this.history[type].length > this.maxHistoryLength) {
      this.history[type].shift();
    }
  },

  // Get history data for charts
  getHistory(type, count = 20) {
    return this.history[type].slice(-count);
  },

  // Get all current values
  getCurrentValues() {
    return { ...this.currentValues };
  },
};

// Initialize sensors module
document.addEventListener("DOMContentLoaded", () => {
  SensorsModule.init();
});

// Export for other modules
window.SensorsModule = SensorsModule;
window.updateSensorDisplay = (type, value, unit) => {
  SensorsModule.update(type, value, unit);
};
