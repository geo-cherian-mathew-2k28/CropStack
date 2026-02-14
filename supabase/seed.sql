-- CropStack Seed Data

-- Note: In a real Supabase environment, you would first need users in auth.users.
-- This script assumes you have created 3 users (one for each role) and manually 
-- updated their roles in the profiles table, or let the trigger handle it.

-- Sample Products (assuming a seller_id exists)
-- Replace 'SELLER_UUID' with an actual user ID from your Supabase Project
/*
INSERT INTO public.products (seller_id, name, category, price_per_unit, unit, quantity_available, description, image_url)
VALUES 
('SELLER_UUID', 'Organic Red Onions', 'Vegetables', 0.50, 'kg', 500, 'Freshly harvested red onions from local highland farms. High quality, bulk quantity available.', 'https://images.unsplash.com/photo-1508747703725-7197771375a0?auto=format&fit=crop&q=80&w=800'),
('SELLER_UUID', 'Grade A Basmati Rice', 'Grains', 1.20, 'bag', 100, 'Extra-long grain Basmati rice. Aged for 12 months for superior aroma and taste.', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800'),
('SELLER_UUID', 'Yellow Sweet Corn', 'Vegetables', 0.25, 'kg', 1000, 'Non-GMO sweet corn. Harvested this morning. Perfect for markets and processing.', 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=800');
*/

-- Instructions for User:
-- 1. Run the schema.sql in your Supabase SQL Editor.
-- 2. Sign up via the app with at least one 'Buyer' and one 'Seller' account.
-- 3. To create an 'Organizer', sign up a user and manually run:
--    UPDATE public.profiles SET role = 'organizer' WHERE email = 'organizer@email.com';
