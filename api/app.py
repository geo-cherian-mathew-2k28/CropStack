"""
CropStack Sensor API — Flask Backend
Serves real-time sensor data, market prices, orders, and transactions.
"""

from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import time
import threading
import json
import os
import random
from datetime import datetime, timedelta
import socketio as sio_client

app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

# ─────────────────────────────────────────────
#  DATA STORE
# ─────────────────────────────────────────────

THRESHOLDS_FILE = 'thresholds.json'

def load_thresholds():
    default = {"temperature": 30.0, "humidity": 65.0}
    if os.path.exists(THRESHOLDS_FILE):
        try:
            with open(THRESHOLDS_FILE, 'r') as f:
                return json.load(f)
        except: pass
    return default

def save_thresholds_to_file(t):
    try:
        with open(THRESHOLDS_FILE, 'w') as f:
            json.dump(t, f)
    except: pass

manual_mode = False
thresholds = load_thresholds()

sensor_data = {
    "temperature": 24.5,
    "humidity": 58.2,
    "fan_status": "OFF",
    "system_status": "SAFE",
    "ventilation": "CLOSED",
    "last_pulse": "Never",
    "soil_moisture": 42.0,
    "manual_mode": False
}

sensor_history = {key: [] for key in sensor_data}
network_stats = {"total_nodes": 12, "active_hubs": 4, "uptime_99": 99.8}
cluster_health = "Optimal"

hubs_registry = {}
farmers_inventory = {
    "farmer-101": {
        "name": "Arjun Singh",
        "hub": "North Zone Hub",
        "crop": "Basmati Rice",
        "quantity": 250,
        "stored_at": "Silo A1",
        "loan_status": "none",
        "auto_sell_threshold": 4800.0,
        "auto_sell_enabled": False
    },
    "farmer-202": {
        "name": "Meera Bai",
        "hub": "South Zone Hub",
        "crop": "Red Wheat",
        "quantity": 180,
        "stored_at": "Silo B4",
        "loan_status": "approved",
        "loan_amount": 60000,
        "auto_sell_threshold": 2200.0,
        "auto_sell_enabled": True
    }
}

def calculate_loan_eligibility(farmer_id):
    inventory = farmers_inventory.get(farmer_id)
    if not inventory: return {"eligible": False, "min_amount": 0}
    market_price = 4540.0 if inventory["crop"] == "Basmati Rice" else 2110.0
    total_value = inventory["quantity"] * market_price
    eligible = total_value >= 80000
    return {
        "eligible": eligible,
        "total_value": total_value,
        "min_amount": 50000 if eligible else 0,
        "max_amount": total_value * 0.6
    }

# ─────────────────────────────────────────────
#  SENSOR LOOP
# ─────────────────────────────────────────────

def sensor_loop():
    global sensor_data, thresholds, manual_mode, sensor_history
    while True:
        try:
            ts = datetime.now().isoformat()
            
            # Physics Sim
            if not manual_mode:
                sensor_data["temperature"] = round(22.0 + random.uniform(-0.5, 2.0), 1)
                sensor_data["humidity"] = round(55.0 + random.uniform(-1.0, 5.0), 1)
                
                max_temp = thresholds.get("temperature", 30.0)
                if sensor_data["temperature"] > max_temp:
                    sensor_data["system_status"] = "COOLING"
                    sensor_data["fan_status"] = "ON"
                else:
                    sensor_data["system_status"] = "SAFE"
                    sensor_data["fan_status"] = "OFF"
            
            sensor_data["manual_mode"] = manual_mode
            sensor_data["last_pulse"] = datetime.now().strftime("%H:%M:%S")

            # History
            for key in sensor_data:
                if key in sensor_history:
                    sensor_history[key].append({"time": ts, "value": sensor_data[key]})
                    if len(sensor_history[key]) > 60:
                        sensor_history[key] = sensor_history[key][-60:]

            socketio.emit('sensor_update', sensor_data)
            time.sleep(3)
        except Exception as e:
            print(f"Loop Error: {e}")
            time.sleep(5)

# ─────────────────────────────────────────────
#  ENDPOINTS
# ─────────────────────────────────────────────

@app.route('/')
def index():
    return render_template('dashboard.html')

@app.route('/api/sensors', methods=['GET'])
def get_sensors():
    return jsonify({"sensors": sensor_data, "status": "online"})

@app.route('/api/farmer/<farmer_id>', methods=['GET'])
def get_farmer(farmer_id):
    data = farmers_inventory.get(farmer_id)
    if not data: return jsonify({"error": "not found"}), 404
    eligibility = calculate_loan_eligibility(farmer_id)
    return jsonify({
        "inventory": data,
        "market_price": 4540.0 if data["crop"] == "Basmati Rice" else 2110.0,
        "loan_eligibility": eligibility,
        "profit_projection": (data["quantity"] * 4540.0) * 0.15 
    })

@app.route('/api/admin/data', methods=['GET'])
def get_admin_data():
    return jsonify({
        "hubs": [],
        "farmers": list(farmers_inventory.values()),
        "stats": network_stats
    })

@app.route('/api/stats/buyer', methods=['GET'])
def get_buyer_stats():
    return jsonify({
        "stats": {
            "active_orders": 14,
            "savings": 4200.0,
            "completed": 102,
            "order_growth": 12.4
        }
    })

@app.route('/api/market', methods=['GET'])
def get_market():
    return jsonify({
        "commodities": [
            {"name": "Basmati Rice", "price": 4540.0, "change": 4.2, "category": "grain", "volume": "142k q"},
            {"name": "Red Wheat", "price": 2110.0, "change": -1.5, "category": "grain", "volume": "89k q"}
        ]
    })

@app.route('/api/orders', methods=['GET'])
def get_orders():
    return jsonify({"orders": []})

@app.route('/api/control', methods=['POST'])
def control():
    global manual_mode
    data = request.json
    manual_mode = data.get("manual_mode", manual_mode)
    return jsonify({"status": "ok", "manual_mode": manual_mode})

@app.route('/api/farmer/<farmer_id>/auto-sell', methods=['POST'])
def update_auto_sell(farmer_id):
    data = request.json
    if farmer_id in farmers_inventory:
        farmers_inventory[farmer_id]["auto_sell_enabled"] = data.get("enabled", False)
        farmers_inventory[farmer_id]["auto_sell_threshold"] = float(data.get("threshold", 0))
        return jsonify({"status": "updated"})
    return jsonify({"error": "not found"}), 404

if __name__ == '__main__':
    threading.Thread(target=sensor_loop, daemon=True).start()
    socketio.run(app, debug=True, port=5000, host='0.0.0.0')
