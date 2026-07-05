-- ============================================================
-- Canal Bank Database Schema
-- Run this SQL in the Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES TABLE (extends auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  kyc_status TEXT NOT NULL DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- ACCOUNTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  account_type TEXT NOT NULL CHECK (account_type IN ('checking', 'savings', 'investment', 'credit')),
  account_name TEXT NOT NULL,
  account_number TEXT UNIQUE NOT NULL,
  balance DECIMAL(15,2) DEFAULT 0.00,
  available_balance DECIMAL(15,2) DEFAULT 0.00,
  currency TEXT DEFAULT 'CHF',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'frozen', 'closed')),
  interest_rate DECIMAL(5,4),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own accounts"
  ON public.accounts FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own accounts"
  ON public.accounts FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================
-- TRANSACTIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('debit', 'credit')),
  category TEXT DEFAULT 'general',
  description TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  balance_after DECIMAL(15,2) NOT NULL,
  reference TEXT DEFAULT uuid_generate_v4(),
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'reversed')),
  counterparty_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions"
  ON public.transactions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
  ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- CARDS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  card_name TEXT NOT NULL,
  card_type TEXT NOT NULL CHECK (card_type IN ('debit', 'credit', 'prepaid')),
  card_number_masked TEXT NOT NULL,
  expiry_month INTEGER NOT NULL,
  expiry_year INTEGER NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'frozen', 'blocked', 'expired')),
  daily_limit DECIMAL(10,2) DEFAULT 5000.00,
  online_purchases BOOLEAN DEFAULT TRUE,
  international_purchases BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own cards"
  ON public.cards FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own cards"
  ON public.cards FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================
-- LOANS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.loans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  loan_type TEXT NOT NULL CHECK (loan_type IN ('mortgage', 'vehicle', 'personal', 'business', 'education')),
  loan_name TEXT NOT NULL,
  principal DECIMAL(15,2) NOT NULL,
  balance DECIMAL(15,2) NOT NULL,
  interest_rate DECIMAL(5,4) NOT NULL,
  monthly_payment DECIMAL(10,2) NOT NULL,
  next_payment_date DATE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paid_off', 'defaulted')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own loans"
  ON public.loans FOR SELECT USING (auth.uid() = user_id);

-- ============================================================
-- INVESTMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.investments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  asset_symbol TEXT NOT NULL,
  asset_name TEXT NOT NULL,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('stock', 'etf', 'mutual_fund', 'bond', 'crypto')),
  shares DECIMAL(15,6) NOT NULL,
  purchase_price DECIMAL(15,2) NOT NULL,
  current_price DECIMAL(15,2) NOT NULL,
  current_value DECIMAL(15,2) NOT NULL,
  gain_loss DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own investments"
  ON public.investments FOR SELECT USING (auth.uid() = user_id);

-- ============================================================
-- DEMO SEED DATA FUNCTION
-- ============================================================
-- Call this function after a user registers to seed demo data:
-- SELECT seed_demo_data('YOUR_USER_UUID_HERE');

CREATE OR REPLACE FUNCTION public.seed_demo_data(p_user_id UUID)
RETURNS void AS $$
DECLARE
  v_checking_id UUID;
  v_savings_id UUID;
BEGIN
  -- Create Checking Account
  INSERT INTO public.accounts (user_id, account_type, account_name, account_number, balance, available_balance, currency, interest_rate)
  VALUES (p_user_id, 'checking', 'Canal Everyday Checking', 'CH93-0076-2011-' || floor(random()*9999+1000)::text, 18350.42, 17850.42, 'CHF', 0.0050)
  RETURNING id INTO v_checking_id;

  -- Create Savings Account
  INSERT INTO public.accounts (user_id, account_type, account_name, account_number, balance, available_balance, currency, interest_rate)
  VALUES (p_user_id, 'savings', 'High Yield Savings', 'CH93-0076-2011-' || floor(random()*9999+1000)::text, 92105.11, 92105.11, 'CHF', 0.0325)
  RETURNING id INTO v_savings_id;

  -- Create Investment Account
  INSERT INTO public.accounts (user_id, account_type, account_name, account_number, balance, available_balance, currency)
  VALUES (p_user_id, 'investment', 'Investment Portfolio', 'CH93-0076-2011-' || floor(random()*9999+1000)::text, 305842.00, 305842.00, 'CHF');

  -- Create Credit Account
  INSERT INTO public.accounts (user_id, account_type, account_name, account_number, balance, available_balance, currency, interest_rate)
  VALUES (p_user_id, 'credit', 'Canal Platinum Card', 'CH93-0076-2011-' || floor(random()*9999+1000)::text, -1140.00, 23860.00, 'CHF', 0.1499);

  -- Seed Transactions for Checking Account
  INSERT INTO public.transactions (account_id, user_id, transaction_type, category, description, amount, balance_after, counterparty_name, created_at)
  VALUES
    (v_checking_id, p_user_id, 'credit', 'income', 'Monthly Salary', 4250.00, 18350.42, 'Acme Corp AG', NOW() - INTERVAL '2 days'),
    (v_checking_id, p_user_id, 'debit', 'shopping', 'Amazon.com Purchase', 120.00, 14100.42, 'Amazon', NOW() - INTERVAL '3 days'),
    (v_checking_id, p_user_id, 'debit', 'utilities', 'Electricity Bill', 95.00, 14220.42, 'Swiss Power AG', NOW() - INTERVAL '5 days'),
    (v_checking_id, p_user_id, 'credit', 'transfer', 'ATM Deposit', 600.00, 14315.42, NULL, NOW() - INTERVAL '6 days'),
    (v_checking_id, p_user_id, 'debit', 'food', 'Coop Supermarket', 68.30, 13715.42, 'Coop', NOW() - INTERVAL '7 days'),
    (v_checking_id, p_user_id, 'debit', 'transport', 'SBB Monthly Pass', 84.00, 13647.12, 'SBB CFF FFS', NOW() - INTERVAL '8 days'),
    (v_checking_id, p_user_id, 'debit', 'health', 'Apotheke Zurich', 42.50, 13563.12, 'Apotheke Zurich', NOW() - INTERVAL '9 days'),
    (v_checking_id, p_user_id, 'credit', 'income', 'Freelance Payment', 1500.00, 13605.62, 'Design Studio GmbH', NOW() - INTERVAL '10 days'),
    (v_checking_id, p_user_id, 'debit', 'entertainment', 'Netflix Subscription', 17.90, 12105.62, 'Netflix', NOW() - INTERVAL '12 days'),
    (v_checking_id, p_user_id, 'debit', 'food', 'Restaurant Les Alpes', 89.40, 12087.72, 'Les Alpes Restaurant', NOW() - INTERVAL '14 days');

  -- Seed a Debit Card
  INSERT INTO public.cards (user_id, account_id, card_name, card_type, card_number_masked, expiry_month, expiry_year)
  VALUES (p_user_id, v_checking_id, 'Canal Platinum Debit', 'debit', '**** **** **** 4092', 12, 2028);

  -- Seed a Credit Card
  INSERT INTO public.cards (user_id, account_id, card_name, card_type, card_number_masked, expiry_month, expiry_year)
  VALUES (p_user_id, v_savings_id, 'Canal Platinum Credit', 'credit', '**** **** **** 7731', 8, 2027);

  -- Seed Loans
  INSERT INTO public.loans (user_id, loan_type, loan_name, principal, balance, interest_rate, monthly_payment, next_payment_date)
  VALUES
    (p_user_id, 'mortgage', 'Home Mortgage — Zürich', 750000.00, 612450.00, 0.0185, 2840.00, (NOW() + INTERVAL '12 days')::date),
    (p_user_id, 'vehicle', 'Tesla Model 3 Loan', 45000.00, 28600.00, 0.0395, 480.00, (NOW() + INTERVAL '5 days')::date);

  -- Seed Investments
  INSERT INTO public.investments (user_id, asset_symbol, asset_name, asset_type, shares, purchase_price, current_price, current_value, gain_loss)
  VALUES
    (p_user_id, 'MSCI', 'MSCI World ETF', 'etf', 48.5, 4200.00, 5100.00, 247350.00, 43650.00),
    (p_user_id, 'NESN', 'Nestlé S.A.', 'stock', 120.0, 95.00, 108.50, 13020.00, 1620.00),
    (p_user_id, 'NOVN', 'Novartis AG', 'stock', 80.0, 78.00, 91.20, 7296.00, 1056.00),
    (p_user_id, 'ROG', 'Roche Holding AG', 'stock', 35.0, 240.00, 268.00, 9380.00, 980.00),
    (p_user_id, 'UBS', 'UBS Group AG', 'stock', 200.0, 14.50, 19.48, 3896.00, 996.00);

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
