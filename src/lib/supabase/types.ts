export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string | null;
          phone: string | null;
          avatar_url: string | null;
          role: "customer" | "admin" | "supervisor" | "executive";
          kyc_status: "pending" | "approved" | "rejected";
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: "customer" | "admin" | "supervisor" | "executive";
          kyc_status?: "pending" | "approved" | "rejected";
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          email?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: "customer" | "admin" | "supervisor" | "executive";
          kyc_status?: "pending" | "approved" | "rejected";
          created_at?: string;
        };
      };
      accounts: {
        Row: {
          id: string;
          user_id: string;
          account_type: "checking" | "savings" | "investment" | "credit";
          account_name: string;
          account_number: string;
          balance: number;
          available_balance: number;
          currency: string;
          status: "active" | "frozen" | "closed";
          interest_rate: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          account_type: "checking" | "savings" | "investment" | "credit";
          account_name: string;
          account_number: string;
          balance?: number;
          available_balance?: number;
          currency?: string;
          status?: "active" | "frozen" | "closed";
          interest_rate?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          account_type?: "checking" | "savings" | "investment" | "credit";
          account_name?: string;
          account_number?: string;
          balance?: number;
          available_balance?: number;
          currency?: string;
          status?: "active" | "frozen" | "closed";
          interest_rate?: number | null;
          created_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          account_id: string;
          user_id: string;
          transaction_type: "debit" | "credit";
          category: string;
          description: string;
          amount: number;
          balance_after: number;
          reference: string;
          status: "pending" | "completed" | "failed" | "reversed";
          counterparty_name: string | null;
          created_at: string;
          created_by_id: string | null;
          approved_by_id: string | null;
          approved_by_2_id: string | null;
          approval_tier: "standard" | "supervisor" | "dual" | "executive";
        };
        Insert: {
          id?: string;
          account_id: string;
          user_id: string;
          transaction_type: "debit" | "credit";
          category?: string;
          description: string;
          amount: number;
          balance_after: number;
          reference?: string;
          status?: "pending" | "completed" | "failed" | "reversed";
          counterparty_name?: string | null;
          created_at?: string;
          created_by_id?: string | null;
          approved_by_id?: string | null;
          approved_by_2_id?: string | null;
          approval_tier?: "standard" | "supervisor" | "dual" | "executive";
        };
        Update: {
          id?: string;
          account_id?: string;
          user_id?: string;
          transaction_type?: "debit" | "credit";
          category?: string;
          description?: string;
          amount?: number;
          balance_after?: number;
          reference?: string;
          status?: "pending" | "completed" | "failed" | "reversed";
          counterparty_name?: string | null;
          created_at?: string;
          created_by_id?: string | null;
          approved_by_id?: string | null;
          approved_by_2_id?: string | null;
          approval_tier?: "standard" | "supervisor" | "dual" | "executive";
        };
      };
      cards: {
        Row: {
          id: string;
          user_id: string;
          account_id: string;
          card_name: string;
          card_type: "debit" | "credit" | "prepaid";
          card_number_masked: string;
          expiry_month: number;
          expiry_year: number;
          status: "active" | "frozen" | "blocked" | "expired";
          daily_limit: number;
          online_purchases: boolean;
          international_purchases: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          account_id: string;
          card_name: string;
          card_type: "debit" | "credit" | "prepaid";
          card_number_masked: string;
          expiry_month: number;
          expiry_year: number;
          status?: "active" | "frozen" | "blocked" | "expired";
          daily_limit?: number;
          online_purchases?: boolean;
          international_purchases?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          account_id?: string;
          card_name?: string;
          card_type?: "debit" | "credit" | "prepaid";
          card_number_masked?: string;
          expiry_month?: number;
          expiry_year?: number;
          status?: "active" | "frozen" | "blocked" | "expired";
          daily_limit?: number;
          online_purchases?: boolean;
          international_purchases?: boolean;
          created_at?: string;
        };
      };
      loans: {
        Row: {
          id: string;
          user_id: string;
          loan_type: "mortgage" | "vehicle" | "personal" | "business" | "education";
          loan_name: string;
          principal: number;
          balance: number;
          interest_rate: number;
          monthly_payment: number;
          next_payment_date: string;
          status: "active" | "paid_off" | "defaulted";
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          loan_type: "mortgage" | "vehicle" | "personal" | "business" | "education";
          loan_name: string;
          principal: number;
          balance: number;
          interest_rate: number;
          monthly_payment: number;
          next_payment_date: string;
          status?: "active" | "paid_off" | "defaulted";
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          loan_type?: "mortgage" | "vehicle" | "personal" | "business" | "education";
          loan_name?: string;
          principal?: number;
          balance?: number;
          interest_rate?: number;
          monthly_payment?: number;
          next_payment_date?: string;
          status?: "active" | "paid_off" | "defaulted";
          created_at?: string;
        };
      };
      investments: {
        Row: {
          id: string;
          user_id: string;
          asset_symbol: string;
          asset_name: string;
          asset_type: "stock" | "etf" | "mutual_fund" | "bond" | "crypto";
          shares: number;
          purchase_price: number;
          current_price: number;
          current_value: number;
          gain_loss: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          asset_symbol: string;
          asset_name: string;
          asset_type: "stock" | "etf" | "mutual_fund" | "bond" | "crypto";
          shares: number;
          purchase_price: number;
          current_price: number;
          current_value: number;
          gain_loss: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          asset_symbol?: string;
          asset_name?: string;
          asset_type?: "stock" | "etf" | "mutual_fund" | "bond" | "crypto";
          shares?: number;
          purchase_price?: number;
          current_price?: number;
          current_value?: number;
          gain_loss?: number;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}