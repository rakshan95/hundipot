import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      expenses: {
        Row: {
          id: string;
          date: string;
          type: string;
          name: string;
          amount: number;
          gst_applicable: boolean;
          gst_amount: number;
          is_recurring: boolean;
          due_date: string | null;
          is_paid: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          type: string;
          name: string;
          amount: number;
          gst_applicable?: boolean;
          gst_amount?: number;
          is_recurring?: boolean;
          due_date?: string | null;
          is_paid?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          type?: string;
          name?: string;
          amount?: number;
          gst_applicable?: boolean;
          gst_amount?: number;
          is_recurring?: boolean;
          due_date?: string | null;
          is_paid?: boolean;
          updated_at?: string;
        };
      };
      funding: {
        Row: {
          id: string;
          received_date: string;
          funder_name: string;
          amount: number;
          is_repayable: boolean;
          repayment_date: string | null;
          is_paid: boolean;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          received_date: string;
          funder_name: string;
          amount: number;
          is_repayable?: boolean;
          repayment_date?: string | null;
          is_paid?: boolean;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          received_date?: string;
          funder_name?: string;
          amount?: number;
          is_repayable?: boolean;
          repayment_date?: string | null;
          is_paid?: boolean;
          description?: string | null;
          updated_at?: string;
        };
      };
      expense_attachments: {
        Row: {
          id: string;
          expense_id: string;
          file_name: string;
          file_size: number;
          file_type: string;
          file_url: string;
          uploaded_at: string;
        };
        Insert: {
          id?: string;
          expense_id: string;
          file_name: string;
          file_size: number;
          file_type: string;
          file_url: string;
          uploaded_at?: string;
        };
        Update: {
          id?: string;
          expense_id?: string;
          file_name?: string;
          file_size?: number;
          file_type?: string;
          file_url?: string;
        };
      };
      funding_attachments: {
        Row: {
          id: string;
          funding_id: string;
          file_name: string;
          file_size: number;
          file_type: string;
          file_url: string;
          uploaded_at: string;
        };
        Insert: {
          id?: string;
          funding_id: string;
          file_name: string;
          file_size: number;
          file_type: string;
          file_url: string;
          uploaded_at?: string;
        };
        Update: {
          id?: string;
          funding_id?: string;
          file_name?: string;
          file_size?: number;
          file_type?: string;
          file_url?: string;
        };
      };
    };
  };
}