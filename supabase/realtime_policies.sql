-- ============================================================
-- Canal Bank — Realtime Configuration
-- Run this in the Supabase SQL Editor
-- ============================================================

-- First, check if publication exists, or recreate it to enable realtime
-- on our tables.
-- Safe script to set up realtime publication:

-- Drop if exists (will recreate)
DROP PUBLICATION IF EXISTS supabase_realtime;

-- Create publication for all target tables
CREATE PUBLICATION supabase_realtime FOR TABLE 
  public.profiles, 
  public.accounts, 
  public.transactions, 
  public.cards, 
  public.loans, 
  public.investments;
