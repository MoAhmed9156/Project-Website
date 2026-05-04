/* ============================================
   CHARTS MODULE - AquaCore Dashboard
   Red Sea STEM School - Grade 11 - 2025/2026
   Uses Chart.js with error bar visualization
   ============================================ */

// Chart instances
let tempChart, lightChart, flowChart;

// Chart configuration
const chartConfig = {
  type: "line",
  options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 500,
      easing: "easeInOutQuart",
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          font: { family: "'Comic Neue', cursive", size: 12, weight: "bold" },
          color: "#000",
        },
      },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#000",
        bodyColor: "#000",
        borderColor: "#000",
        borderWidth: 3,
        titleFont: { family: "'Bangers', cursive", size: 14 },
        bodyFont: { family: "'Comic Neue', cursive", size: 12, weight: "bold" },
        displayColors: false,
        callbacks: {
          title: (items) => `⏱️ T+${items[0].label}s`,
          label: (item) => `${item.dataset.label}: ${item.parsed.y.toFixed(1)}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "⏱️ TIME SINCE LAUNCH (seconds)",
          font: { family: "'Bangers', cursive", size: 12 },
          color: "#000",
        },
        grid: {
          color: "rgba(0,0,0,0.1)",
          borderColor: "#000",
          borderWidth: 2,
        },
        ticks: {
          font: { family: "'Roboto Mono', monospace", size: 10 },
          color: "#000",
        },
      },
      y: {
        title: {
          display: true,
          font: { family: "'Bangers', cursive", size: 12 },
          color: "#000",
        },
        grid: {
          color: "rgba(0,0,0,0.1)",
          borderColor: "#000",
          borderWidth: 2,
        },
        ticks: {
          font: { family: "'Roboto Mono', monospace", size: 10 },
          color: "#000",
        },
      },
    },
    elements: {
      line: { borderWidth: 3, tension: 0.3 },
      point: { radius: 4, borderWidth: 2, hoverRadius: 7 },
    },
  },
};

// Data storage for charts
const chartData = {
  temp: { labels: [], values: [], errors: [] },
  light: { labels: [], values: [], errors: [] },
  flow: { labels: [], values: [], errors: [] },
};

let launchTime = Date.now();
let dataPointCount = 0;

// Initialize charts
document.addEventListener("DOMContentLoaded", () => {
  initCharts();
  startLaunchTimer();
});

function initCharts() {
  // Temperature Chart
  const tempCtx = document.getElementById("tempChart");
  if (tempCtx) {
    tempChart = new Chart(tempCtx, {
      ...chartConfig,
      data: {
        labels: [],
        datasets: [
          {
            label: "🌡️ TEMPERATURE (°C)",
            data: [],
            borderColor: "#E91E8C",
            backgroundColor: "rgba(233, 30, 140, 0.15)",
            fill: true,
            pointBackgroundColor: "#E91E8C",
            pointBorderColor: "#000",
            pointBorderWidth: 2,
          },
          {
            label: "📊 ERROR BARS (±0.5°C)",
            data: [],
            borderColor: "rgba(0, 0, 0, 0.3)",
            backgroundColor: "rgba(0, 0, 0, 0.05)",
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0,
            tension: 0,
          },
        ],
      },
      options: {
        ...chartConfig.options,
        scales: {
          ...chartConfig.options.scales,
          y: {
            ...chartConfig.options.scales.y,
            title: {
              display: true,
              text: "🌡️ TEMPERATURE (°C)",
              font: { family: "'Bangers', cursive", size: 12 },
              color: "#000",
            },
            suggestedMin: 20,
            suggestedMax: 32,
          },
        },
      },
    });
  }

  // Light Chart
  const lightCtx = document.getElementById("lightChart");
  if (lightCtx) {
    lightChart = new Chart(lightCtx, {
      ...chartConfig,
      data: {
        labels: [],
        datasets: [
          {
            label: "💡 LIGHT INTENSITY (Lux)",
            data: [],
            borderColor: "#FFEB3B",
            backgroundColor: "rgba(255, 235, 59, 0.15)",
            fill: true,
            pointBackgroundColor: "#FFEB3B",
            pointBorderColor: "#000",
            pointBorderWidth: 2,
          },
          {
            label: "📊 ERROR BARS (±50 Lux)",
            data: [],
            borderColor: "rgba(0, 0, 0, 0.3)",
            backgroundColor: "rgba(0, 0, 0, 0.05)",
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0,
            tension: 0,
          },
        ],
      },
      options: {
        ...chartConfig.options,
        scales: {
          ...chartConfig.options.scales,
          y: {
            ...chartConfig.options.scales.y,
            title: {
              display: true,
              text: "💡 LIGHT (Lux)",
              font: { family: "'Bangers', cursive", size: 12 },
              color: "#000",
            },
            suggestedMin: 0,
            suggestedMax: 2500,
          },
        },
      },
    });
  }

  // Flow Chart
  const flowCtx = document.getElementById("flowChart");
  if (flowCtx) {
    flowChart = new Chart(flowCtx, {
      ...chartConfig,
      data: {
        labels: [],
        datasets: [
          {
            label: "💧 WATER FLOW (L/min)",
            data: [],
            borderColor: "#00F0FF",
            backgroundColor: "rgba(0, 240, 255, 0.15)",
            fill: true,
            pointBackgroundColor: "#00F0FF",
            pointBorderColor: "#000",
            pointBorderWidth: 2,
          },
          {
            label: "📊 ERROR BARS (±0.2 L/min)",
            data: [],
            borderColor: "rgba(0, 0, 0, 0.3)",
            backgroundColor: "rgba(0, 0, 0, 0.05)",
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0,
            tension: 0,
          },
        ],
      },
      options: {
        ...chartConfig.options,
        scales: {
          ...chartConfig.options.scales,
          y: {
            ...chartConfig.options.scales.y,
            title: {
              display: true,
              text: "💧 FLOW (L/min)",
              font: { family: "'Bangers', cursive", size: 12 },
              color: "#000",
            },
            suggestedMin: 0,
            suggestedMax: 12,
          },
        },
      },
    });
  }

  console.log("📈 Charts initialized");
}

// Add new data point to charts
function addChartData(sensors) {
  const elapsed = Math.floor((Date.now() - launchTime) / 1000);
  dataPointCount++;

  // Keep only last 30 data points for readability
  const maxPoints = 30;

  // Temperature
  if (tempChart && sensors.temperature !== undefined) {
    const tempVal = parseFloat(sensors.temperature);
    const tempError = 0.5; // Standard error for temperature sensor

    chartData.temp.labels.push(elapsed);
    chartData.temp.values.push(tempVal);
    chartData.temp.errors.push(tempError);

    if (chartData.temp.labels.length > maxPoints) {
      chartData.temp.labels.shift();
      chartData.temp.values.shift();
      chartData.temp.errors.shift();
    }

    tempChart.data.labels = chartData.temp.labels;
    tempChart.data.datasets[0].data = chartData.temp.values;
    // Error bar visualization (upper bound)
    tempChart.data.datasets[1].data = chartData.temp.values.map(
      (v, i) => v + chartData.temp.errors[i],
    );
    tempChart.update("none"); // Update without full animation
  }

  // Light
  if (lightChart && sensors.light !== undefined) {
    const lightVal = parseFloat(sensors.light);
    const lightError = 50; // Standard error for light sensor

    chartData.light.labels.push(elapsed);
    chartData.light.values.push(lightVal);
    chartData.light.errors.push(lightError);

    if (chartData.light.labels.length > maxPoints) {
      chartData.light.labels.shift();
      chartData.light.values.shift();
      chartData.light.errors.shift();
    }

    lightChart.data.labels = chartData.light.labels;
    lightChart.data.datasets[0].data = chartData.light.values;
    lightChart.data.datasets[1].data = chartData.light.values.map(
      (v, i) => v + chartData.light.errors[i],
    );
    lightChart.update("none");
  }

  // Flow
  if (flowChart && sensors.flow !== undefined) {
    const flowVal = parseFloat(sensors.flow);
    const flowError = 0.2; // Standard error for flow sensor

    chartData.flow.labels.push(elapsed);
    chartData.flow.values.push(flowVal);
    chartData.flow.errors.push(flowError);

    if (chartData.flow.labels.length > maxPoints) {
      chartData.flow.labels.shift();
      chartData.flow.values.shift();
      chartData.flow.errors.shift();
    }

    flowChart.data.labels = chartData.flow.labels;
    flowChart.data.datasets[0].data = chartData.flow.values;
    flowChart.data.datasets[1].data = chartData.flow.values.map(
      (v, i) => v + chartData.flow.errors[i],
    );
    flowChart.update("none");
  }
}

// Launch timer display
function startLaunchTimer() {
  const timerEl = document.getElementById("launch-timer");
  if (!timerEl) return;

  setInterval(() => {
    const elapsed = Date.now() - launchTime;
    const hours = Math.floor(elapsed / 3600000);
    const minutes = Math.floor((elapsed % 3600000) / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);

    timerEl.textContent = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, 1000);
}

// Reset launch timer (e.g., when prototype is restarted)
function resetLaunchTimer() {
  launchTime = Date.now();
  dataPointCount = 0;

  // Clear chart data
  chartData.temp = { labels: [], values: [], errors: [] };
  chartData.light = { labels: [], values: [], errors: [] };
  chartData.flow = { labels: [], values: [], errors: [] };

  if (tempChart) {
    tempChart.data.labels = [];
    tempChart.data.datasets[0].data = [];
    tempChart.data.datasets[1].data = [];
    tempChart.update();
  }
  if (lightChart) {
    lightChart.data.labels = [];
    lightChart.data.datasets[0].data = [];
    lightChart.data.datasets[1].data = [];
    lightChart.update();
  }
  if (flowChart) {
    flowChart.data.labels = [];
    flowChart.data.datasets[0].data = [];
    flowChart.data.datasets[1].data = [];
    flowChart.update();
  }

  console.log("🚀 Launch timer reset");
}

// Export functions
window.addChartData = addChartData;
window.resetLaunchTimer = resetLaunchTimer;
