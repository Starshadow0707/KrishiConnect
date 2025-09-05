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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      chat_queries: {
        Row: {
          created_at: string
          farmer_id: string
          feedback: number | null
          has_image: boolean | null
          id: string
          image_url: string | null
          language: Database["public"]["Enums"]["supported_language"] | null
          question: string
          response: string | null
          response_time_ms: number | null
          voice_note_url: string | null
        }
        Insert: {
          created_at?: string
          farmer_id: string
          feedback?: number | null
          has_image?: boolean | null
          id?: string
          image_url?: string | null
          language?: Database["public"]["Enums"]["supported_language"] | null
          question: string
          response?: string | null
          response_time_ms?: number | null
          voice_note_url?: string | null
        }
        Update: {
          created_at?: string
          farmer_id?: string
          feedback?: number | null
          has_image?: boolean | null
          id?: string
          image_url?: string | null
          language?: Database["public"]["Enums"]["supported_language"] | null
          question?: string
          response?: string | null
          response_time_ms?: number | null
          voice_note_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_queries_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
        ]
      }
      crop_diseases: {
        Row: {
          ai_analysis: Json | null
          confidence_score: number | null
          created_at: string
          crop_name: string
          detected_disease: string | null
          expert_verified: boolean | null
          farmer_id: string
          id: string
          image_url: string
          treatment_recommendations: string | null
        }
        Insert: {
          ai_analysis?: Json | null
          confidence_score?: number | null
          created_at?: string
          crop_name: string
          detected_disease?: string | null
          expert_verified?: boolean | null
          farmer_id: string
          id?: string
          image_url: string
          treatment_recommendations?: string | null
        }
        Update: {
          ai_analysis?: Json | null
          confidence_score?: number | null
          created_at?: string
          crop_name?: string
          detected_disease?: string | null
          expert_verified?: boolean | null
          farmer_id?: string
          id?: string
          image_url?: string
          treatment_recommendations?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crop_diseases_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
        ]
      }
      faq: {
        Row: {
          answer: string
          category: string
          created_at: string
          id: string
          is_active: boolean | null
          language: Database["public"]["Enums"]["supported_language"]
          priority: number | null
          question: string
          updated_at: string
        }
        Insert: {
          answer: string
          category: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          language: Database["public"]["Enums"]["supported_language"]
          priority?: number | null
          question: string
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          language?: Database["public"]["Enums"]["supported_language"]
          priority?: number | null
          question?: string
          updated_at?: string
        }
        Relationships: []
      }
      farmers: {
        Row: {
          block: string | null
          created_at: string
          district: string
          farm_size_acres: number | null
          id: string
          irrigation_type: string | null
          name: string
          panchayat: string | null
          phone: string | null
          preferred_language:
            | Database["public"]["Enums"]["supported_language"]
            | null
          primary_crops: Database["public"]["Enums"]["crop_type"][] | null
          soil_type: Database["public"]["Enums"]["soil_type"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          block?: string | null
          created_at?: string
          district: string
          farm_size_acres?: number | null
          id?: string
          irrigation_type?: string | null
          name: string
          panchayat?: string | null
          phone?: string | null
          preferred_language?:
            | Database["public"]["Enums"]["supported_language"]
            | null
          primary_crops?: Database["public"]["Enums"]["crop_type"][] | null
          soil_type?: Database["public"]["Enums"]["soil_type"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          block?: string | null
          created_at?: string
          district?: string
          farm_size_acres?: number | null
          id?: string
          irrigation_type?: string | null
          name?: string
          panchayat?: string | null
          phone?: string | null
          preferred_language?:
            | Database["public"]["Enums"]["supported_language"]
            | null
          primary_crops?: Database["public"]["Enums"]["crop_type"][] | null
          soil_type?: Database["public"]["Enums"]["soil_type"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      government_schemes: {
        Row: {
          application_process: string | null
          apply_link: string | null
          benefits: string | null
          contact_info: Json | null
          created_at: string
          description: string
          eligibility_criteria: string | null
          id: string
          is_active: boolean | null
          required_documents: string[] | null
          target_crops: Database["public"]["Enums"]["crop_type"][] | null
          target_districts: string[] | null
          title: string
          updated_at: string
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          application_process?: string | null
          apply_link?: string | null
          benefits?: string | null
          contact_info?: Json | null
          created_at?: string
          description: string
          eligibility_criteria?: string | null
          id?: string
          is_active?: boolean | null
          required_documents?: string[] | null
          target_crops?: Database["public"]["Enums"]["crop_type"][] | null
          target_districts?: string[] | null
          title: string
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          application_process?: string | null
          apply_link?: string | null
          benefits?: string | null
          contact_info?: Json | null
          created_at?: string
          description?: string
          eligibility_criteria?: string | null
          id?: string
          is_active?: boolean | null
          required_documents?: string[] | null
          target_crops?: Database["public"]["Enums"]["crop_type"][] | null
          target_districts?: string[] | null
          title?: string
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      market_prices: {
        Row: {
          cached_at: string
          created_at: string
          crop_name: string
          district: string
          id: string
          market_name: string
          max_price: number | null
          min_price: number | null
          modal_price: number | null
          price_date: string
          price_per_quintal: number
          variety: string | null
        }
        Insert: {
          cached_at?: string
          created_at?: string
          crop_name: string
          district: string
          id?: string
          market_name: string
          max_price?: number | null
          min_price?: number | null
          modal_price?: number | null
          price_date: string
          price_per_quintal: number
          variety?: string | null
        }
        Update: {
          cached_at?: string
          created_at?: string
          crop_name?: string
          district?: string
          id?: string
          market_name?: string
          max_price?: number | null
          min_price?: number | null
          modal_price?: number | null
          price_date?: string
          price_per_quintal?: number
          variety?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      weather_data: {
        Row: {
          agricultural_indices: Json | null
          cached_at: string
          district: string
          expires_at: string
          forecast_data: Json | null
          id: string
          weather_data: Json
        }
        Insert: {
          agricultural_indices?: Json | null
          cached_at?: string
          district: string
          expires_at?: string
          forecast_data?: Json | null
          id?: string
          weather_data: Json
        }
        Update: {
          agricultural_indices?: Json | null
          cached_at?: string
          district?: string
          expires_at?: string
          forecast_data?: Json | null
          id?: string
          weather_data?: Json
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "farmer" | "expert"
      crop_type:
        | "rice"
        | "wheat"
        | "cotton"
        | "sugarcane"
        | "coconut"
        | "spices"
        | "vegetables"
        | "fruits"
        | "other"
      soil_type:
        | "alluvial"
        | "black"
        | "red"
        | "laterite"
        | "desert"
        | "mountain"
        | "other"
      supported_language: "en" | "ml" | "ta" | "te" | "kn" | "hi"
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
      app_role: ["admin", "farmer", "expert"],
      crop_type: [
        "rice",
        "wheat",
        "cotton",
        "sugarcane",
        "coconut",
        "spices",
        "vegetables",
        "fruits",
        "other",
      ],
      soil_type: [
        "alluvial",
        "black",
        "red",
        "laterite",
        "desert",
        "mountain",
        "other",
      ],
      supported_language: ["en", "ml", "ta", "te", "kn", "hi"],
    },
  },
} as const
