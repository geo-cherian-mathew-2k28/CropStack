import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// CROPSTACK INSTITUTIONAL CLIENT CONFIG
// Switched to localStorage for production-ready persistent sessions
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: 'buyer' | 'seller' | 'organizer';
  avatar_url: string | null;
  created_at: string;
};

export type Product = {
  id: string;
  seller_id: string;
  name: string;
  description: string | null;
  category: string;
  price_per_unit: number;
  unit: string;
  quantity_available: number;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
};

export type Order = {
  id: string;
  buyer_id: string;
  product_id: string;
  quantity: number;
  total_price: number;
  status: 'pending' | 'reserved' | 'confirmed' | 'completed' | 'cancelled' | 'expired';
  reservation_expiry: string | null;
  pickup_code: string | null;
  created_at: string;
};

export type Transaction = {
  id: string;
  order_id: string;
  seller_id: string;
  amount: number;
  status: 'held' | 'released' | 'refunded';
  available_at: string | null;
  created_at: string;
};
