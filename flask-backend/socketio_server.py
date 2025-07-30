from flask_socketio import SocketIO, emit
import logging

logger = logging.getLogger(__name__)

class SocketIOServer:
    """WebSocket server logic for real-time data streaming"""
    
    def __init__(self, app):
        self.socketio = SocketIO(app, cors_allowed_origins="*")
        self.setup_event_handlers()
    
    def setup_event_handlers(self):
        """Set up WebSocket event handlers"""
        
        @self.socketio.on('connect')
        def handle_connect():
            logger.info('Client connected to WebSocket')
            emit('status', {
                'message': 'Successfully connected to IntegriSense backend',
                'connected': True
            })
        
        @self.socketio.on('disconnect')
        def handle_disconnect():
            logger.info('Client disconnected from WebSocket')
        
        @self.socketio.on('ping')
        def handle_ping():
            """Handle ping from client for connection testing"""
            emit('pong', {'message': 'Connection is alive'})
    
    def broadcast_sensor_data(self, data):
        """Broadcast sensor data to all connected clients"""
        try:
            self.socketio.emit('stream', data)
            logger.info(f"Broadcasted data to all clients: {data.get('prediction', 'No prediction')}")
        except Exception as e:
            logger.error(f"Error broadcasting data: {e}")
    
    def get_socketio(self):
        """Get the SocketIO instance"""
        return self.socketio
