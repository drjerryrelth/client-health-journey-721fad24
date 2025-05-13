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
          clinic_id: string | null
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
          clinic_id?: string | null
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
          clinic_id?: string | null
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
          {
            foreignKeyName: "check_ins_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      client_drip_messages: {
        Row: {
          client_id: string
          day_number: number
          drip_template_id: string
          id: string
          is_read: boolean
          sent_at: string
        }
        Insert: {
          client_id: string
          day_number: number
          drip_template_id: string
          id?: string
          is_read?: boolean
          sent_at?: string
        }
        Update: {
          client_id?: string
          day_number?: number
          drip_template_id?: string
          id?: string
          is_read?: boolean
          sent_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_drip_messages_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_drip_messages_drip_template_id_fkey"
            columns: ["drip_template_id"]
            isOneToOne: false
            referencedRelation: "drip_content_templates"
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
          goals: string[] | null
          id: string
          initial_weight: number | null
          last_check_in: string | null
          name: string
          notes: string | null
          phone: string | null
          profile_image: string | null
          program_id: string | null
          start_date: string
          user_id: string | null
          weight_date: string | null
        }
        Insert: {
          clinic_id: string
          coach_id?: string | null
          created_at?: string | null
          email: string
          goals?: string[] | null
          id?: string
          initial_weight?: number | null
          last_check_in?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          profile_image?: string | null
          program_id?: string | null
          start_date: string
          user_id?: string | null
          weight_date?: string | null
        }
        Update: {
          clinic_id?: string
          coach_id?: string | null
          created_at?: string | null
          email?: string
          goals?: string[] | null
          id?: string
          initial_weight?: number | null
          last_check_in?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          profile_image?: string | null
          program_id?: string | null
          start_date?: string
          user_id?: string | null
          weight_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coaches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
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
      drip_content_templates: {
        Row: {
          content: string
          created_at: string
          day_number: number
          id: string
          program_type: string
          subject: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          day_number: number
          id?: string
          program_type: string
          subject: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          day_number?: number
          id?: string
          program_type?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_receiver_id_fkey1"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey1"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
          phone: string | null
          role: string | null
        }
        Insert: {
          clinic_id?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          role?: string | null
        }
        Update: {
          clinic_id?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
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
      add_coach: {
        Args: {
          coach_name: string
          coach_email: string
          coach_phone: string
          coach_status: string
          coach_clinic_id: string
        }
        Returns: Json
      }
      admin_add_clinic: {
        Args: { clinic_data: Json }
        Returns: Json
      }
      admin_get_all_coaches: {
        Args: Record<PropertyKey, never>
        Returns: Json[]
      }
      create_admin_user: {
        Args: {
          email: string
          password: string
          full_name: string
          role?: string
        }
        Returns: string
      }
      get_client_program_day: {
        Args: { client_id_param: string }
        Returns: number
      }
      get_clinic_coaches: {
        Args: { clinic_id_param: string }
        Returns: Json
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_role_safely: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      update_coach: {
        Args: {
          coach_id: string
          coach_name?: string
          coach_email?: string
          coach_phone?: string
          coach_status?: string
          coach_clinic_id?: string
        }
        Returns: Json
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
