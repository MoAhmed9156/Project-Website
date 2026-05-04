# 🌊 AquaCore - IoT Aquaculture Command Center

**Red Sea STEM School | Grade 11 | Semester 2025/2026**

**Group No. 16211**

---

## 👥 Team Members

| Name                 | Role               | Responsibilities                           |
| -------------------- | ------------------ | ------------------------------------------ |
| **Mohamed Ahmed**    | Team Leader        | Coder, Prototype Worker, 3D Models Creator |
| **Moamen Mohamed**   | Designer           | Designer, Developer                        |
| **Yassin Ramadan**   | Materials Gatherer | Procurement, Research                      |
| **Omar Abdelrahman** | Writer             | Documentation, Technical Writing           |

---

## 📋 Project Overview

AquaCore is an interactive web dashboard for monitoring an IoT-based aquaculture system. Built with a vibrant **Retro Comic Book** aesthetic, it provides real-time sensor monitoring, recovery time tracking, data visualization, and team information.

### Key Features

- 🌡️ **Live Sensor Monitoring** - Temperature, Light Intensity, Water Flow Rate
- ⏱️ **Recovery Timer System** - Tracks parameter deviation and recovery times
- 📈 **Scientific Charts** - Real-time line graphs with error bars
- 🚨 **Alert System** - Comic-style modal alerts with screen shake
- 🔬 **Prototype Information** - System specifications and Egypt's Grand Challenges
- 👥 **Super-Team Profiles** - Stylized hero cards for each team member

---

## 🎨 Visual Design

### Comic Book Aesthetic

- Heavy bold black borders (3-4px) on all containers
- Halftone dot patterns in card backgrounds
- Vibrant color palette: Magenta, Neon Green, Cyan, Bright Yellow, White
- Comic fonts: Bangers (headers), Comic Neue (body), Roboto Mono (data)
- CSS Grid layout resembling a graphic novel page

### Color Palette

| Color         | Hex       | Usage                        |
| ------------- | --------- | ---------------------------- |
| Magenta       | `#E91E8C` | Headers, accents             |
| Neon Green    | `#39FF14` | Success states, highlights   |
| Cyan          | `#00F0FF` | Info, charts, borders        |
| Bright Yellow | `#FFEB3B` | Warnings, badges, highlights |
| Crisp White   | `#FFFFFF` | Card backgrounds             |
| Dark BG       | `#1a1a2e` | Page background              |

---

## 🗂️ Project Structure

```
aquacore-dashboard/
├── index.html              # Main HTML file
├── css/
│   └── style.css           # Comic book styles & responsive design
├── js/
│   ├── firebase-config.js  # Firebase Realtime DB integration
│   ├── recovery-timer.js   # Core recovery timer logic
│   ├── sensors.js          # Sensor display management
│   ├── charts.js           # Chart.js visualization
│   └── app.js              # Main app controller & navigation
├── assets/
│   └── images/             # Project images & assets
└── README.md               # This file
```

---

## 🚀 Getting Started

### 1. Setup Firebase

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Realtime Database
3. Set up database rules:

```json
{
  "rules": {
    "aquacore": {
      "sensors": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

4. Update `js/firebase-config.js` with your project credentials:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
};
```

### 2. ESP32 Data Format

Your ESP32 should send data to Firebase in this format:

```json
{
  "aquacore": {
    "sensors": {
      "temperature": 26.5,
      "light": 1200,
      "flow": 4.2,
      "pumpStatus": true,
      "filterStatus": true,
      "timestamp": 1234567890
    }
  }
}
```

### 3. Run the Dashboard

Simply open `index.html` in a modern web browser. The dashboard works in:

- Chrome/Edge (recommended)
- Firefox
- Safari

**Demo Mode**: If Firebase is not configured, the dashboard automatically switches to demo mode with simulated sensor data.

---

## 📊 Dashboard Pages

### 1. Dashboard (Ctrl+1)

- Live sensor gauges with color-coded status
- Recovery timer panel with real-time tracking
- Scientific charts with error bars
- System status indicators

### 2. Prototype (Ctrl+2)

- Recycle & Feedback Loop explanation
- Egypt's Grand Challenges (Agriculture & Pollution)
- Technical specifications table

### 3. Super-Team (Ctrl+3)

- Hero cards for each team member
- Role badges and skill stats
- Animated stat bars

### 4. Recovery Log (Ctrl+4)

- Complete event history table
- Summary statistics
- CSV export functionality
- Clear log option

---

## ⏱️ Recovery Timer Logic

The core capstone feature tracks parameter deviations:

1. **Detection**: When a sensor reading leaves the selected species' optimal range
2. **Timer Start**: Begins counting the deviation duration
3. **Timer Stop**: Stops when the parameter returns to optimal range
4. **Logging**: Records the event with start time, end time, and duration
5. **Statistics**: Calculates total alerts, average recovery time, longest outage

### Species Ranges

| Species         | Temperature | Light         | Flow       |
| --------------- | ----------- | ------------- | ---------- |
| Nile Tilapia    | 25-28°C     | 800-1500 Lux  | 4-6 L/min  |
| African Catfish | 26-30°C     | 500-1000 Lux  | 3-5 L/min  |
| Grey Mullet     | 20-25°C     | 1000-2000 Lux | 5-8 L/min  |
| Barramundi      | 27-30°C     | 1500-2500 Lux | 6-10 L/min |

---

## 🎮 Keyboard Shortcuts

| Shortcut   | Action              |
| ---------- | ------------------- |
| `Ctrl + 1` | Go to Dashboard     |
| `Ctrl + 2` | Go to Prototype     |
| `Ctrl + 3` | Go to Super-Team    |
| `Ctrl + 4` | Go to Recovery Log  |
| `Ctrl + R` | Reset launch timer  |
| `Esc`      | Dismiss alert modal |

---

## 🛠️ Tech Stack

- **HTML5** - Semantic structure
- **CSS3** - Grid, Flexbox, Custom Properties, Animations
- **Vanilla JavaScript** - No frameworks, pure JS
- **Chart.js** - Data visualization with error bars
- **Firebase Realtime Database** - Live sensor data streaming
- **Google Fonts** - Bangers, Comic Neue, Roboto Mono

---

## 📱 Responsive Design

The dashboard is fully responsive:

- **Desktop**: Full 2-column grid layout
- **Tablet**: Adjusted grid with stacked charts
- **Mobile**: Single column, optimized touch targets

---

## 🔧 Customization

### Adding New Species

Edit the `SpeciesRanges` object in `js/recovery-timer.js`:

```javascript
const SpeciesRanges = {
  yourSpecies: {
    temperature: { min: XX, max: XX },
    light: { min: XX, max: XX },
    flow: { min: XX, max: XX },
  },
};
```

### Changing Alert Thresholds

Modify the error values in `js/charts.js`:

```javascript
const tempError = 0.5; // Temperature sensor error margin
const lightError = 50; // Light sensor error margin
const flowError = 0.2; // Flow sensor error margin
```

---

## 📄 License

This project is created for educational purposes as part of the Red Sea STEM School Grade 11 Engineering Capstone.

---

## 🙏 Acknowledgments

- **Red Sea STEM School** for providing the platform
- **Ministry of Education and Technical Education** for STEM program support
- **USAID** for founding the STEM schools initiative in Egypt
- **Team 16211** for their dedication and hard work

---

**AquaCore** - _Making aquaculture smarter, one sensor at a time._ 🐟💧
