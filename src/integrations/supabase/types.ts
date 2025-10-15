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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      articles: {
        Row: {
          author: string
          category: string[]
          content: string
          content_type: string | null
          created_at: string
          date: string
          description: string
          featured: boolean
          id: string
          image_url: string | null
          published: boolean
          read_time: string
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author?: string
          category: string[]
          content: string
          content_type?: string | null
          created_at?: string
          date: string
          description: string
          featured?: boolean
          id?: string
          image_url?: string | null
          published?: boolean
          read_time: string
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          category?: string[]
          content?: string
          content_type?: string | null
          created_at?: string
          date?: string
          description?: string
          featured?: boolean
          id?: string
          image_url?: string | null
          published?: boolean
          read_time?: string
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      article_bookmarks: {
        Row: {
          id: string
          article_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          article_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          article_id?: string
          user_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_bookmarks_article_id_fkey"
            columns: ["article_id"]
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_bookmarks_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      article_comments: {
        Row: {
          id: string
          article_id: string
          user_id: string
          parent_id: string | null
          content: string
          is_approved: boolean
          is_deleted: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          article_id: string
          user_id: string
          parent_id?: string | null
          content: string
          is_approved?: boolean
          is_deleted?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          article_id?: string
          user_id?: string
          parent_id?: string | null
          content?: string
          is_approved?: boolean
          is_deleted?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_comments_article_id_fkey"
            columns: ["article_id"]
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_comments_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_comments_parent_id_fkey"
            columns: ["parent_id"]
            referencedRelation: "article_comments"
            referencedColumns: ["id"]
          }
        ]
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          status: string
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          status?: string
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string
          subject?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          content: string
          created_at: string
          description: string
          duration: string
          highlights: string[]
          id: string
          image_url: string | null
          level: string
          price: string
          published: boolean
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          description: string
          duration: string
          highlights: string[]
          id?: string
          image_url?: string | null
          level: string
          price: string
          published?: boolean
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          description?: string
          duration?: string
          highlights?: string[]
          id?: string
          image_url?: string | null
          level?: string
          price?: string
          published?: boolean
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      cta_sections: {
        Row: {
          active: boolean
          button_text: string
          button_url: string
          context: string
          created_at: string
          description: string
          icon: string
          id: string
          is_sticky: boolean
          priority: number
          title: string
          updated_at: string
          variant: string
        }
        Insert: {
          active?: boolean
          button_text: string
          button_url: string
          context?: string
          created_at?: string
          description: string
          icon?: string
          id?: string
          is_sticky?: boolean
          priority?: number
          title: string
          updated_at?: string
          variant?: string
        }
        Update: {
          active?: boolean
          button_text?: string
          button_url?: string
          context?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          is_sticky?: boolean
          priority?: number
          title?: string
          updated_at?: string
          variant?: string
        }
        Relationships: []
      }
      custom_tool_inquiries: {
        Row: {
          admin_notes: string | null
          budget_range: string | null
          company_name: string | null
          company_size: string | null
          created_at: string
          current_solution: string | null
          description: string
          email: string
          full_name: string
          gdpr_consent: boolean
          id: string
          ip_address: string | null
          notes: string | null
          phone: string | null
          project_type: string
          source: string | null
          status: string | null
          team_size: string | null
          timeline: string | null
          user_agent: string | null
        }
        Insert: {
          admin_notes?: string | null
          budget_range?: string | null
          company_name?: string | null
          company_size?: string | null
          created_at?: string
          current_solution?: string | null
          description: string
          email: string
          full_name: string
          gdpr_consent?: boolean
          id?: string
          ip_address?: string | null
          notes?: string | null
          phone?: string | null
          project_type: string
          source?: string | null
          status?: string | null
          team_size?: string | null
          timeline?: string | null
          user_agent?: string | null
        }
        Update: {
          admin_notes?: string | null
          budget_range?: string | null
          company_name?: string | null
          company_size?: string | null
          created_at?: string
          current_solution?: string | null
          description?: string
          email?: string
          full_name?: string
          gdpr_consent?: boolean
          id?: string
          ip_address?: string | null
          notes?: string | null
          phone?: string | null
          project_type?: string
          source?: string | null
          status?: string | null
          team_size?: string | null
          timeline?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      hero_sections: {
        Row: {
          active: boolean
          badge_text: string | null
          button_text: string | null
          button_url: string | null
          created_at: string
          id: string
          image_url: string | null
          priority: number
          secondary_button_text: string | null
          secondary_button_url: string | null
          show_stats: boolean
          subtitle: string
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          badge_text?: string | null
          button_text?: string | null
          button_url?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          priority?: number
          secondary_button_text?: string | null
          secondary_button_url?: string | null
          show_stats?: boolean
          subtitle: string
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          badge_text?: string | null
          button_text?: string | null
          button_url?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          priority?: number
          secondary_button_text?: string | null
          secondary_button_url?: string | null
          show_stats?: boolean
          subtitle?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      migration_documentation: {
        Row: {
          applied_at: string | null
          author: string | null
          breaking_changes: boolean | null
          created_at: string | null
          description: string | null
          id: string
          migration_name: string
          migration_version: string
          rollback_instructions: string | null
          sql_changes: string | null
          updated_at: string | null
        }
        Insert: {
          applied_at?: string | null
          author?: string | null
          breaking_changes?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          migration_name: string
          migration_version: string
          rollback_instructions?: string | null
          sql_changes?: string | null
          updated_at?: string | null
        }
        Update: {
          applied_at?: string | null
          author?: string | null
          breaking_changes?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          migration_name?: string
          migration_version?: string
          rollback_instructions?: string | null
          sql_changes?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          is_admin: boolean | null
          pareigos: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          is_admin?: boolean | null
          pareigos?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          is_admin?: boolean | null
          pareigos?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "auth_users_view"
            referencedColumns: ["id"]
          },
        ]
      }
      sticky_cta_messages: {
        Row: {
          active: boolean
          created_at: string
          cta: string
          description: string
          emoji: string
          id: string
          priority: number
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          cta: string
          description: string
          emoji?: string
          id?: string
          priority?: number
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          cta?: string
          description?: string
          emoji?: string
          id?: string
          priority?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      reading_progress: {
        Row: {
          id: string
          article_id: string
          user_id: string
          progress_percentage: number
          last_position: number
          completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          article_id: string
          user_id: string
          progress_percentage?: number
          last_position?: number
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          article_id?: string
          user_id?: string
          progress_percentage?: number
          last_position?: number
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reading_progress_article_id_fkey"
            columns: ["article_id"]
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reading_progress_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      tools: {
        Row: {
          category: string
          created_at: string
          description: string
          featured: boolean
          id: string
          image_url: string | null
          name: string
          published: boolean
          slug: string
          updated_at: string
          url: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          featured?: boolean
          id?: string
          image_url?: string | null
          name: string
          published?: boolean
          slug: string
          updated_at?: string
          url: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          featured?: boolean
          id?: string
          image_url?: string | null
          name?: string
          published?: boolean
          slug?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      translation_requests: {
        Row: {
          chars_count: number | null
          created_at: string | null
          id: number
          origin_domain: string | null
          request_ip: string | null
          source_lang: string | null
          source_text: string
          status: string | null
          target_lang: string | null
          translated_text: string | null
        }
        Insert: {
          chars_count?: number | null
          created_at?: string | null
          id?: number
          origin_domain?: string | null
          request_ip?: string | null
          source_lang?: string | null
          source_text: string
          status?: string | null
          target_lang?: string | null
          translated_text?: string | null
        }
        Update: {
          chars_count?: number | null
          created_at?: string | null
          id?: number
          origin_domain?: string | null
          request_ip?: string | null
          source_lang?: string | null
          source_text?: string
          status?: string | null
          target_lang?: string | null
          translated_text?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      auth_users_view: {
        Row: {
          created_at: string | null
          email: string | null
          id: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          auth_created_at: string | null
          avatar_url: string | null
          created_at: string | null
          email: string | null
          id: string | null
          is_admin: boolean | null
          updated_at: string | null
          username: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "auth_users_view"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_auth_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          email: string
          id: string
        }[]
      }
      get_profiles_with_emails: {
        Args: Record<PropertyKey, never>
        Returns: {
          avatar_url: string
          created_at: string
          email: string
          id: string
          is_admin: boolean
          updated_at: string
          username: string
        }[]
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
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
