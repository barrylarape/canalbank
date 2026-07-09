# Canal Bank Database Schema

This document outlines the Supabase / PostgreSQL database structure for the Canal Bank application, including the core ledger and institutional governance layers.

## 1. `profiles`
Stores user profile information and institutional roles.
- `id`: UUID (Primary Key, references auth.users)
- `full_name`: Text (Legal name)
- `email`: Text (Verified email)
- `phone`: Text (Optional contact number)
- `avatar_url`: Text (Profile picture)
- `role`: Enum ('customer', 'admin', 'supervisor', 'executive')
- `kyc_status`: Enum ('pending', 'approved', 'rejected')
- `created_at`: Timestamp

## 2. `accounts`
Core ledger accounts for members.
- `id`: UUID (Primary Key)
- `user_id`: UUID (References profiles.id)
- `account_type`: Enum ('checking', 'savings', 'investment', 'credit')
- `account_name`: Text
- `account_number`: Text (Unique CH-IBAN format)
- `balance`: Decimal
- `available_balance`: Decimal
- `currency`: Text
- `status`: Enum ('active', 'frozen', 'closed')
- `interest_rate`: Decimal
- `created_at`: Timestamp

## 3. `transactions`
The central ledger of all financial events.
- `id`: UUID (Primary Key)
- `account_id`: UUID (References accounts.id)
- `user_id`: UUID (References profiles.id)
- `transaction_type`: Enum ('debit', 'credit')
- `category`: Text
- `description`: Text
- `amount`: Decimal
- `balance_after`: Decimal
- `reference`: Text
- `status`: Enum ('pending', 'completed', 'failed', 'reversed')
- `counterparty_name`: Text
- `created_at`: Timestamp
- `created_by_id`: UUID (Maker)
- `approved_by_id`: UUID (Checker)
- `approval_tier`: Enum ('standard', 'supervisor', 'dual', 'executive')

## 4. `cards`
Payment card management.
- `id`: UUID (Primary Key)
- `user_id`: UUID (References profiles.id)
- `account_id`: UUID (References accounts.id)
- `card_name`: Text
- `card_type`: Enum ('debit', 'credit', 'prepaid')
- `card_number_masked`: Text
- `expiry_month`: Integer
- `expiry_year`: Integer
- `status`: Enum ('active', 'frozen', 'blocked', 'expired')
- `daily_limit`: Decimal
- `online_purchases`: Boolean
- `international_purchases`: Boolean
- `created_at`: Timestamp

## 5. `loans`
Credit facility tracking.
- `id`: UUID (Primary Key)
- `user_id`: UUID (References profiles.id)
- `loan_type`: Enum ('mortgage', 'vehicle', 'personal', 'business', 'education')
- `loan_name`: Text
- `principal`: Decimal
- `balance`: Decimal
- `interest_rate`: Decimal
- `monthly_payment`: Decimal
- `next_payment_date`: Date
- `status`: Enum ('active', 'paid_off', 'defaulted')
- `created_at`: Timestamp

## 6. `investments`
Portfolio management assets.
- `id`: UUID (Primary Key)
- `user_id`: UUID (References profiles.id)
- `asset_symbol`: Text
- `asset_name`: Text
- `asset_type`: Enum ('stock', 'etf', 'mutual_fund', 'bond', 'crypto')
- `shares`: Decimal
- `purchase_price`: Decimal
- `current_price`: Decimal
- `current_value`: Decimal
- `gain_loss`: Decimal
- `created_at`: Timestamp

## 7. `site_settings`
Dynamic configuration for the application frontend and brand assets.
- `key`: Text (Primary Key, e.g., 'brand_assets')
- `value`: Jsonb (Stores asset URLs and configuration)
- `updated_at`: Timestamp

**Institutional Storage Note:**
A Supabase bucket named `site-assets` is required for hosting dynamic imagery and logos.