import serial
import serial.tools.list_ports
import json
import time
import threading
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class SerialManager:
    """Enhanced serial manager for ESP32 USB communication"""
    
    def __init__(self, data_callback=None, socketio_instance=None):
        self.data_callback = data_callback
        self.socketio = socketio_instance
        self.config = {
            'port': '/dev/ttyUSB0',  # Default Linux port
            'baudrate': 115200,
            'timeout': 1,
            'auto_detect': True,
            'enabled': True
        }
        
        self.serial_conn = None
        self.is_running = False
        self.connection_thread = None
        self.reconnect_attempts = 0
        self.max_reconnect_attempts = 5
        
    def find_esp32_ports(self):
        """Auto-detect potential ESP32 ports"""
        ports = serial.tools.list_ports.comports()
        esp32_ports = []
        
        for port in ports:
            # Look for common ESP32 identifiers
            description = (port.description or '').lower()
            if any(keyword in description for keyword in 
                   ['esp32', 'cp210x', 'ch340', 'ftdi', 'usb-serial', 'silicon labs']):
                esp32_ports.append(port.device)
        
        # Platform-specific fallbacks
        if not esp32_ports:
            import platform
            system = platform.system().lower()
            if system == 'linux':
                esp32_ports = ['/dev/ttyUSB0', '/dev/ttyUSB1', '/dev/ttyACM0', '/dev/ttyACM1']
            elif system == 'windows':
                esp32_ports = ['COM3', 'COM4', 'COM5', 'COM6']
            elif system == 'darwin':  # macOS
                esp32_ports = ['/dev/cu.usbserial-0001', '/dev/cu.SLAB_USBtoUART']
        
        return esp32_ports
    
    def connect(self):
        """Establish serial connection"""
        try:
            # Auto-detect port if enabled
            if self.config['auto_detect']:
                detected_ports = self.find_esp32_ports()
                if detected_ports:
                    self.config['port'] = detected_ports[0]
                    logger.info(f"Auto-detected ESP32 port: {self.config['port']}")
            
            # Attempt connection
            self.serial_conn = serial.Serial(
                port=self.config['port'],
                baudrate=self.config['baudrate'],
                timeout=self.config['timeout']
            )
            
            logger.info(f"Connected to ESP32 on {self.config['port']} at {self.config['baudrate']} baud")
            self.reconnect_attempts = 0
            
            # Notify via SocketIO if available
            if self.socketio:
                self.socketio.emit('serial_status', {
                    'connected': True,
                    'port': self.config['port'],
                    'message': f"ESP32 connected on {self.config['port']}"
                })
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to connect to {self.config['port']}: {e}")
            
            # Notify via SocketIO if available
            if self.socketio:
                self.socketio.emit('serial_status', {
                    'connected': False,
                    'error': str(e),
                    'message': f"Failed to connect to {self.config['port']}"
                })
            
            return False
    
    def disconnect(self):
        """Disconnect from serial port"""
        self.is_running = False
        if self.serial_conn and self.serial_conn.is_open:
            self.serial_conn.close()
            logger.info("Disconnected from ESP32")
            
            # Notify via SocketIO if available
            if self.socketio:
                self.socketio.emit('serial_status', {
                    'connected': False,
                    'message': "ESP32 disconnected"
                })
    
    def listen_loop(self):
        """Main listening loop for serial data"""
        while self.is_running:
            try:
                if self.serial_conn and self.serial_conn.is_open:
                    if self.serial_conn.in_waiting > 0:
                        line = self.serial_conn.readline().decode('utf-8').strip()
                        
                        if line:
                            try:
                                # Try to parse as JSON
                                data = json.loads(line)
                                data['timestamp'] = datetime.now().isoformat()
                                
                                logger.info(f"Received serial data: {data.get('prediction', 'No prediction')}")
                                
                                # Call data callback if provided
                                if self.data_callback:
                                    self.data_callback(data)
                                
                            except json.JSONDecodeError:
                                # Handle non-JSON data
                                logger.debug(f"Received non-JSON data: {line}")
                
                time.sleep(0.01)  # Small delay to prevent CPU overload
                
            except serial.SerialException as e:
                logger.error(f"Serial error: {e}")
                self.handle_disconnection()
                break
            except Exception as e:
                logger.error(f"Unexpected error in listen loop: {e}")
                time.sleep(1)
    
    def handle_disconnection(self):
        """Handle disconnection and attempt reconnection"""
        self.disconnect()
        
        if self.reconnect_attempts < self.max_reconnect_attempts:
            self.reconnect_attempts += 1
            logger.info(f"Attempting reconnection {self.reconnect_attempts}/{self.max_reconnect_attempts}")
            
            time.sleep(5)  # Wait before reconnecting
            if self.connect():
                self.listen_loop()
        else:
            logger.error("Max reconnection attempts reached. Serial connection stopped.")
    
    def send_command(self, message):
        """Send command to ESP32 via serial"""
        if self.serial_conn and self.serial_conn.is_open:
            try:
                self.serial_conn.write(f"{message}\n".encode('utf-8'))
                logger.info(f"Sent command to ESP32: {message}")
                return True
            except Exception as e:
                logger.error(f"Failed to send command: {e}")
                return False
        else:
            logger.warning("Serial connection not available for sending command")
            return False
    
    def start(self):
        """Start serial manager"""
        if not self.config['enabled']:
            logger.info("Serial connection disabled in configuration")
            return
        
        self.is_running = True
        
        if self.connect():
            self.connection_thread = threading.Thread(target=self.listen_loop, daemon=True)
            self.connection_thread.start()
            logger.info("Serial manager started successfully")
        else:
            logger.warning("Serial manager failed to start - no connection established")
    
    def stop(self):
        """Stop serial manager"""
        self.is_running = False
        self.disconnect()
        
        if self.connection_thread and self.connection_thread.is_alive():
            self.connection_thread.join(timeout=2)
        
        logger.info("Serial manager stopped")
    
    def update_config(self, new_config):
        """Update serial configuration and restart if needed"""
        old_config = self.config.copy()
        self.config.update(new_config)
        
        # Restart if configuration changed significantly
        if (old_config['port'] != self.config['port'] or 
            old_config['baudrate'] != self.config['baudrate'] or
            old_config['enabled'] != self.config['enabled']):
            
            logger.info("Serial configuration changed, restarting...")
            self.stop()
            time.sleep(1)
            self.start()
    
    def get_status(self):
        """Get current serial manager status"""
        return {
            'connected': self.is_connected(),
            'port': self.config['port'],
            'baudrate': self.config['baudrate'],
            'auto_detect': self.config['auto_detect'],
            'enabled': self.config['enabled'],
            'reconnect_attempts': self.reconnect_attempts,
            'available_ports': self.find_esp32_ports(),
            'platform': __import__('platform').system().lower()
        }
    
    def is_connected(self):
        """Check if serial connection is active"""
        return (self.serial_conn is not None and 
                self.serial_conn.is_open and 
                self.is_running)