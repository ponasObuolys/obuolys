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
      articles: {
        Row: {
          author: string
          category: string
          content: string
          content_type: string
          created_at: string
          date: string
          description: string
          featured: boolean
          id: string
          published: boolean
          read_time: string
          slug: string
          title: string
          updated_at: string
          image_url: string | null
        }
        Insert: {
          author: string
          category: string
          content: string
          content_type: string
          created_at?: string
          date: string
          description: string
          featured?: boolean
          id?: string
          published?: boolean
          read_time: string
          slug: string
          title: string
          updated_at?: string
          image_url?: string | null
        }
        Update: {
          author?: string
          category?: string
          content?: string
          created_at?: string
          date?: string
          description?: string
          featured?: boolean
          id?: string
          published?: boolean
          read_time?: string
          slug?: string
          title?: string
          updated_at?: string
          image_url?: string | null
          content_type?: string
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
          level: string
          price: string
          published: boolean
          slug: string
          title: string
          updated_at: string
          image_url: string | null
        }
        Insert: {
          content: string
          created_at?: string
          description: string
          duration: string
          highlights: string[]
          id?: string
          level: string
          price: string
          published?: boolean
          slug: string
          title: string
          updated_at?: string
          image_url?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          description?: string
          duration?: string
          highlights?: string[]
          id?: string
          level?: string
          price?: string
          published?: boolean
          slug?: string
          title?: string
          updated_at?: string
          image_url?: string | null
        }
        Relationships: []
      }
      cta_sections: {
        Row: {
          active: boolean
          button_text: string
          button_url: string
          created_at: string
          description: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          button_text: string
          button_url: string
          created_at?: string
          description: string
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          button_text?: string
          button_url?: string
          created_at?: string
          description?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      hero_sections: {
        Row: {
          active: boolean
          button_text: string | null
          button_url: string | null
          created_at: string
          id: string
          image_url: string | null
          subtitle: string
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          button_text?: string | null
          button_url?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          subtitle: string
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          button_text?: string | null
          button_url?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          subtitle?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          author: string
          content: string
          created_at: string
          date: string
          description: string
          id: string
          published: boolean
          slug: string
          title: string
          updated_at: string
          image_url: string | null
        }
        Insert: {
          author: string
          content: string
          created_at?: string
          date: string
          description: string
          id?: string
          published?: boolean
          slug: string
          title: string
          updated_at?: string
          image_url?: string | null
        }
        Update: {
          author?: string
          content?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          published?: boolean
          slug?: string
          title?: string
          updated_at?: string
          image_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          is_admin: boolean | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          is_admin?: boolean | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          is_admin?: boolean | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: {
          user_id: string
        }
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
