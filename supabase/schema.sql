-- Unified Marketplace Dashboard Schema

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT CHECK (role IN ('buyer', 'seller', 'manager', 'admin')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    price_per_unit NUMERIC NOT NULL,
    unit TEXT NOT NULL, -- e.g. kg, bag, ton
    quantity_available NUMERIC NOT NULL DEFAULT 0,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Orders/Pre-orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    quantity NUMERIC NOT NULL,
    total_price NUMERIC NOT NULL,
    status TEXT CHECK (status IN ('pending', 'reserved', 'confirmed', 'completed', 'cancelled', 'expired')) DEFAULT 'pending',
    reservation_expiry TIMESTAMPTZ,
    pickup_code TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Transactions/Escrow Table
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    amount NUMERIC NOT NULL,
    status TEXT CHECK (status IN ('held', 'released', 'refunded')) DEFAULT 'held',
    available_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies

-- Profiles: Users can view all profiles, but only update their own.
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Products: Everyone can view active products. Sellers can manage their own.
CREATE POLICY "Products are viewable by everyone." ON public.products
    FOR SELECT USING (is_active = true OR auth.uid() = seller_id);

CREATE POLICY "Sellers can insert their own products." ON public.products
    FOR INSERT WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update their own products." ON public.products
    FOR UPDATE USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can delete their own products." ON public.products
    FOR DELETE USING (auth.uid() = seller_id);

-- Orders: Buyers can see their own orders. Sellers can see orders for their products. Organizers can see all.
CREATE POLICY "Users can view their own orders or related products." ON public.orders
    FOR SELECT USING (
        auth.uid() = buyer_id OR 
        EXISTS (SELECT 1 FROM public.products WHERE id = product_id AND seller_id = auth.uid()) OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'organizer')
    );

CREATE POLICY "Buyers can insert their own orders." ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Buyers/Sellers/Organizers can update order status based on role logic." ON public.orders
    FOR UPDATE USING (
        auth.uid() = buyer_id OR 
        EXISTS (SELECT 1 FROM public.products WHERE id = product_id AND seller_id = auth.uid()) OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'organizer')
    );

-- Transactions: Sellers can see their own transactions. Organizers can see all.
CREATE POLICY "Users can view relevant transactions." ON public.transactions
    FOR SELECT USING (
        auth.uid() = seller_id OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'organizer')
    );

-- 6. Functions & Triggers

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'role');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Realtime replication
alter publication supabase_realtime add table products;
alter publication supabase_realtime add table orders;
