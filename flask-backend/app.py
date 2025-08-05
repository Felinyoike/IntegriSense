from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import math
import joblib
import os
import logging
import threading
import time
from datetime import datetime
from serial_manager import SerialManager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
CORS(app, origins="*")
socketio = SocketIO(app, cors_allowed_origins="*")

# Global variables
ml_model = None
serial_manager = None

def load_ml_model():
    """Load the ML model if available"""
    global ml_model
    # Try current directory first
    model_path = 'stress_detection_model.pkl'
    # If not found, try parent directory
    if not os.path.exists(model_path):
        model_path = os.path.join('..', 'stress_detection_model.pkl')
    
    try:
        if os.path.exists(model_path):
            ml_model = joblib.load(model_path)
            logger.info("ML model loaded successfully")
        else:
            logger.warning(f"ML model not found at {model_path}")
    except Exception as e:
        logger.error(f"Error loading ML model: {e}")

def calculate_acceleration_magnitude(acceleration):
    """Calculate acceleration magnitude from x, y, z components"""
    x = acceleration.get('x', 0)
    y = acceleration.get('y', 0)
    z = acceleration.get('z', 0)
    magnitude = math.sqrt(x**2 + y**2 + z**2)
    return magnitude

def predict_stress_level(features):
    """Predict stress level using the ML model"""
    global ml_model
    if ml_model is None:
        return "Model Not Available"
    
    try:
        # Features should be in format: [bvp, hrv, temperature, eda, acceleration_magnitude]
        prediction = ml_model.predict([features])
        # Convert prediction to readable format
        # Assuming the model returns 0 for Calm, 1 for Stressed
        if prediction[0] == 0:
            return "Calm"
        elif prediction[0] == 1:
            return "Stressed"
        else:
            return f"Unknown ({prediction[0]})"
    except Exception as e:
        logger.error(f"Error making prediction: {e}")
        return "Prediction Error"

def process_and_broadcast_data(data, source='http'):
    """Process sensor data and broadcast via SocketIO"""
    try:
        # Handle acceleration magnitude
        if 'acceleration' in data:
            acceleration_magnitude = calculate_acceleration_magnitude(data['acceleration'])
        else:
            acceleration_magnitude = data.get('acceleration_magnitude', 0)
        
        # Prepare features for ML model
        features = [
            data.get('bvp', 0),
            data.get('hrv', 0),
            data.get('temperature', 0),
            data.get('eda', 0),
            acceleration_magnitude
        ]
        
        # Get prediction
        prediction = predict_stress_level(features)
        
        # Prepare payload for WebSocket emission
        payload = {
            'bvp': data.get('bvp', 0),
            'hrv': data.get('hrv', 0),
            'temperature': data.get('temperature', 0),
            'eda': data.get('eda', 0),
            'acceleration_magnitude': round(acceleration_magnitude, 4),
            'prediction': prediction,
            'timestamp': datetime.now().isoformat(),
            'source': source  # Track data source (http/serial)
        }
        
        # Emit to all connected clients via WebSocket
        socketio.emit('stream', payload)
        logger.info(f"Processed and broadcasted sensor data from {source}: {prediction}")
        
        return payload
        
    except Exception as e:
        logger.error(f"Error processing sensor data: {e}")
        return None

@app.route('/api/sensor-data', methods=['POST'])
def receive_sensor_data():
    """Receive sensor data from ESP32 and process it"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data received'}), 400
        
        # Validate required fields
        required_fields = ['bvp', 'hrv', 'temperature', 'eda']
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
    socketio.run(app, host='0.0.0.0', port=8080, debug=True)