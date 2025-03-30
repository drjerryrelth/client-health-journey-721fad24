
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
      clients: {
        Row: {
          id: string
          created_at: string
          user_id: string
          name: string
          email: string
          phone: string | null
          program_id: string | null
          start_date: string
          last_check_in: string | null
          notes: string | null
          profile_image: string | null
          clinic_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          name: string
          email: string
          phone?: string | null
          program_id?: string | null
          start_date: string
          last_check_in?: string | null
          notes?: string | null
          profile_image?: string | null
          clinic_id: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          name?: string
          email?: string
          phone?: string | null
          program_id?: string | null
          start_date?: string
          last_check_in?: string | null
          notes?: string | null
          profile_image?: string | null
          clinic_id?: string
        }
      }
      programs: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string
          duration: number
          type: string
          check_in_frequency: string
          clinic_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description: string
          duration: number
          type: string
          check_in_frequency: string
          clinic_id: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string
          duration?: number
          type?: string
          check_in_frequency?: string
          clinic_id?: string
        }
      }
      supplements: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string
          dosage: string
          frequency: string
          time_of_day: string | null
          program_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description: string
          dosage: string
          frequency: string
          time_of_day?: string | null
          program_id: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string
          dosage?: string
          frequency?: string
          time_of_day?: string | null
          program_id?: string
        }
      }
      check_ins: {
        Row: {
          id: string
          created_at: string
          client_id: string
          date: string
          weight: number | null
          waist: number | null
          hips: number | null
          chest: number | null
          thighs: number | null
          arms: number | null
          mood_score: number | null
          energy_score: number | null
          water_intake: number | null
          breakfast: string | null
          lunch: string | null
          dinner: string | null
          snacks: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          client_id: string
          date: string
          weight?: number | null
          waist?: number | null
          hips?: number | null
          chest?: number | null
          thighs?: number | null
          arms?: number | null
          mood_score?: number | null
          energy_score?: number | null
          water_intake?: number | null
          breakfast?: string | null
          lunch?: string | null
          dinner?: string | null
          snacks?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          client_id?: string
          date?: string
          weight?: number | null
          waist?: number | null
          hips?: number | null
          chest?: number | null
          thighs?: number | null
          arms?: number | null
          mood_score?: number | null
          energy_score?: number | null
          water_intake?: number | null
          breakfast?: string | null
          lunch?: string | null
          dinner?: string | null
          snacks?: string | null
          notes?: string | null
        }
      }
      check_in_photos: {
        Row: {
          id: string
          created_at: string
          check_in_id: string
          photo_url: string
          photo_type: string
        }
        Insert: {
          id?: string
          created_at?: string
          check_in_id: string
          photo_url: string
          photo_type: string
        }
        Update: {
          id?: string
          created_at?: string
          check_in_id?: string
          photo_url?: string
          photo_type?: string
        }
      }
      clinics: {
        Row: {
          id: string
          created_at: string
          name: string
          logo: string | null
          primary_color: string | null
          secondary_color: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          logo?: string | null
          primary_color?: string | null
          secondary_color?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          logo?: string | null
          primary_color?: string | null
          secondary_color?: string | null
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
