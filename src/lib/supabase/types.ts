export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          account_name: string
          account_number: string
          account_type: Database["public"]["Enums"]["account_type_enum"]
          available_balance: number
          balance: number
          created_at: string
          currency: string
          id: string
          interest_rate: number | null
          status: Database["public"]["Enums"]["account_status_enum"]
          user_id: string
        }
        Insert: {
          account_name: string
          account_number: string
          account_type: Database["public"]["Enums"]["account_type_enum"]
          available_balance?: number
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          interest_rate?: number | null
          status?: Database["public"]["Enums"]["account_status_enum"]
          user_id: string
        }
        Update: {
          account_name?: string
          account_number?: string
          account_type?: Database["public"]["Enums"]["account_type_enum"]
          available_balance?: number
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          interest_rate?: number | null
          status?: Database["public"]["Enums"]["account_status_enum"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cards: {
        Row: {
          account_id: string
          card_name: string
          card_number_masked: string
          card_type: string
          created_at: string | null
          daily_limit: number | null
          expiry_month: number
          expiry_year: number
          id: string
          international_purchases: boolean | null
          online_purchases: boolean | null
          status: string | null
          user_id: string
        }
        Insert: {
          account_id: string
          card_name: string
          card_number_masked: string
          card_type: string
          created_at?: string | null
          daily_limit?: number | null
          expiry_month: number
          expiry_year: number
          id?: string
          international_purchases?: boolean | null
          online_purchases?: boolean | null
          status?: string | null
          user_id: string
        }
        Update: {
          account_id?: string
          card_name?: string
          card_number_masked?: string
          card_type?: string
          created_at?: string | null
          daily_limit?: number | null
          expiry_month?: number
          expiry_year?: number
          id?: string
          international_purchases?: boolean | null
          online_purchases?: boolean | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      investments: {
        Row: {
          asset_name: string
          asset_symbol: string
          asset_type: string
          created_at: string | null
          current_price: number
          current_value: number
          gain_loss: number | null
          id: string
          purchase_price: number
          shares: number
          user_id: string
        }
        Insert: {
          asset_name: string
          asset_symbol: string
          asset_type: string
          created_at?: string | null
          current_price: number
          current_value: number
          gain_loss?: number | null
          id?: string
          purchase_price: number
          shares: number
          user_id: string
        }
        Update: {
          asset_name?: string
          asset_symbol?: string
          asset_type?: string
          created_at?: string | null
          current_price?: number
          current_value?: number
          gain_loss?: number | null
          id?: string
          purchase_price?: number
          shares?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "investments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      loans: {
        Row: {
          balance: number
          created_at: string | null
          id: string
          interest_rate: number
          loan_name: string
          loan_type: string
          monthly_payment: number
          next_payment_date: string
          principal: number
          status: string | null
          user_id: string
        }
        Insert: {
          balance: number
          created_at?: string | null
          id?: string
          interest_rate: number
          loan_name: string
          loan_type: string
          monthly_payment: number
          next_payment_date: string
          principal: number
          status?: string | null
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string | null
          id?: string
          interest_rate?: number
          loan_name?: string
          loan_type?: string
          monthly_payment?: number
          next_payment_date?: string
          principal?: number
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          kyc_status: string
          phone: string | null
          role: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          kyc_status?: string
          phone?: string | null
          role?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          kyc_status?: string
          phone?: string | null
          role?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          account_id: string
          amount: number
          approval_tier: Database["public"]["Enums"]["approval_tier_enum"]
          approved_by_2_id: string | null
          approved_by_id: string | null
          balance_after: number | null
          category: string
          counterparty_name: string | null
          created_at: string
          created_by_id: string | null
          description: string | null
          id: string
          reference: string
          status: Database["public"]["Enums"]["transaction_status_enum"]
          transaction_type: Database["public"]["Enums"]["transaction_type_enum"]
          user_id: string
        }
        Insert: {
          account_id: string
          amount: number
          approval_tier?: Database["public"]["Enums"]["approval_tier_enum"]
          approved_by_2_id?: string | null
          approved_by_id?: string | null
          balance_after?: number | null
          category: string
          counterparty_name?: string | null
          created_at?: string
          created_by_id?: string | null
          description?: string | null
          id?: string
          reference: string
          status?: Database["public"]["Enums"]["transaction_status_enum"]
          transaction_type: Database["public"]["Enums"]["transaction_type_enum"]
          user_id: string
        }
        Update: {
          account_id?: string
          amount?: number
          approval_tier?: Database["public"]["Enums"]["approval_tier_enum"]
          approved_by_2_id?: string | null
          approved_by_id?: string | null
          balance_after?: number | null
          category?: string
          counterparty_name?: string | null
          created_at?: string
          created_by_id?: string | null
          description?: string | null
          id?: string
          reference?: string
          status?: Database["public"]["Enums"]["transaction_status_enum"]
          transaction_type?: Database["public"]["Enums"]["transaction_type_enum"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_approved_by_2_id_fkey"
            columns: ["approved_by_2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_approved_by_id_fkey"
            columns: ["approved_by_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_created_by_id_fkey"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
      seed_demo_data: { Args: { p_user_id: string }; Returns: undefined }
    }
    Enums: {
      account_status_enum: "active" | "frozen" | "closed"
      account_type_enum: "checking" | "savings" | "investment" | "credit"
      approval_tier_enum: "standard" | "supervisor" | "dual" | "executive"
      transaction_status_enum: "pending" | "completed" | "failed" | "reversed"
      transaction_type_enum: "debit" | "credit"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      account_status_enum: ["active", "frozen", "closed"],
      account_type_enum: ["checking", "savings", "investment", "credit"],
      approval_tier_enum: ["standard", "supervisor", "dual", "executive"],
      transaction_status_enum: ["pending", "completed", "failed", "reversed"],
      transaction_type_enum: ["debit", "credit"],
    },
  },
} as const
