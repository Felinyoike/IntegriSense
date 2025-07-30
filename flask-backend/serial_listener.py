import serial
import json
import requests
import time
import logging
from threading import Thread

logger = logging.getLogger(__name__)

class SerialListener:
    """Optional USB serial listener for ESP32 data ingestion"""
    
    def __init__(self, port='COM3', baudrate=115200, flask_url='http://localhost:5000'):
        self.port = port
        self.baudrate = baudrate
        self.flask_url = flask_url
        self.serial_connection = None
        self.is_listening = False
        self.listener_thread = None
    
    def connect(self):
        """Connect to the serial port"""
        try:
            self.serial_connection = serial.Serial(self.port, self.baudrate, timeout=1)
            logger.info(f"Connected to serial port {self.port} at {self.baudrate} baud")
            return True
        except Exception as e:
            logger.error(f"Failed to connect to serial port: {e}")
            return False
    
    def disconnect(self):
        """Disconnect from the serial port"""
        self.is_listening = False
        if self.serial_connection and self.serial_connection.is_open:
            self.serial_connection.close()
            logger.info("Disconnected from serial port")
    
    def parse_sensor_data(self, raw_data):
        """Parse raw sensor data from ESP32"""
        try:
            # Assuming ESP32 sends JSON data
            data = json.loads(raw_data.strip())
            
            # Validate required fields
            required_fields = ['bvp', 'hrv', 'temperature', 'eda', 'acceleration']
            for field in required_fields:
                if field not in data:
                    logger.warning(f"Missing field {field} in sensor data")
                    return None
            
            return data
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON data: {e}")
            return None
        except Exception as e:
            logger.error(f"Error parsing sensor data: {e}")
            return None
    
    def send_to_flask(self, data):
        """Send parsed data to Flask backend"""
        try:
            response = requests.post(
                f"{self.flask_url}/api/sensor-data",
                json=data,
                headers={'Content-Type': 'application/json'},
                timeout=5
            )
            
            if response.status_code == 200:
                logger.info("Data successfully sent to Flask backend")
            else:
                logger.error(f"Flask backend returned status {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to send data to Flask backend: {e}")
    
    def listen_loop(self):
        """Main listening loop for serial data"""
        while self.is_listening and self.serial_connection and self.serial_connection.is_open:
            try:
                if self.serial_connection.in_waiting > 0:
                    raw_data = self.serial_connection.readline().decode('utf-8')
                    
                    if raw_data.strip():
                        logger.debug(f"Received raw data: {raw_data.strip()}")
                        
                        parsed_data = self.parse_sensor_data(raw_data)
                        if parsed_data:
                            self.send_to_flask(parsed_data)
                
                time.sleep(0.1)  # Small delay to prevent excessive CPU usage
                
            except Exception as e:
                logger.error(f"Error in listen loop: {e}")
                time.sleep(1)  # Wait before retrying
    
    def start_listening(self):
        """Start listening for serial data in a separate thread"""
        if not self.connect():
            return False
        
        self.is_listening = True
        self.listener_thread = Thread(target=self.listen_loop, daemon=True)
        self.listener_thread.start()
        logger.info("Started serial listening thread")
        return True
    
    def stop_listening(self):
        """Stop listening for serial data"""
        self.is_listening = False
        if self.listener_thread and self.listener_thread.is_alive():
            self.listener_thread.join(timeout=2)
        self.disconnect()
        logger.info("Stopped serial listening")

# Example usage
if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    
    # Initialize serial listener
    listener = SerialListener(port='COM3', baudrate=115200)
    
    try:
        # Start listening
        if listener.start_listening():
            print("Serial listener started. Press Ctrl+C to stop.")
            while True:
                time.sleep(1)
        else:
            print("Failed to start serial listener")
    except KeyboardInterrupt:
        print("\nStopping serial listener...")
        listener.stop_listening()
        print("Serial listener stopped")
