export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          auth_user_id: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          is_active: boolean
          role: string
          updated_at: string
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          is_active?: boolean
          role?: string
          updated_at?: string
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      check_in_photos: {
        Row: {
          check_in_id: string
          created_at: string | null
          id: string
          photo_type: string
          photo_url: string
        }
        Insert: {
          check_in_id: string
          created_at?: string | null
          id?: string
          photo_type: string
          photo_url: string
        }
        Update: {
          check_in_id?: string
          created_at?: string | null
          id?: string
          photo_type?: string
          photo_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "check_in_photos_check_in_id_fkey"
            columns: ["check_in_id"]
            isOneToOne: false
            referencedRelation: "check_ins"
            referencedColumns: ["id"]
          },
        ]
      }
      check_ins: {
        Row: {
          arms: number | null
          breakfast: string | null
          chest: number | null
          client_id: string
          created_at: string | null
          date: string
          dinner: string | null
          energy_score: number | null
          hips: number | null
          id: string
          lunch: string | null
          mood_score: number | null
          notes: string | null
          snacks: string | null
          thighs: number | null
          waist: number | null
          water_intake: number | null
          weight: number | null
        }
        Insert: {
          arms?: number | null
          breakfast?: string | null
          chest?: number | null
          client_id: string
          created_at?: string | null
          date: string
          dinner?: string | null
          energy_score?: number | null
          hips?: number | null
          id?: string
          lunch?: string | null
          mood_score?: number | null
          notes?: string | null
          snacks?: string | null
          thighs?: number | null
          waist?: number | null
          water_intake?: number | null
          weight?: number | null
        }
        Update: {
          arms?: number | null
          breakfast?: string | null
          chest?: number | null
          client_id?: string
          created_at?: string | null
          date?: string
          dinner?: string | null
          energy_score?: number | null
          hips?: number | null
          id?: string
          lunch?: string | null
          mood_score?: number | null
          notes?: string | null
          snacks?: string | null
          thighs?: number | null
          waist?: number | null
          water_intake?: number | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "check_ins_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          clinic_id: string
          coach_id: string | null
          created_at: string | null
          email: string
          id: string
          last_check_in: string | null
          name: string
          notes: string | null
          phone: string | null
          profile_image: string | null
          program_id: string | null
          start_date: string
          user_id: string | null
        }
        Insert: {
          clinic_id: string
          coach_id?: string | null
          created_at?: string | null
          email: string
          id?: string
          last_check_in?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          profile_image?: string | null
          program_id?: string | null
          start_date: string
          user_id?: string | null
        }
        Update: {
          clinic_id?: string
          coach_id?: string | null
          created_at?: string | null
          email?: string
          id?: string
          last_check_in?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          profile_image?: string | null
          program_id?: string | null
          start_date?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coaches"
            referencedColumns: ["id"]
          },
        ]
      }
      clinics: {
        Row: {
          billing_address: string | null
          billing_city: string | null
          billing_contact_name: string | null
          billing_email: string | null
          billing_phone: string | null
          billing_state: string | null
          billing_zip: string | null
          city: string | null
          created_at: string | null
          email: string | null
          id: string
          location: string | null
          logo: string | null
          name: string
          payment_method: string | null
          phone: string | null
          primary_color: string | null
          primary_contact: string | null
          secondary_color: string | null
          state: string | null
          status: string | null
          street_address: string | null
          subscription_status: string | null
          subscription_tier: string | null
          zip: string | null
        }
        Insert: {
          billing_address?: string | null
          billing_city?: string | null
          billing_contact_name?: string | null
          billing_email?: string | null
          billing_phone?: string | null
          billing_state?: string | null
          billing_zip?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          location?: string | null
          logo?: string | null
          name: string
          payment_method?: string | null
          phone?: string | null
          primary_color?: string | null
          primary_contact?: string | null
          secondary_color?: string | null
          state?: string | null
          status?: string | null
          street_address?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          zip?: string | null
        }
        Update: {
          billing_address?: string | null
          billing_city?: string | null
          billing_contact_name?: string | null
          billing_email?: string | null
          billing_phone?: string | null
          billing_state?: string | null
          billing_zip?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          location?: string | null
          logo?: string | null
          name?: string
          payment_method?: string | null
          phone?: string | null
          primary_color?: string | null
          primary_contact?: string | null
          secondary_color?: string | null
          state?: string | null
          status?: string | null
          street_address?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          zip?: string | null
        }
        Relationships: []
      }
      coaches: {
        Row: {
          clinic_id: string
          created_at: string | null
          email: string
          id: string
          name: string
          phone: string | null
          status: string
        }
        Insert: {
          clinic_id: string
          created_at?: string | null
          email: string
          id?: string
          name: string
          phone?: string | null
          status?: string
        }
        Update: {
          clinic_id?: string
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "coaches_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          clinic_id: string | null
          email: string | null
          full_name: string | null
          id: string
          role: string | null
        }
        Insert: {
          clinic_id?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          role?: string | null
        }
        Update: {
          clinic_id?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
        }
        Relationships: []
      }
      programs: {
        Row: {
          check_in_frequency: string
          clinic_id: string
          created_at: string | null
          description: string
          duration: number
          id: string
          name: string
          type: string
        }
        Insert: {
          check_in_frequency: string
          clinic_id: string
          created_at?: string | null
          description: string
          duration: number
          id?: string
          name: string
          type: string
        }
        Update: {
          check_in_frequency?: string
          clinic_id?: string
          created_at?: string | null
          description?: string
          duration?: number
          id?: string
          name?: string
          type?: string
        }
        Relationships: []
      }
      supplements: {
        Row: {
          created_at: string | null
          description: string
          dosage: string
          frequency: string
          id: string
          name: string
          program_id: string
          time_of_day: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          dosage: string
          frequency: string
          id?: string
          name: string
          program_id: string
          time_of_day?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          dosage?: string
          frequency?: string
          id?: string
          name?: string
          program_id?: string
          time_of_day?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplements_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_admin_user: {
        Args: {
          email: string
          password: string
          full_name: string
          role?: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
