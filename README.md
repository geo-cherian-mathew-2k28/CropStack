# 🌾 CropStack - Enterprise Crop Storage Exchange

CropStack is a modern, decentralized marketplace for crop storage and exchange, built with **Next.js 15**, **Supabase**, and **Framer Motion**. It connects Buyers, Sellers, and Organizers in a seamless agricultural ecosystem.

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

