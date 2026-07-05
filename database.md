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

**RLS Policies:**
- `Select`: Authenticated users can read their own profile.
- `Select/Update/Insert`: Roles 'admin', 'supervisor', and 'executive' can manage all profiles.

## 2. `accounts`
Core ledger accounts for members.
- `id`: UUID (Primary Key)
- `user_id`: UUID (References profiles.id)
- `account_type`: Enum ('checking', 'savings', 'investment', 'credit')
- `account_name`: Text (e.g., "Everyday Checking")
- `account_number`: Text (Unique CH-IBAN format: `CHxx BBBB BCCC CCCC C`)
- `balance`: Decimal (Total posted balance)
- `available_balance`: Decimal (Balance minus holds)
- `currency`: Text (ISO Code, default 'CHF')
- `status`: Enum ('active', 'frozen', 'closed')
- `interest_rate`: Decimal (Applicable to savings/loans)
- `created_at`: Timestamp

**RLS Policies:**
- `Select`: Users can view accounts where `user_id = auth.uid()`.
- `All`: Service Role / Admins can manage balances. Users cannot modify balances via client SDK.

## 3. `transactions`
The central ledger of all financial events.
- `id`: UUID (Primary Key)
- `account_id`: UUID (References accounts.id)
- `user_id`: UUID (References profiles.id)
- `transaction_type`: Enum ('debit', 'credit')
- `category`: Text (e.g., 'transfer', 'income', 'adjustment_request')
- `description`: Text (Narration for audit logs)
- `amount`: Decimal (Transaction value)
- `balance_after`: Decimal (Snapshot of account balance after posting)
- `reference`: Text (Unique tracking code)
- `status`: Enum ('pending', 'completed', 'failed', 'reversed')
- `counterparty_name`: Text (External name or initiator)
- `created_at`: Timestamp
- `created_by_id`: UUID (Maker ID - Admin who initiated)
- `approved_by_id`: UUID (Checker 1 ID)
- `approved_by_2_id`: UUID (Checker 2 ID for dual auth)
- `approval_tier`: Enum ('standard', 'supervisor', 'dual', 'executive')

**RLS Policies:**
- `Select`: Users can read transactions where `user_id = auth.uid()`.
- `Maker-Checker`: Insert/Update restricted to administrative roles via Secure API (Service Role).

## 4. `cards`
Payment card management.
- `id`: UUID (Primary Key)
- `user_id`: UUID (References profiles.id)
- `account_id`: UUID (References accounts.id)
- `card_name`: Text
- `card_type`: Enum ('debit', 'credit', 'prepaid')
- `card_number_masked`: Text (e.g., "**** **** **** 1234")
- `expiry_month`: Integer
- `expiry_year`: Integer
- `status`: Enum ('active', 'frozen', 'blocked', 'expired')
- `daily_limit`: Decimal
- `online_purchases`: Boolean
- `international_purchases`: Boolean
- `created_at`: Timestamp

**RLS Policies:**
- `Select/Update`: Users can manage their own cards.

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

**RLS Policies:**
- `Select`: Users can view their own loans.

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

**RLS Policies:**
- `Select`: Users can view their own investment portfolio.

## Institutional Row Level Security (RLS) Summary
Canal Bank enforces a "Banker-to-Client" isolation model. Clients have read-only access to their financial state (Accounts, Transactions, Loans). All state changes (Balance updates, KYC status) must be performed by an authorized administrator through validated API routes that enforce the Maker-Checker protocol.
