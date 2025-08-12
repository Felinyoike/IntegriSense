from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import math
import numpy as np
import os
import logging
import threading
import time
import random
from datetime import datetime
from serial_manager import SerialManager
import eventlet
eventlet.monkey_patch()



# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
CORS(app, origins="*")
socketio = SocketIO(
    app, 
    cors_allowed_origins="*", 
    async_mode='eventlet',  # Use eventlet instead of threading
    logger=True, 
    engineio_logger=True,
    ping_timeout=60,
    ping_interval=25
)



def load_ml_model():
    """Load the TensorFlow Keras model if available"""
    global ml_model
    ml_model = None
    try:
        try:
            import tensorflow as tf  # Lazy import to avoid hard dependency at startup
        except Exception as import_err:
            logger.warning(f"TensorFlow not available: {import_err}. Running without ML model.")
            return

        current_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(current_dir, 'stress_model.h5')
        if os.path.exists(model_path):
            ml_model = tf.keras.models.load_model(model_path)
            logger.info("TensorFlow model loaded successfully")
        else:
            logger.warning(f"TensorFlow model not found at {model_path}")
    except Exception as e:
        logger.error(f"Error loading TensorFlow model: {e}")

def calculate_acceleration_magnitude(acceleration):
    """Calculate acceleration magnitude from x, y, z components"""
    x = acceleration.get('x', 0)
    y = acceleration.get('y', 0)
    z = acceleration.get('z', 0)
    magnitude = math.sqrt(x**2 + y**2 + z**2)
    return magnitude

def predict_stress_level(features):
    """Predict stress level using the TensorFlow model"""
    global ml_model
    if ml_model is None:
        return "Model Not Available"
    try:
        # Features should be in format: [bvp, temperature, acceleration_magnitude]
        input_data = np.array([features], dtype=np.float32)
        prediction = ml_model.predict(input_data, verbose=0)
        # Assume a single sigmoid output at index [0][0]
        score = float(prediction[0][0]) if hasattr(prediction, '__getitem__') else float(prediction)
        return "Stressed" if score > 0.5 else "Calm"
    except Exception as e:
        logger.error(f"Error making prediction: {e}")
        return "Prediction Error"

    return '''
<!DOCTYPE html>
<html>
<head>
    <title>Socket.IO Test</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.7.2/socket.io.js"></script>
</head>
<body>
    <h1>Socket.IO Test</h1>
    <div id="status">Connecting...</div>
    <div id="data-count">Data packets: 0</div>
    <div id="latest">Latest data will appear here</div>
    <script>
        const socket = io('http://localhost:5000', {  // Note: changed to port 5000
            transports: ['polling']
        });
        
        let count = 0;
        
        socket.on('connect', () => {
            document.getElementById('status').innerHTML = '✅ Connected! ID: ' + socket.id;
            document.getElementById('status').style.color = 'green';
            console.log('Connected to Socket.IO!');
        });
        
        socket.on('connect_error', (error) => {
            document.getElementById('status').innerHTML = '❌ Error: ' + error;
            document.getElementById('status').style.color = 'red';
            console.error('Connection error:', error);
        });
        
        socket.on('stream', (data) => {
            count++;
            document.getElementById('data-count').innerHTML = 'Data packets: ' + count;
            document.getElementById('latest').innerHTML = 
                'BVP: ' + data.bvp + 
                ', Temp: ' + data.temperature + 
                ', Accel: ' + data.acceleration_magnitude;
            console.log('ESP32 Data:', data);
        });
    </script>
</body>
</html>
    '''   

def process_and_broadcast_data(data, source='http'):
    """Process sensor data and broadcast via SocketIO"""
    try:
        # Handle different data formats from ESP32 vs HTTP
        if source == 'serial':
            # Parse ESP32 serial data (assuming comma-separated values)
            # Expected format: "bvp,temperature,acc_x,acc_y,acc_z"
            if isinstance(data, str):
                values = data.strip().split(',')
                logger.info(f"Parsed ESP32 data: {values} (count: {len(values)})")
                
                # Map values to sensor readings (adjust based on your ESP32 output)
                if len(values) >= 5:  # We need 5 values: bvp, temp, acc_x, acc_y, acc_z
                    parsed_data = {
                        'bvp': float(values[0]) if values[0] != 'No prediction' else 0.0,
                        'temperature': float(values[1]) if len(values) > 1 else 0.0,
                        'acceleration': {
                            'x': float(values[2]) if len(values) > 2 else 0.0,
                            'y': float(values[3]) if len(values) > 3 else 0.0,
                            'z': float(values[4]) if len(values) > 4 else 0.0
                        }
                    }
                else:
                    logger.warning(f"Insufficient data from ESP32: {values}")
                    return None
            else:
                parsed_data = data
        else:
            # HTTP data should already be in dict format
            parsed_data = data

        # Handle acceleration magnitude
        if 'acceleration' in parsed_data and isinstance(parsed_data['acceleration'], dict):
            acceleration_magnitude = calculate_acceleration_magnitude(parsed_data['acceleration'])
        else:
            acceleration_magnitude = parsed_data.get('acceleration_magnitude', 0)
        
        # Prepare features for prediction and compute prediction
        features = [
            float(parsed_data.get('bvp', 0)),
            float(parsed_data.get('temperature', 0)),
            float(acceleration_magnitude)
        ]
        prediction_label = predict_stress_level(features)
        
        # Prepare payload for WebSocket emission
        payload = {
            'bvp': parsed_data.get('bvp', 0),
            'temperature': parsed_data.get('temperature', 0),
            'acceleration_magnitude': round(acceleration_magnitude, 4),
            'prediction': prediction_label,
            'timestamp': datetime.now().isoformat(),
            'source': source  # Track data source (http/serial)
        }
        
        # Emit to all connected clients via WebSocket
        socketio.emit('stream', payload)
        
        # Also emit ESP32 connection status
        if source == 'serial':
            socketio.emit('esp32_status', {'connected': True})
        
        logger.info(f"Processed and broadcasted sensor data from {source}: {payload}")
        
        return payload
        
    except Exception as e:
        logger.error(f"Error processing sensor data: {e}")
        # Still try to broadcast an error state
        error_payload = {
            'bvp': 0,
            'temperature': 0,
            'acceleration_magnitude': 0,
            'timestamp': datetime.now().isoformat(),
            'source': source,
            'error': str(e)
        }
        socketio.emit('stream', error_payload)
        return None

@app.route('/api/sensor-data', methods=['POST'])
def receive_sensor_data():
    """Receive sensor data from ESP32 and process it"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data received'}), 400
        
        # Validate required fields
        required_fields = ['bvp', 'temperature']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Process and broadcast data
        payload = process_and_broadcast_data(data, source='http')
        
        if payload:
            return jsonify({
                'status': 'success',
                'message': 'Data processed and broadcasted',
                'data': payload
            }), 200
        else:
            return jsonify({'error': 'Failed to process data'}), 500
            
    except Exception as e:
        logger.error(f"Error processing sensor data: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': ml_model is not None,
        'serial_connected': serial_manager.is_connected() if serial_manager else False,
        'timestamp': datetime.now().isoformat()
    }), 200

# Serial configuration endpoints
@app.route('/api/serial/status', methods=['GET'])
def serial_status():
    """Get serial connection status"""
    if not serial_manager:
        return jsonify({'error': 'Serial manager not initialized'}), 500
    
    return jsonify(serial_manager.get_status()), 200

@app.route('/api/serial/configure', methods=['POST'])
def configure_serial():
    """Configure serial connection"""
    try:
        config = request.get_json()
        if not serial_manager:
            return jsonify({'error': 'Serial manager not initialized'}), 500
        
        serial_manager.update_config(config)
        return jsonify({'status': 'success', 'message': 'Serial configuration updated'}), 200
        
    except Exception as e:
        logger.error(f"Error configuring serial: {e}")
        return jsonify({'error': 'Failed to configure serial'}), 500

@app.route('/api/serial/send', methods=['POST'])
def send_serial_command():
    """Send command to ESP32 via serial"""
    try:
        data = request.get_json()
        message = data.get('message')
        
        if not message:
            return jsonify({'error': 'Message required'}), 400
        
        if not serial_manager:
            return jsonify({'error': 'Serial manager not initialized'}), 500
        
        success = serial_manager.send_command(message)
        
        if success:
            return jsonify({'status': 'success', 'message': 'Command sent to ESP32'}), 200
        else:
            return jsonify({'error': 'Failed to send command - check serial connection'}), 500
            
    except Exception as e:
        logger.error(f"Error sending serial command: {e}")
        return jsonify({'error': 'Failed to send command'}), 500

# Test endpoint to simulate ESP32 data
@app.route('/api/test-data', methods=['POST'])
def send_test_data():
    """Send test data to simulate ESP32 for debugging"""
    test_data = {
        'bvp': round(random.uniform(0.5, 2.0), 3),
        'temperature': round(random.uniform(36.0, 37.5), 1),
        'acceleration': {
            'x': round(random.uniform(-1.0, 1.0), 3),
            'y': round(random.uniform(-1.0, 1.0), 3),
            'z': round(random.uniform(-1.0, 1.0), 3)
        }
    }
    
    payload = process_and_broadcast_data(test_data, source='test')
    
    return jsonify({
        'status': 'success',
        'message': 'Test data sent',
        'data': payload
    }), 200

# Add endpoint to check ESP32 connection status
@app.route('/api/esp32/status', methods=['GET'])
def esp32_status():
    """Get ESP32 connection status"""
    if serial_manager:
        status = {
            'connected': serial_manager.is_connected(),
            'port': getattr(serial_manager, 'port', None),
            'last_data': getattr(serial_manager, 'last_received', None)
        }
    else:
        status = {
            'connected': False,
            'port': None,
            'last_data': None
        }
    
    return jsonify(status), 200

# SocketIO event handlers
@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    logger.info('Client connected')
    emit('status', {'message': 'Connected to Flask backend'})

@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection"""
    logger.info('Client disconnected')

@socketio.on('ping')
def handle_ping():
    """Handle ping from client for connection testing"""
    emit('pong', {'message': 'Connection is alive'})

def setup_serial_manager():
    """Initialize and setup serial manager"""
    global serial_manager
    
    try:
        serial_manager = SerialManager(
            data_callback=lambda data: process_and_broadcast_data(data, source='serial'),
            socketio_instance=socketio
        )
        
        # Start serial manager in background thread
        serial_thread = threading.Thread(target=serial_manager.start, daemon=True)
        serial_thread.start()
        
        logger.info("Serial manager initialized and started")
        
    except Exception as e:
        logger.error(f"Failed to setup serial manager: {e}")

if __name__ == '__main__':
    # Load ML model on startup
    load_ml_model()
    
    # Setup serial manager
    setup_serial_manager()
    
    # Run the Flask-SocketIO server
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)