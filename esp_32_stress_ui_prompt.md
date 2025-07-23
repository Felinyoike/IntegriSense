# 📡 Real-Time Flask Backend + React Dashboard for Biometric Stress Detection

## 🌟 Objective

Build a **Flask backend** that:

- Receives real-time **biometric sensor data** from an ESP32 device.
- Calculates the **acceleration magnitude** from 3D acceleration input.
- Broadcasts sensor values and prediction results to a **React + TypeScript dashboard** in real time using **WebSockets**.

> **Note:** The model is being developed by the Machine Learning team. Backend developers will be responsible for integrating the final model.

---

## 📱 Input Features from ESP32

```json
{
  "bvp": 0.85,
  "hrv": 45.2,
  "temperature": 36.5,
  "eda": 0.012,
  "acceleration": {
    "x": 0.02,
    "y": -0.01,
    "z": 0.98
  }
}
```

---

## 🧠 Acceleration Magnitude Calculation

Compute acceleration magnitude as:

```
acceleration_magnitude = sqrt(x^2 + y^2 + z^2)
```

Only this value is used in the dashboard display and for ML prediction.

---

## 🛡️ Flask Backend Specification

### ✅ Responsibilities

1. **Receive Data** via:

   - `POST /api/sensor-data`

2. **Process Data**:

   - Calculate `acceleration_magnitude`
   - Format data for model input as:
     ```python
     [bvp, hrv, temperature, eda, acceleration_magnitude]
     ```

3. **Run Prediction Using ML Model** (once provided):

   - Load model on Flask startup using `joblib`, `pickle`, or `tensorflow` depending on format
   - Add prediction result to WebSocket payload

4. **Emit via WebSocket**:

   - Event: `stream`
   - Payload example:
     ```json
     {
       "bvp": 0.85,
       "hrv": 45.2,
       "temperature": 36.5,
       "eda": 0.012,
       "acceleration_magnitude": 0.9803,
       "prediction": "Calm"
     }
     ```

---

## ⚛️ React + TypeScript Dashboard

### ✅ Responsibilities

1. **Connect to WebSocket**
2. **Listen for **``** Event**
3. **Display Data in UI**

---

## 🔀 Data Flow Summary

```
ESP32 ──POST──▶ Flask
                ├─▶ Calculate Acceleration Magnitude
                ├─▶ Predict Emotional State
                └─▶ Emit via WebSocket ──▶ React Dashboard
```

---

## 📆 ML Model Integration Steps

1. Machine Learning team provides a `.pkl`, `.joblib`, or `.tflite` model file.
2. Place model file in Flask backend (e.g., `models/model.pkl`).
3. Load the model at startup using the appropriate library.
4. During each POST request, pass the feature array to the model to generate a prediction.
5. Return prediction in WebSocket broadcast.

---

## 📦 Technologies to Use

| Flask Backend          | React Frontend         |
| ---------------------- | ---------------------- |
| Flask                  | React + TypeScript     |
| Flask-SocketIO         | socket.io-client       |
| math (Python stdlib)   | Recharts / Chart.js    |
| joblib / pickle (ML)   | WebSocket state hooks  |
| supabase-py (optional) | supabase-js (optional) |

