"""
CropStack Professional IoT Backend — Hub Management Engine
"""

from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import time
import threading
import json
import os
import random
from datetime import datetime
import socketio as sio_client

app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

# ─────────────────────────────────────────────
#  STATE MANAGEMENT
# ─────────────────────────────────────────────

sensor_data = {
    "temperature": 0.0,
    "humidity": 0.0,
    "fan_status": "OFF",
    "system_status": "OFFLINE",
    "ventilation": "CLOSED",
    "light_status": "OFF",
    "last_pulse": "Never",
    "soil_moisture": 0.0,
    "manual_mode": False
}

control_state = {
    "fan": "OFF",
    "light": "OFF",
    "ventilation": "CLOSED"
}

sensor_history = {key: [] for key in sensor_data if key != "last_pulse"}
last_received_time = 0

farmers_inventory = {
    "farmer-101": {
        "name": "Arjun Singh", "hub": "Hub Alpha", "crop": "Basmati", 
        "quantity": 250, "stored_at": "Silo 1", "loan_status": "none"
    }
}

# ─────────────────────────────────────────────
#  KOYEB CLOUD RELAY (Bridges real IoT data)
# ─────────────────────────────────────────────

KOYEB_URL = "https://atomic-maryjo-cropstack-2280857f.koyeb.app"
sio = sio_client.Client()

@sio.on('connect')
def on_cloud_connect():
    print("✅ Linked to Koyeb Cloud Relay: VALID DATA MODE ACTIVE")

@sio.on('sensor_data')
def on_cloud_sensor_data(data):
    global last_received_time
    last_received_time = time.time()
    
    # Map cloud data to internal state
    for key in ["temperature", "humidity", "system_status", "fan_status", "light_status", "ventilation"]:
        if key in data:
            sensor_data[key] = data[key]
    
    sensor_data["last_pulse"] = datetime.now().strftime("%H:%M:%S")
    socketio.emit('sensor_update', sensor_data)

def start_cloud_bridge():
    try:
        sio.connect(KOYEB_URL)
        sio.wait()
    except:
        print("⚠️ Cloud Relay unreachable. Simulation fallback enabled.")

# ─────────────────────────────────────────────
#  SENSOR LOOP (Simulation fallback only)
# ─────────────────────────────────────────────

def sensor_loop():
    global sensor_data
    while True:
        # Only simulate if no real data for 10 seconds
        if time.time() - last_received_time > 10:
            if not sensor_data["manual_mode"]:
                sensor_data["temperature"] = round(22.0 + random.uniform(-0.5, 2.0), 1)
                sensor_data["humidity"] = round(55.0 + random.uniform(-1.0, 5.0), 1)
                sensor_data["system_status"] = "SIMULATED"
            
            sensor_data["last_pulse"] = "Simulating..."
            socketio.emit('sensor_update', sensor_data)
        
        # Log History
        ts = datetime.now().isoformat()
        for key in sensor_history:
            if key in sensor_data:
                sensor_history[key].append({"time": ts, "value": sensor_data[key]})
                if len(sensor_history[key]) > 50: sensor_history[key].pop(0)

        time.sleep(3)

# ─────────────────────────────────────────────
#  API ROUTES
# ─────────────────────────────────────────────

@app.route('/')
def index():
    return render_template('dashboard.html')

@app.route('/api/sensors', methods=['GET'])
def get_sensors():
    return jsonify({"sensors": sensor_data, "status": "online"})

@app.route('/api/sensor', methods=['POST'])
def post_sensor():
    """Endpoint used by ESP32 directly if connected locally."""
    global last_received_time
    data = request.json
    last_received_time = time.time()
    sensor_data.update(data)
    sensor_data["last_pulse"] = datetime.now().strftime("%H:%M:%S")
    socketio.emit('sensor_update', sensor_data)
    return jsonify({"status": "received", "commands": control_state})

@app.route('/api/control', methods=['POST'])
def post_control():
    global control_state, sensor_data
    data = request.json
    if "manual_mode" in data:
        sensor_data["manual_mode"] = data["manual_mode"]
    
    # Update commands for ESP32
    control_state["fan"] = data.get("fan", control_state["fan"])
    control_state["light"] = data.get("light", control_state["light"])
    control_state["ventilation"] = data.get("ventilation", control_state["ventilation"])
    
    # Broadcast to web dashboards
    socketio.emit('control_update', control_state)
    return jsonify({"status": "ok", "control_state": control_state})

@app.route('/api/admin/data')
def admin_data():
    return jsonify({
        "farmers": list(farmers_inventory.values()),
        "hubs": [{"name": "Hub Alpha", "location": "North", "status": "Active"}]
    })

@app.route('/api/orders')
def get_orders():
    # Placeholder for real order data
    return jsonify({"orders": [
        {"id": "ORD-77", "buyer_name": "Reliable Grains", "product_name": "Basmati", "quantity": 120, "status": "reserved", "created_at": datetime.now().isoformat()}
    ]})

if __name__ == '__main__':
    threading.Thread(target=sensor_loop, daemon=True).start()
    threading.Thread(target=start_cloud_bridge, daemon=True).start()
    socketio.run(app, debug=True, port=5000, host='0.0.0.0')
