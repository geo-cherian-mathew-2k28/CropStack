"""
CropStack Sensor API — Flask Backend
Serves real-time sensor data, market prices, orders, and transactions.
Includes an admin dashboard to control all sensor values.
"""

import eventlet
eventlet.monkey_patch()

from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import time
import threading
import json
from datetime import datetime, timedelta
import socketio as sio_client

app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')

# ─────────────────────────────────────────────
#  IN-MEMORY DATA STORE
# ─────────────────────────────────────────────

import json
import os

THRESHOLDS_FILE = 'thresholds.json'

def load_thresholds():
    default = {"temperature": 30.0, "humidity": 65.0}
    if os.path.exists(THRESHOLDS_FILE):
        try:
            with open(THRESHOLDS_FILE, 'r') as f:
                return json.load(f)
        except:
            pass
    return default

def save_thresholds_to_file(t):
    try:
        with open(THRESHOLDS_FILE, 'w') as f:
            json.dump(t, f)
    except:
        pass

manual_mode = False  # Global Manual Override Flag
thresholds = load_thresholds()

sensor_data = {
    "temperature": 0.0,
    "humidity": 0.0,
    "fan_status": "OFF",
    "system_status": "SAFE",
    "ventilation": "CLOSED",
    "last_pulse": "Never",
    "soil_moisture": 0.0,
    "light_intensity": 0.0,
    "ph_level": 0.0,
    "wind_speed": 0.0,
    "rainfall": 0.0,
    "co2_level": 0.0,
    "pressure": 0.0,
    "uv_index": 0.0,
    "manual_mode": False
}

# ... (omitted sensor_data content)

# Record sensor history periodically and run automation
# Record sensor history periodically and run automation
def sensor_loop():
    while True:
        ts = datetime.now().isoformat()
        
        # Sync Manual Mode Status
        sensor_data["manual_mode"] = manual_mode
        
        # Automation Logic
        if not manual_mode:
            temp = sensor_data.get("temperature", 0)
            hum = sensor_data.get("humidity", 0)
            
            # Dynamic Thresholds
            max_temp = thresholds.get("temperature", 30.0)
            max_hum = thresholds.get("humidity", 65.0)
            
            # Default State (SAFE)
            new_mode = "SAFE"
            target_fan = "OFF"
            target_light = "OFF"
            target_vent = "CLOSED"
            
            # Logic: Temp > Max (Priority)
            if temp > max_temp:
                new_mode = "COOLING"
                target_fan = "ON"     # Fast Continuous Stepper
                target_vent = "OPEN"  # Servo 90
                target_light = "OFF"
            
            # Logic: Humidity > Max (Secondary)
            elif hum > max_hum:
                new_mode = "DRYING"
                target_fan = "OFF"
                target_vent = "CLOSED"# Servo 0
                target_light = "ON"   # LED ON
            
            # Apply Changes
            updated = False
            if control_state.get("fan") != target_fan:
                control_state["fan"] = target_fan; updated = True
            if control_state.get("light") != target_light:
                control_state["light"] = target_light; updated = True
            if control_state.get("ventilation") != target_vent:
                control_state["ventilation"] = target_vent; updated = True
            
            current_sys = sensor_data.get("system_status")
            if current_sys != new_mode:
                sensor_data["system_status"] = new_mode
                updated = True
            
            if updated:
                print(f"🤖 [AUTO] {new_mode}: Fan={target_fan}, Light={target_light}")
                socketio.emit('control_update', control_state)
                socketio.emit('sensor_update', sensor_data)
        
        # Sync sensor_data status for display
        sensor_data["fan_status"] = control_state.get("fan", "OFF")
        sensor_data["light_status"] = control_state.get("light", "OFF")
        sensor_data["ventilation"] = control_state.get("ventilation", "CLOSED")

        for key, val in sensor_data.items():
            if key not in sensor_history: continue
            sensor_history[key].append({"time": ts, "value": val})
            if len(sensor_history[key]) > 100:
                sensor_history[key] = sensor_history[key][-100:]
        time.sleep(5)

history_thread = threading.Thread(target=sensor_loop, daemon=True)
history_thread.start()

# ...

@socketio.on('set_manual_mode')
def handle_manual_mode(data):
    print(f"🔧 Manual Mode Toggled: {data}")
    global manual_mode
    manual_mode = data.get('enabled', False)
    # Broadcast to all clients specifically
    socketio.emit('manual_mode_update', manual_mode)

@app.route('/api/thresholds', methods=['GET', 'POST'])
def handle_thresholds():
    if request.method == 'POST':
        data = request.json
        thresholds["temperature"] = float(data.get("temperature", thresholds["temperature"]))
        thresholds["humidity"] = float(data.get("humidity", thresholds["humidity"]))
        save_thresholds_to_file(thresholds)
        socketio.emit('threshold_update', thresholds)
        return jsonify({"status": "success", "thresholds": thresholds})
    return jsonify(thresholds)


# Automation Thresholds
TEMP_THRESHOLD = 30.0
HUMIDITY_THRESHOLD = 70.0


sensor_history = {key: [] for key in sensor_data}

market_data = [
    {"name": "Basmati Rice", "price": 4540.00, "change": 4.2, "volume": "142k q", "trend": "bullish", "category": "grain"},
    {"name": "Red Wheat", "price": 2110.00, "change": -1.5, "volume": "89k q", "trend": "bearish", "category": "grain"},
    {"name": "Sona Masuri", "price": 3850.00, "change": 0.8, "volume": "56k q", "trend": "stable", "category": "grain"},
    {"name": "Black Gram", "price": 7200.00, "change": 12.4, "volume": "12k q", "trend": "bullish", "category": "pulse"},
    {"name": "Yellow Maize", "price": 1885.00, "change": -2.1, "volume": "204k q", "trend": "bearish", "category": "grain"},
    {"name": "Soybeans", "price": 3222.00, "change": 0.8, "volume": "67k q", "trend": "stable", "category": "oilseed"},
    {"name": "Pulses Mix", "price": 6535.00, "change": -2.1, "volume": "34k q", "trend": "bearish", "category": "pulse"},
]

buyer_stats = {
    "active_orders": 14,
    "reservations": 8,
    "completed": 102,
    "savings": 4200.00,
    "order_growth": 12.4,
}

seller_stats = {
    "available_balance": 24500.00,
    "pending_payments": 8200.00,
    "monthly_yield": 32700.00,
    "monthly_growth": 18.4,
    "silo_efficiency": 92.4,
    "node_sync": 94.0,
    "silo_utilization": 78.4,
}

organizer_stats = {
    "active_queue": 7,
    "gate_traffic": 5,
    "hub_security": 99.8,
    "flow_volume": 145000.00,
}

orders_data = [
    {
        "id": "ord-001",
        "pickup_code": "PIN-4829",
        "buyer_name": "Rajesh Kumar",
        "product_name": "Basmati Rice",
        "quantity": 50,
        "total_price": 227000.00,
        "product_id": "prd-a1b2",
        "status": "reserved",
        "created_at": (datetime.now() - timedelta(hours=2)).isoformat()
    },
    {
        "id": "ord-002",
        "pickup_code": "PIN-7351",
        "buyer_name": "Anita Sharma",
        "product_name": "Red Wheat",
        "quantity": 100,
        "total_price": 211000.00,
        "product_id": "prd-c3d4",
        "status": "reserved",
        "created_at": (datetime.now() - timedelta(hours=5)).isoformat()
    },
    {
        "id": "ord-003",
        "pickup_code": "PIN-9102",
        "buyer_name": "Mohammed Ali",
        "product_name": "Black Gram",
        "quantity": 20,
        "total_price": 144000.00,
        "product_id": "prd-e5f6",
        "status": "reserved",
        "created_at": (datetime.now() - timedelta(hours=8)).isoformat()
    },
    {
        "id": "ord-004",
        "pickup_code": "PIN-5540",
        "buyer_name": "Priya Nair",
        "product_name": "Sona Masuri",
        "quantity": 30,
        "total_price": 115500.00,
        "product_id": "prd-g7h8",
        "status": "reserved",
        "created_at": (datetime.now() - timedelta(hours=12)).isoformat()
    },
]

transactions_data = [
    {
        "id": "txn-001",
        "order_id": "ord-a1b2c3",
        "amount": 45000.00,
        "status": "cleared",
        "created_at": (datetime.now() - timedelta(days=1)).isoformat()
    },
    {
        "id": "txn-002",
        "order_id": "ord-d4e5f6",
        "amount": 18200.00,
        "status": "held",
        "created_at": (datetime.now() - timedelta(days=2)).isoformat()
    },
    {
        "id": "txn-003",
        "order_id": "ord-g7h8i9",
        "amount": 32000.00,
        "status": "cleared",
        "created_at": (datetime.now() - timedelta(days=3)).isoformat()
    },
    {
        "id": "txn-004",
        "order_id": "ord-j0k1l2",
        "amount": 12500.00,
        "status": "held",
        "created_at": (datetime.now() - timedelta(days=4)).isoformat()
    },
    {
        "id": "txn-005",
        "order_id": "ord-m3n4o5",
        "amount": 67800.00,
        "status": "cleared",
        "created_at": (datetime.now() - timedelta(days=5)).isoformat()
    },
]

monthly_chart_data = [40, 70, 45, 90, 65, 80, 55, 75, 50, 85, 60, 95]

cluster_health = [
    {"name": "North-WH Cluster", "value": 88, "color": "#059669"},
    {"name": "West-Silo Cluster", "value": 42, "color": "#f59e0b"},
    {"name": "South-Storage Grid", "value": 65, "color": "#059669"},
    {"name": "East-Node Hub", "value": 24, "color": "#ef4444"},
]

network_stats = {
    "supply_index": 84.2,
    "storage_utilization": 72.4,
    "escrow_liquidity": 420,
    "market_sentiment": "Bullish",
}

# Record sensor history periodically and run automation
def sensor_loop():
    while True:
        if old_fan != sensor_data["fan_status"]:
            socketio.emit('sensor_update', sensor_data)
        
        # Automation Logic: Maintain Temp & Humidity
        # ONLY RUN IF MANUAL MODE IS OFF
        if not manual_mode:
            current_fan = control_state.get("fan", "OFF")
            target_fan = "OFF"
            
            # Check Thresholds
            if sensor_data.get("temperature", 0) > TEMP_THRESHOLD or sensor_data.get("humidity", 0) > HUMIDITY_THRESHOLD:
                target_fan = "ON"
                
                # Also Auto-Open Vent for Safety
                if control_state.get("ventilation") != "OPEN":
                     control_state["ventilation"] = "OPEN"
                     socketio.emit('control_update', control_state)
            
            # Apply Fan Logic (State Change)
            if current_fan != target_fan:
                print(f"🤖 [AUTO] Toggling Fan {target_fan} (Temp: {sensor_data.get('temperature')} > {TEMP_THRESHOLD})")
                control_state["fan"] = target_fan
                socketio.emit('control_update', control_state)
            
        # Sync sensor_data status for display
        sensor_data["fan_status"] = control_state["fan"]
        sensor_data["manual_mode"] = manual_mode

        for key, val in sensor_data.items():
            sensor_history[key].append({"time": ts, "value": val})
            if len(sensor_history[key]) > 100:
                sensor_history[key] = sensor_history[key][-100:]
        time.sleep(5)

history_thread = threading.Thread(target=sensor_loop, daemon=True)
history_thread.start()

# ─────────────────────────────────────────────
#  KOYEB CLOUD RELAY CLIENT
# ─────────────────────────────────────────────
KOYEB_URL = "https://atomic-maryjo-cropstack-2280857f.koyeb.app"
sio = sio_client.Client()

@sio.on('connect')
def on_connect():
    print(f"✅ Connected to Koyeb Cloud Relay: {KOYEB_URL}")

@sio.on('sensor_data')
def on_sensor_data(data):
    print(f"📡 [CLOUD SYNC] Real-time data received: {data}")
    updated = False
    if "temperature" in data:
        sensor_data["temperature"] = float(data["temperature"])
        updated = True
    if "humidity" in data:
        sensor_data["humidity"] = float(data["humidity"])
        updated = True
    
    if "system_status" in data:
        sensor_data["system_status"] = data["system_status"]
        updated = True
    if "ventilation" in data:
        sensor_data["ventilation"] = data["ventilation"]
        updated = True
    
    if updated:
        sensor_data["last_pulse"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        socketio.emit('sensor_update', sensor_data)

def connect_to_koyeb():
    try:
        sio.connect(KOYEB_URL)
        sio.wait()
    except Exception as e:
        print(f"❌ Cloud Relay Error: {e}")

koyeb_thread = threading.Thread(target=connect_to_koyeb, daemon=True)
koyeb_thread.start()

# Control State (For Buttons)
control_state = {
    "fan": "OFF",
    "light": "OFF",
    "ventilation": "CLOSED"  # CLOSED or OPEN
}

# ─────────────────────────────────────────────
#  ROUTES
# ─────────────────────────────────────────────

@app.route('/')
def index():
    """Serve the simple HTML dashboard."""
    return render_template('dashboard.html')

@app.route('/api/control', methods=['POST'])
def update_control():
    """Handle Manual Button Clicks from Dashboard."""
    global control_state
    data = request.json
    
    if 'fan' in data: control_state['fan'] = data['fan']
    if 'light' in data: control_state['light'] = data['light']
    if 'ventilation' in data: control_state['ventilation'] = data['ventilation']
    
    # Broadcast new state to everyone (Dashboards)
    socketio.emit('control_update', control_state)
    return jsonify({"status": "updated", "state": control_state})

# ─────────────────────────────────────────────
#  SENSOR API ENDPOINTS
# ─────────────────────────────────────────────

@app.route('/api/sensor', methods=['POST'])
@app.route('/sensor', methods=['POST'])  # Support legacy code
def receive_sensor_data():
    """Receive data from ESP32 and reply with COMMANDS."""
    global sensor_data
    try:
        data = request.json
        if data:
            sensor_data.update(data)
            print(f"📡 [HARDWARE SYNC] Data: {data}")
        
        sensor_data["last_pulse"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Broadcast to Dashboard
        socketio.emit('sensor_update', sensor_data)
        
        # Reply to ESP32 with Control State (Buttons)
        return jsonify({
            "status": "success", 
            "commands": control_state
        }), 200
        
    except Exception as e:
        print(f"❌ Error in receive_sensor_data: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/esp32-config', methods=['GET'])
def get_esp32_config():
    """Helper to give the user the exact settings for their .ino file."""
    return jsonify({
        "serverName": "http://192.168.1.5:5000/api/sensor",
        "instructions": "Copy this serverName into your esp32_iot.ino file to enable real-time sensor streaming."
    })

@app.route('/api/sensors', methods=['GET'])
def get_sensors():
    """Get all current sensor readings."""
    return jsonify({
        "sensors": sensor_data,
        "timestamp": datetime.now().isoformat(),
        "status": "online"
    })

@app.route('/api/sensors', methods=['POST', 'PUT'])
def update_sensors():
    """Update one or more sensor values."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    updated = {}
    for key, value in data.items():
        if key in sensor_data:
            try:
                sensor_data[key] = float(value)
                updated[key] = sensor_data[key]
            except (ValueError, TypeError):
                pass
    
    return jsonify({
        "updated": updated,
        "sensors": sensor_data,
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/sensors/<sensor_name>', methods=['GET'])
def get_sensor(sensor_name):
    """Get a specific sensor reading."""
    if sensor_name not in sensor_data:
        return jsonify({"error": f"Sensor '{sensor_name}' not found"}), 404
    return jsonify({
        "name": sensor_name,
        "value": sensor_data[sensor_name],
        "history": sensor_history.get(sensor_name, [])[-20:],
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/sensors/<sensor_name>', methods=['PUT'])
def update_single_sensor(sensor_name):
    """Update a single sensor value."""
    if sensor_name not in sensor_data:
        return jsonify({"error": f"Sensor '{sensor_name}' not found"}), 404
    
    data = request.get_json()
    value = data.get('value')
    if value is None:
        return jsonify({"error": "No value provided"}), 400
    
    try:
        sensor_data[sensor_name] = float(value)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid value"}), 400
    
    return jsonify({
        "name": sensor_name,
        "value": sensor_data[sensor_name],
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/sensors/history', methods=['GET'])
def get_sensor_history():
    """Get sensor history for all or specific sensors."""
    sensor = request.args.get('sensor')
    limit = int(request.args.get('limit', 20))
    
    if sensor:
        return jsonify({
            "sensor": sensor,
            "history": sensor_history.get(sensor, [])[-limit:]
        })
    
    return jsonify({
        name: history[-limit:] for name, history in sensor_history.items()
    })


# ─────────────────────────────────────────────
#  MARKET DATA ENDPOINTS
# ─────────────────────────────────────────────

@app.route('/api/market', methods=['GET'])
def get_market():
    """Get market commodity data."""
    return jsonify({
        "commodities": market_data,
        "network_stats": network_stats,
        "cluster_health": cluster_health,
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/market', methods=['PUT'])
def update_market():
    """Update market data."""
    global market_data
    data = request.get_json()
    if 'commodities' in data:
        market_data = data['commodities']
    if 'network_stats' in data:
        network_stats.update(data['network_stats'])
    if 'cluster_health' in data:
        for i, item in enumerate(data['cluster_health']):
            if i < len(cluster_health):
                cluster_health[i].update(item)
    
    return jsonify({"message": "Market data updated", "timestamp": datetime.now().isoformat()})


# ─────────────────────────────────────────────
#  DASHBOARD STATS ENDPOINTS
# ─────────────────────────────────────────────

@app.route('/api/stats/buyer', methods=['GET'])
def get_buyer_stats():
    """Get buyer dashboard stats."""
    return jsonify({
        "stats": buyer_stats,
        "chart_data": monthly_chart_data,
        "market": market_data[:5],
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/stats/buyer', methods=['PUT'])
def update_buyer_stats():
    """Update buyer stats."""
    data = request.get_json()
    if data:
        for key, val in data.items():
            if key in buyer_stats:
                buyer_stats[key] = val
        if 'chart_data' in data:
            global monthly_chart_data
            monthly_chart_data = data['chart_data']
    return jsonify({"stats": buyer_stats, "timestamp": datetime.now().isoformat()})

@app.route('/api/stats/seller', methods=['GET'])
def get_seller_stats():
    """Get seller dashboard stats."""
    return jsonify({
        "stats": seller_stats,
        "transactions": transactions_data,
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/stats/seller', methods=['PUT'])
def update_seller_stats():
    """Update seller stats."""
    data = request.get_json()
    if data:
        for key, val in data.items():
            if key in seller_stats:
                seller_stats[key] = val
    return jsonify({"stats": seller_stats, "timestamp": datetime.now().isoformat()})

@app.route('/api/stats/organizer', methods=['GET'])
def get_organizer_stats():
    """Get organizer dashboard stats."""
    return jsonify({
        "stats": organizer_stats,
        "orders": orders_data,
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/stats/organizer', methods=['PUT'])
def update_organizer_stats():
    """Update organizer stats."""
    data = request.get_json()
    if data:
        for key, val in data.items():
            if key in organizer_stats:
                organizer_stats[key] = val
    return jsonify({"stats": organizer_stats, "timestamp": datetime.now().isoformat()})


# ─────────────────────────────────────────────
#  ORDERS & TRANSACTIONS
# ─────────────────────────────────────────────

@app.route('/api/orders', methods=['GET'])
def get_orders():
    """Get all orders."""
    return jsonify({"orders": orders_data, "timestamp": datetime.now().isoformat()})

@app.route('/api/orders', methods=['POST'])
def add_order():
    """Add a new order."""
    data = request.get_json()
    if data:
        data.setdefault('id', f'ord-{random.randint(1000,9999)}')
        data.setdefault('created_at', datetime.now().isoformat())
        data.setdefault('status', 'reserved')
        orders_data.append(data)
    return jsonify({"orders": orders_data, "timestamp": datetime.now().isoformat()})

@app.route('/api/orders/<order_id>/complete', methods=['POST'])
def complete_order(order_id):
    """Mark order as completed."""
    for order in orders_data:
        if order['id'] == order_id:
            order['status'] = 'completed'
            # Create a transaction
            transactions_data.insert(0, {
                "id": f"txn-{random.randint(1000,9999)}",
                "order_id": order_id,
                "amount": order['total_price'],
                "status": "held",
                "created_at": datetime.now().isoformat()
            })
            return jsonify({"message": "Order completed", "order": order})
    return jsonify({"error": "Order not found"}), 404

@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    """Get all transactions."""
    return jsonify({"transactions": transactions_data, "timestamp": datetime.now().isoformat()})


# ─────────────────────────────────────────────
#  ADMIN DASHBOARD
# ─────────────────────────────────────────────

@app.route('/')
def dashboard():
    """Serve the admin dashboard."""
    return render_template('dashboard.html')


# ─────────────────────────────────────────────
#  HEALTH CHECK
# ─────────────────────────────────────────────

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        "status": "online",
        "uptime": time.time(),
        "sensors_active": len(sensor_data),
        "timestamp": datetime.now().isoformat()
    })


@app.route('/api/thresholds', methods=['POST'])
def update_thresholds():
    global TEMP_THRESHOLD, HUMIDITY_THRESHOLD
    data = request.json
    if not data:
        return jsonify({"error": "No data"}), 400
    if "temp" in data:
        TEMP_THRESHOLD = float(data["temp"])
    if "humidity" in data:
        HUMIDITY_THRESHOLD = float(data["humidity"])
    return jsonify({"status": "success", "thresholds": {"temp": TEMP_THRESHOLD, "humidity": HUMIDITY_THRESHOLD}})

if __name__ == '__main__':
    print("\n" + "="*60)
    print("  🌾 CropStack Sensor API v1.0")
    print("  📡 Dashboard: http://localhost:5000")
    print("  🔌 API Base:  http://localhost:5000/api")
    print("="*60 + "\n")
    socketio.run(app, debug=True, port=5000, host='0.0.0.0')
