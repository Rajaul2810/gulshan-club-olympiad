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
          fixture_image: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sport: string
          fixture_image: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sport?: string
          fixture_image?: string
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
          sport: string
          winner_id: string | null
          loser_id: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sport: string
          winner_id?: string | null
          loser_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sport?: string
          winner_id?: string | null
          loser_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          subject: string
          message: string
          status: 'unread' | 'read' | 'replied' | 'archived'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          subject: string
          message: string
          status?: 'unread' | 'read' | 'replied' | 'archived'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          subject?: string
          message?: string
          status?: 'unread' | 'read' | 'replied' | 'archived'
          created_at?: string
          updated_at?: string
        }
      }
      press: {
        Row: {
          id: string
          type: 'press_release' | 'news'
          title: string
          image: string | null
          content: string | null
          author_name: string | null
          source: string | null
          news_link: string | null
          publish_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: 'press_release' | 'news'
          title: string
          image?: string | null
          content?: string | null
          author_name?: string | null
          source?: string | null
          news_link?: string | null
          publish_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: 'press_release' | 'news'
          title?: string
          image?: string | null
          content?: string | null
          author_name?: string | null
          source?: string | null
          news_link?: string | null
          publish_date?: string
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

