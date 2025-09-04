import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          currency: string
          locale: string
          timezone: string
          theme: 'light' | 'dark'
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          currency?: string
          locale?: string
          timezone?: string
          theme?: 'light' | 'dark'
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          currency?: string
          locale?: string
          timezone?: string
          theme?: 'light' | 'dark'
        }
      }
      categories: {
        Row: {
          id: string
          user_id: string
          name: string
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          color: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          color?: string
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          description: string
          category_id: string
          subcategory: string | null
          payment_method: string
          tags: string[]
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          description: string
          category_id: string
          subcategory?: string | null
          payment_method: string
          tags?: string[]
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          description?: string
          category_id?: string
          subcategory?: string | null
          payment_method?: string
          tags?: string[]
          date?: string
          created_at?: string
        }
      }
      budgets: {
        Row: {
          id: string
          user_id: string
          category_id: string
          amount: number
          month: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category_id: string
          amount: number
          month: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category_id?: string
          amount?: number
          month?: string
          created_at?: string
        }
      }
    }
  }
}