import serial
import json
import requests
import time
import logging
import threading
from serial_manager import SerialManager

logger = logging.getLogger(__name__)

class StandaloneSerialListener:
    """Standalone serial listener that posts to Flask backend"""
    
    def __init__(self, flask_url='http://localhost:5000'):
        self.flask_url = flask_url
        self.serial_manager = SerialManager(
            data_callback=self.send_to_flask
        )
    
    def send_to_flask(self, data):
        """Send parsed data to Flask backend via HTTP POST"""
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
    
    def start(self):
        """Start the standalone serial listener"""
        logger.info("Starting standalone serial listener...")
        self.serial_manager.start()
    
    def stop(self):
        """Stop the standalone serial listener"""
        logger.info("Stopping standalone serial listener...")
        self.serial_manager.stop()

# Example usage
if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    
    # Initialize standalone serial listener
    listener = StandaloneSerialListener(flask_url='http://localhost:5000')
    
    try:
        listener.start()
        print("Standalone serial listener started. Press Ctrl+C to stop.")
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nStopping serial listener...")
        listener.stop()
        print("Serial listener stopped")