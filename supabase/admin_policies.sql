-- ============================================================
-- Canal Bank — Admin RLS Policies
-- Run this in the Supabase SQL Editor AFTER schema.sql
-- ============================================================

-- Helper function: returns true if the current authenticated user
-- has role = 'admin' in the profiles table.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================
-- PROFILES — admin can read/update all rows
-- ============================================================
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can insert profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (public.is_admin());

-- ============================================================
-- ACCOUNTS — admin can read/update all rows
-- ============================================================
CREATE POLICY "Admins can view all accounts"
  ON public.accounts FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update all accounts"
  ON public.accounts FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can insert accounts"
  ON public.accounts FOR INSERT
  WITH CHECK (public.is_admin());

-- ============================================================
-- TRANSACTIONS — admin can read/update all rows
-- ============================================================
CREATE POLICY "Admins can view all transactions"
  ON public.transactions FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update all transactions"
  ON public.transactions FOR UPDATE
  USING (public.is_admin());

-- ============================================================
-- CARDS — admin can read/update all rows
-- ============================================================
CREATE POLICY "Admins can view all cards"
  ON public.cards FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update all cards"
  ON public.cards FOR UPDATE
  USING (public.is_admin());

-- ============================================================
-- LOANS — admin can read/update all rows
-- ============================================================
CREATE POLICY "Admins can view all loans"
  ON public.loans FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update all loans"
  ON public.loans FOR UPDATE
  USING (public.is_admin());

-- ============================================================
-- INVESTMENTS — admin can read/update all rows
-- ============================================================
CREATE POLICY "Admins can view all investments"
  ON public.investments FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update all investments"
  ON public.investments FOR UPDATE
  USING (public.is_admin());
