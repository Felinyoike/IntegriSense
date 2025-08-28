from flask import Flask
from flask_socketio import SocketIO
import eventlet
import time
import threading

eventlet.monkey_patch()

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="eventlet")

@app.route("/")
def index():
    return "Socket.IO test server running!"

# When a client connects
@socketio.on("connect")
def handle_connect():
    print("✅ Client connected")
    socketio.emit("message", {"data": "Welcome, client!"})

# Background thread that pushes data every 2s
def background_task():
    while True:
        socketio.emit("message", {"data": f"Server time: {time.strftime('%H:%M:%S')}"})
        time.sleep(2)

if __name__ == "__main__":
    threading.Thread(target=background_task, daemon=True).start()
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)
