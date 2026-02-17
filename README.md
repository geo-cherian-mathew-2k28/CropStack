# 🌾 CropStack - IoT Integrated Agricultural Marketplace

CropStack is a professional-grade, IoT-integrated marketplace for crop storage and real-time environment monitoring. Built for the **IEDC Hackathon**, it features a real-time dashboard that syncs with physical hardware to ensure crop safety during storage.

## 🌟 Hackathon Highlight: IoT Ecosystem
This project features a complete **Hardware-to-Cloud-to-Web** pipeline:
- **Hardware**: ESP32 + DHT11 + Servo Motor + LED.
- **Real-Time Monitoring**: Temperature and Humidity tracking with **WebSocket (Socket.IO)** updates (no refreshing needed).
- **Automated Control**: If humidity crosses the threshold, the system automatically triggers a **Servo-controlled ventilation** and a **Red LED alert**.
- **Cloud Sync**: Data is streamed via Kafka/Cloud Relay to a live web dashboard.

## 🚀 Quick Start

### 1. Setup Web App
```bash
git clone https://github.com/geo-cherian-mathew-2k28/CropStack.git
npm install
npm run dev
```

### 2. Setup IoT API (Backend)
```bash
cd api
pip install flask flask-cors flask-socketio eventlet python-socketio[client]
python app.py
```
View the IoT Hub at [http://localhost:5000](http://localhost:5000)

### 3. Setup ESP32
1. Open `IEDC Hack/esp32_professional_v2/esp32_professional_v2.ino` in Arduino IDE.
2. Install `ESP32Servo`, `DHT sensor library`, and `ArduinoJson`.
3. Flash the code to your ESP32.

---

## 🏗️ Roles & Features
- **Organizers (IoT Hub)**: Full control over sensor thresholds and warehouse safety.
- **Sellers**: List crops and monitor storage health in their personal dashboard.
- **Buyers**: Purchase crops with confidence knowing storage conditions are verified.

## 🛠️ Tech Stack
- **Frontend**: Next.js 15, Framer Motion, Lucide Icons.
- **Backend**: Flask + Socket.IO (IoT Streamer).
- **Database**: Supabase (PostgreSQL).
- **Hardware**: ESP32, DHT11, SG90 Servo.

---

## 👨‍💻 Developer
**Geo Cherian Mathew**
IEDC Hackathon 2024

## 🚀 Quick Start (Setup for New Devices)

Follow these steps to clone and run this project on a different machine using your own Supabase project.

### 1. Clone the Repository
```bash
git clone https://github.com/geo-cherian-mathew-2k28/CropStack.git
cd CropStack
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Supabase Database Setup
1.  Go to [Supabase](https://supabase.com/) and create a new project.
2.  In your Supabase Dashboard, navigate to the **SQL Editor**.
3.  **Run Schema**: Copy the contents of `supabase/schema.sql` and run it in the editor. This will create:
    *   `profiles`, `products`, `orders`, and `transactions` tables.
    *   Authentication triggers for automatic profile creation.
    *   Row Level Security (RLS) policies.
4.  **Run Repair (Recommended)**: Copy the contents of `supabase/repair.sql` and run it. This ensures the authentication triggers are "fail-proof" and handles metadata correctly.

### 4. Environment Variables
1.  Create a `.env.local` file in the root directory:
    ```bash
    cp .env.example .env.local
    ```
2.  Go to **Project Settings > API** in your Supabase dashboard.
3.  Copy your **Project URL** and **anon public** key into `.env.local`:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
    ```

### 5. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 🏗️ Architecture & Roles

*   **Sellers**: List crop lots, manage inventory, and track sales.
*   **Buyers**: Browse the catalog, purchase/reserve crops, and manage orders.
*   **Organizers**: Oversee the marketplace, manage nodes, and verify transactions.

### Setting the Organizer Role
By default, new signups are 'buyer'. To make a user an **Organizer**:
1.  Sign up via the application.
2.  Go to the Supabase **Table Editor** > `profiles`.
3.  Change the `role` column to `organizer` for that user.

## 🛠️ Tech Stack
*   **Framework**: Next.js 15 (App Router)
*   **Database**: Supabase (PostgreSQL)
*   **Styling**: Vanilla CSS (Modern Design System)
*   **Icons**: Lucide React
*   **Animations**: Framer Motion

---

## 📄 License
This project is private and for demonstration purposes. Developed by Geo Cherian Mathew.

