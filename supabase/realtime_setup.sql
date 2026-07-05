-- ============================================================
-- Canal Bank — Realtime Setup
-- Run this in the Supabase SQL Editor AFTER schema.sql
-- ============================================================

-- Enable Realtime for core tables
-- Supabase uses logical replication to broadcast changes.
-- We must explicitly add the tables to the supabase_realtime publication.

BEGIN;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.accounts;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.cards;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.loans;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.investments;
COMMIT;
