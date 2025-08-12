
# ⚡️ Real-Time Integration: Flask Backend → React Dashboard

## 🎯 Objective

Enhance the existing **IntegriSense Dashboard** to support **real-time sensor data visualization** from the Flask backend without altering the current styling or layout.

---

## 🛠️ Goals

- Replace mock data in the **Real-Time** tab with **live sensor data** from Flask WebSocket (`socket.io`).
- Predict stress level using the ML model output from Flask backend.
- Update the **Analytics** tab based on real-time predictions.
- **Do not modify existing tabs**: `Dashboard`, `Sessions`, `Previous Tests`.
- Only show real-time visualizations **when streaming data is active**.

---

## 📡 WebSocket Stream from Flask

### 🔌 Backend WebSocket Info

- URL: `http://localhost:5000`
- WebSocket Protocol: `Socket.IO`
- Event: `stream`
- Payload Format:

```json
{
  "bvp": 0.85,
  "hrv": 45.2,
  "temperature": 36.5,
  "eda": 0.012,
  "acceleration_magnitude": 0.9803,
  "prediction": "Calm",
  "timestamp": "2025-08-05T17:00:00"
}
```

---

## ⚛️ React Dashboard: Integration Steps

### ✅ 1. Replace Mock Data in Real-Time Tab

- File: `RealTimeTab.tsx`
- Install WebSocket client:
  ```bash
  npm install socket.io-client
  ```

- Setup WebSocket in a `useEffect`:

```tsx
import { io } from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io("http://localhost:8080");

useEffect(() => {
  socket.on("stream", (data) => {
    setSensorData((prev) => [...prev.slice(-49), data]);
    setPrediction(data.prediction);
  });
  return () => socket.disconnect();
}, []);
```

---

### ✅ 2. Display Sensor Data Live

- Use **existing styled components** from the previous mockup.
- Add live charts (Recharts/Chart.js) for:
  - BVP
  - HRV
  - Temperature
  - EDA
  - Acceleration Magnitude
- Display current **ML prediction** (`Calm` / `Stressed`).
- **Only render charts** when `sensorData.length > 0`.

---

### ✅ 3. Sync with Analytics Tab

- Use shared global state (e.g., React Context or Zustand).
- Store predictions with timestamps.
- In `AnalyticsTab.tsx`:
  - Show prediction counts (`Calm` vs `Stressed`)
  - Display trends using line or bar charts.

---

## 🎨 UX Expectations

- Keep original UI, layout, and styling.
- Tabs `Dashboard`, `Sessions`, `Previous Tests` remain unchanged.
- Real-Time charts **appear only when stream is active**.
- Add "Stream Active" green dot and "Last Updated" timestamp.
- Optionally, add pause/resume buttons (visual toggle only).

---

## 🔄 Summary Flow

```
ESP32 → Flask (WebSocket Emit) → React (Real-Time Tab)
        ├── Calculates acceleration magnitude
        ├── Predicts stress status
        └── Emits live payload
```

---

## ✅ Ready to Start?

Hook up your existing Real-Time tab with the above WebSocket stream and remove all mock data logic! You already have the components — now plug in live values.


