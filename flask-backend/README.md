# Flask Backend for ESP32 Biometric Data Ingestion

This Flask backend receives real-time biometric sensor data from ESP32 devices, processes it, predicts stress level using a TensorFlow `.h5` model, and broadcasts the results to connected React dashboards via WebSockets.

## Features

- **Real-time data ingestion** from ESP32 via POST API
- **Acceleration magnitude calculation** from 3D acceleration components
- **TensorFlow model integration** for stress level prediction
- **WebSocket broadcasting** to React dashboard
- **Optional USB serial listener** for direct ESP32 connection
- **Health check endpoint** for monitoring

## Project Structure

```
flask-backend/
├── app.py              # Main Flask application
├── socketio_server.py  # WebSocket logic (modular)
├── serial_listener.py  # Optional USB data ingestion
├── requirements.txt    # Python dependencies
└── README.md          # This file
```

## Installation

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Ensure the ML model is available:
   - Place `stress_model.h5` inside the `flask-backend` directory
   - The backend will automatically load it on startup

## Usage

### Start the Flask Backend

```bash
python app.py
```

The server will start on `http://localhost:5000`

### API Endpoints

#### POST /api/sensor-data
Receive sensor data from ESP32

**Request Body:**
```json
{
  "bvp": 0.85,
  "temperature": 36.5,
  "acceleration": {
    "x": 0.02,
    "y": -0.01,
    "z": 0.98
  }
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Data processed and broadcasted",
  "data": {
    "bvp": 0.85,
    "temperature": 36.5,
    "acceleration_magnitude": 0.9803,
    "prediction": "Calm",
    "timestamp": "2024-01-01T12:00:00"
  }
}
```

#### GET /api/health
Health check endpoint

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "timestamp": "2024-01-01T12:00:00"
}
```

### WebSocket Events

#### Client → Server
- `connect`: Establish connection
- `ping`: Test connection

#### Server → Client
- `stream`: Real-time sensor data with predictions
- `status`: Connection status updates
- `pong`: Response to ping

### Optional USB Serial Listener

For direct ESP32 USB connection:

```bash
python serial_listener.py
```

Configure the COM port and baud rate in the script as needed.

## Data Flow

```
ESP32 → POST /api/sensor-data → Flask Backend → WebSocket → React Dashboard
  ↓
USB Serial (optional) → serial_listener.py → Flask Backend
```

## ML Model Integration

The backend automatically loads `stress_model.h5` from the `flask-backend` directory. The model expects features in this format:

```python
[bvp, temperature, acceleration_magnitude]
```

The model should output a single probability (sigmoid) where:
- `> 0.5` → `Stressed`
- `<= 0.5` → `Calm`

## Configuration

Key configuration options in `app.py`:
- `SECRET_KEY`: Flask secret key for sessions
- `host`: Server host (default: '0.0.0.0')
- `port`: Server port (default: 5000)
- `debug`: Debug mode (default: True)

## Testing

Test the API with curl:

```bash
curl -X POST http://localhost:5000/api/sensor-data \
  -H "Content-Type: application/json" \
  -d '{
    "bvp": 0.85,
    "temperature": 36.5,
    "acceleration": {"x": 0.02, "y": -0.01, "z": 0.98}
  }'
```

## Dependencies

- Flask: Web framework
- Flask-SocketIO: WebSocket support
- Flask-CORS: Cross-origin resource sharing
- TensorFlow: ML model loading and inference
- eventlet: Async server support
