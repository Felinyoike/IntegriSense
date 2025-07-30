from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import math
import joblib
import os
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
CORS(app, origins="*")
socketio = SocketIO(app, cors_allowed_origins="*")

# Global variable to store ML model
ml_model = None

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

@app.route('/api/sensor-data', methods=['POST'])
def receive_sensor_data():
    """Receive sensor data from ESP32 and process it"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data received'}), 400
        
        # Validate required fields
        required_fields = ['bvp', 'hrv', 'temperature', 'eda', 'acceleration']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Calculate acceleration magnitude
        acceleration_magnitude = calculate_acceleration_magnitude(data['acceleration'])
        
        # Prepare features for ML model
        features = [
            data['bvp'],
            data['hrv'],
            data['temperature'],
            data['eda'],
            acceleration_magnitude
        ]
        
        # Get prediction
        prediction = predict_stress_level(features)
        
        # Prepare payload for WebSocket emission
        payload = {
            'bvp': data['bvp'],
            'hrv': data['hrv'],
            'temperature': data['temperature'],
            'eda': data['eda'],
            'acceleration_magnitude': round(acceleration_magnitude, 4),
            'prediction': prediction,
            'timestamp': datetime.now().isoformat()
        }
        
        # Emit to all connected clients via WebSocket
        socketio.emit('stream', payload)
        
        logger.info(f"Processed sensor data: {payload}")
        
        return jsonify({
            'status': 'success',
            'message': 'Data processed and broadcasted',
            'data': payload
        }), 200
        
    except Exception as e:
        logger.error(f"Error processing sensor data: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': ml_model is not None,
        'timestamp': datetime.now().isoformat()
    }), 200

@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    logger.info('Client connected')
    emit('status', {'message': 'Connected to Flask backend'})

@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection"""
    logger.info('Client disconnected')

if __name__ == '__main__':
    # Load ML model on startup
    load_ml_model()
    
    # Run the Flask-SocketIO server
    socketio.run(app, host='0.0.0.0', port=8080, debug=True)
