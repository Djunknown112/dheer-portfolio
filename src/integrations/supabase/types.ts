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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      about_highlights: {
        Row: {
          created_at: string
          description: string
          icon_name: string | null
          id: string
          label: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          icon_name?: string | null
          id?: string
          label: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          icon_name?: string | null
          id?: string
          label?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      achievements: {
        Row: {
          created_at: string
          date: string | null
          description: string
          icon_name: string | null
          id: string
          photo_url: string | null
          sort_order: number | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date?: string | null
          description: string
          icon_name?: string | null
          id?: string
          photo_url?: string | null
          sort_order?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string | null
          description?: string
          icon_name?: string | null
          id?: string
          photo_url?: string | null
          sort_order?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          category: string
          created_at: string
          file_url: string | null
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          file_url?: string | null
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          file_url?: string | null
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      mentors: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          photo_url: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          photo_url?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          photo_url?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      photos: {
        Row: {
          caption: string
          category: string
          created_at: string
          id: string
          image_url: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          caption: string
          category?: string
          created_at?: string
          id?: string
          image_url: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          caption?: string
          category?: string
          created_at?: string
          id?: string
          image_url?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      project_photos: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          image_url: string
          project_id: string
          sort_order: number | null
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          image_url: string
          project_id: string
          sort_order?: number | null
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          image_url?: string
          project_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_photos_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          banner_image_url: string | null
          category: string | null
          color_from: string | null
          color_to: string | null
          created_at: string
          description: string
          features: string[] | null
          icon_name: string | null
          id: string
          sort_order: number | null
          technologies: string[] | null
          title: string
          updated_at: string
          website_link: string | null
          youtube_link: string | null
        }
        Insert: {
          banner_image_url?: string | null
          category?: string | null
          color_from?: string | null
          color_to?: string | null
          created_at?: string
          description: string
          features?: string[] | null
          icon_name?: string | null
          id?: string
          sort_order?: number | null
          technologies?: string[] | null
          title: string
          updated_at?: string
          website_link?: string | null
          youtube_link?: string | null
        }
        Update: {
          banner_image_url?: string | null
          category?: string | null
          color_from?: string | null
          color_to?: string | null
          created_at?: string
          description?: string
          features?: string[] | null
          icon_name?: string | null
          id?: string
          sort_order?: number | null
          technologies?: string[] | null
          title?: string
          updated_at?: string
          website_link?: string | null
          youtube_link?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          hidden: boolean
          id: string
          message: string
          name: string
          rating: number
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          hidden?: boolean
          id?: string
          message: string
          name: string
          rating?: number
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          hidden?: boolean
          id?: string
          message?: string
          name?: string
          rating?: number
          user_id?: string | null
        }
        Relationships: []
      }
      site_content: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string
          created_at: string
          icon_name: string | null
          id: string
          name: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          icon_name?: string | null
          id?: string
          name: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          icon_name?: string | null
          id?: string
          name?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_public_reviews: {
        Args: never
        Returns: {
          avatar_hash: string
          avatar_url: string
          created_at: string
          id: string
          message: string
          name: string
          rating: number
        }[]
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
