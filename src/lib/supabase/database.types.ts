export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clubs: {
        Row: {
          id: string
          name: string
          logo: string
          slug: string
          contact_person: string | null
          email: string | null
          phone: string | null
          address: string | null
          status: 'active' | 'pending' | 'inactive'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          logo: string
          slug: string
          contact_person?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          status?: 'active' | 'pending' | 'inactive'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          logo?: string
          slug?: string
          contact_person?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          status?: 'active' | 'pending' | 'inactive'
          created_at?: string
          updated_at?: string
        }
      }
      fixtures: {
        Row: {
          id: string
          sport: string
          team1_id: string
          team2_id: string
          date: string
          time: string
          venue: string
          status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sport: string
          team1_id: string
          team2_id: string
          date: string
          time: string
          venue: string
          status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sport?: string
          team1_id?: string
          team2_id?: string
          date?: string
          time?: string
          venue?: string
          status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      media: {
        Row: {
          id: string
          title: string
          type: 'photo' | 'video'
          sport: string
          url: string
          youtube_url: string | null
          description: string | null
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          type: 'photo' | 'video'
          sport: string
          url: string
          youtube_url?: string | null
          description?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          type?: 'photo' | 'video'
          sport?: string
          url?: string
          youtube_url?: string | null
          description?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      results: {
        Row: {
          id: string
          fixture_id: string
          team1_score: number
          team2_score: number
          winner_id: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          fixture_id: string
          team1_score: number
          team2_score: number
          winner_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          fixture_id?: string
          team1_score?: number
          team2_score?: number
          winner_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

