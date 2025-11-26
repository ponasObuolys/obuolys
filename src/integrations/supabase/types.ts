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
      article_bookmarks: {
        Row: {
          article_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          article_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          article_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_bookmarks_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "auth_users_view"
            referencedColumns: ["id"]
          },
        ]
      }
      article_comments: {
        Row: {
          article_id: string
          content: string
          created_at: string
          id: string
          is_approved: boolean | null
          is_deleted: boolean | null
          parent_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          article_id: string
          content: string
          created_at?: string
          id?: string
          is_approved?: boolean | null
          is_deleted?: boolean | null
          parent_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          article_id?: string
          content?: string
          created_at?: string
          id?: string
          is_approved?: boolean | null
          is_deleted?: boolean | null
          parent_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_comments_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "article_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "auth_users_view"
            referencedColumns: ["id"]
          },
        ]
      }
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
          category?: string[]
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
      calculator_submissions: {
        Row: {
          company_name: string | null
          created_at: string
          email: string
          email_error: string | null
          email_sent: boolean
          email_sent_at: string | null
          estimated_max_cost: number
          estimated_max_weeks: number
          estimated_min_cost: number
          estimated_min_weeks: number
          features: string[]
          id: string
          ip_address: unknown
          lead_status: string | null
          notes: string | null
          project_type: string
          recommended_package: string
          referrer: string | null
          tech_stack_backend: string
          tech_stack_frontend: string
          tech_stack_premium_design: boolean
          tech_stack_testing: boolean
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          email: string
          email_error?: string | null
          email_sent?: boolean
          email_sent_at?: string | null
          estimated_max_cost: number
          estimated_max_weeks: number
          estimated_min_cost: number
          estimated_min_weeks: number
          features?: string[]
          id?: string
          ip_address?: unknown
          lead_status?: string | null
          notes?: string | null
          project_type: string
          recommended_package: string
          referrer?: string | null
          tech_stack_backend?: string
          tech_stack_frontend?: string
          tech_stack_premium_design?: boolean
          tech_stack_testing?: boolean
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string
          email?: string
          email_error?: string | null
          email_sent?: boolean
          email_sent_at?: string | null
          estimated_max_cost?: number
          estimated_max_weeks?: number
          estimated_min_cost?: number
          estimated_min_weeks?: number
          features?: string[]
          id?: string
          ip_address?: unknown
          lead_status?: string | null
          notes?: string | null
          project_type?: string
          recommended_package?: string
          referrer?: string | null
          tech_stack_backend?: string
          tech_stack_frontend?: string
          tech_stack_premium_design?: boolean
          tech_stack_testing?: boolean
          updated_at?: string
          user_agent?: string | null
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
      course_pricing_tiers: {
        Row: {
          course_id: string | null
          created_at: string | null
          id: string
          is_current: boolean | null
          price_eur: number
          stripe_price_id: string
          tier_name: string
          updated_at: string | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          is_current?: boolean | null
          price_eur: number
          stripe_price_id: string
          tier_name: string
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          is_current?: boolean | null
          price_eur?: number
          stripe_price_id?: string
          tier_name?: string
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_pricing_tiers_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_purchases: {
        Row: {
          amount_paid: number
          course_id: string
          created_at: string | null
          currency: string
          customer_email: string
          customer_name: string | null
          google_form_submitted: boolean | null
          google_form_submitted_at: string | null
          id: string
          payment_status: string | null
          price_tier: string
          stripe_customer_id: string | null
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount_paid: number
          course_id: string
          created_at?: string | null
          currency?: string
          customer_email: string
          customer_name?: string | null
          google_form_submitted?: boolean | null
          google_form_submitted_at?: string | null
          id?: string
          payment_status?: string | null
          price_tier: string
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount_paid?: number
          course_id?: string
          created_at?: string | null
          currency?: string
          customer_email?: string
          customer_name?: string | null
          google_form_submitted?: boolean | null
          google_form_submitted_at?: string | null
          id?: string
          payment_status?: string | null
          price_tier?: string
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_purchases_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_purchases_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "auth_users_view"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          content: string
          countdown_enabled: boolean | null
          countdown_end_date: string | null
          countdown_text: string | null
          created_at: string
          description: string
          discount_price: string | null
          duration: string
          highlights: string[]
          id: string
          image_url: string | null
          level: string
          next_price: string | null
          next_price_date: string | null
          price: string
          promote_in_popup: boolean
          published: boolean
          regular_price: string | null
          slug: string
          stripe_price_id: string | null
          stripe_product_id: string | null
          title: string
          total_value: string | null
          updated_at: string
          value_items: Json | null
        }
        Insert: {
          content: string
          countdown_enabled?: boolean | null
          countdown_end_date?: string | null
          countdown_text?: string | null
          created_at?: string
          description: string
          discount_price?: string | null
          duration: string
          highlights: string[]
          id?: string
          image_url?: string | null
          level: string
          next_price?: string | null
          next_price_date?: string | null
          price: string
          promote_in_popup?: boolean
          published?: boolean
          regular_price?: string | null
          slug: string
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          title: string
          total_value?: string | null
          updated_at?: string
          value_items?: Json | null
        }
        Update: {
          content?: string
          countdown_enabled?: boolean | null
          countdown_end_date?: string | null
          countdown_text?: string | null
          created_at?: string
          description?: string
          discount_price?: string | null
          duration?: string
          highlights?: string[]
          id?: string
          image_url?: string | null
          level?: string
          next_price?: string | null
          next_price_date?: string | null
          price?: string
          promote_in_popup?: boolean
          published?: boolean
          regular_price?: string | null
          slug?: string
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          title?: string
          total_value?: string | null
          updated_at?: string
          value_items?: Json | null
        }
        Relationships: []
      }
      cta_clicks: {
        Row: {
          clicked_at: string
          context: string | null
          created_at: string | null
          cta_id: string
          cta_type: string
          id: string
          page_url: string | null
          user_session_id: string | null
        }
        Insert: {
          clicked_at?: string
          context?: string | null
          created_at?: string | null
          cta_id: string
          cta_type: string
          id?: string
          page_url?: string | null
          user_session_id?: string | null
        }
        Update: {
          clicked_at?: string
          context?: string | null
          created_at?: string | null
          cta_id?: string
          cta_type?: string
          id?: string
          page_url?: string | null
          user_session_id?: string | null
        }
        Relationships: []
      }
      cta_sections: {
        Row: {
          active: boolean
          button_text: string
          button_url: string
          context: string | null
          created_at: string
          description: string
          icon: string | null
          id: string
          is_sticky: boolean | null
          priority: number | null
          title: string
          updated_at: string
          variant: string | null
        }
        Insert: {
          active?: boolean
          button_text: string
          button_url: string
          context?: string | null
          created_at?: string
          description: string
          icon?: string | null
          id?: string
          is_sticky?: boolean | null
          priority?: number | null
          title: string
          updated_at?: string
          variant?: string | null
        }
        Update: {
          active?: boolean
          button_text?: string
          button_url?: string
          context?: string | null
          created_at?: string
          description?: string
          icon?: string | null
          id?: string
          is_sticky?: boolean | null
          priority?: number | null
          title?: string
          updated_at?: string
          variant?: string | null
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
      email_replies: {
        Row: {
          created_at: string
          delivery_status: string | null
          error_message: string | null
          id: string
          inquiry_id: string
          inquiry_type: string
          message: string
          recipient_email: string
          sent_at: string
          sent_by: string | null
          subject: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          delivery_status?: string | null
          error_message?: string | null
          id?: string
          inquiry_id: string
          inquiry_type: string
          message: string
          recipient_email: string
          sent_at?: string
          sent_by?: string | null
          subject: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          delivery_status?: string | null
          error_message?: string | null
          id?: string
          inquiry_id?: string
          inquiry_type?: string
          message?: string
          recipient_email?: string
          sent_at?: string
          sent_by?: string | null
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_replies_sent_by_fkey"
            columns: ["sent_by"]
            isOneToOne: false
            referencedRelation: "auth_users_view"
            referencedColumns: ["id"]
          },
        ]
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
          priority: number | null
          secondary_button_text: string | null
          secondary_button_url: string | null
          show_stats: boolean | null
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
          priority?: number | null
          secondary_button_text?: string | null
          secondary_button_url?: string | null
          show_stats?: boolean | null
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
          priority?: number | null
          secondary_button_text?: string | null
          secondary_button_url?: string | null
          show_stats?: boolean | null
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
      page_views: {
        Row: {
          article_id: string | null
          id: string
          ip_address: unknown
          session_id: string
          user_agent: string | null
          user_id: string | null
          viewed_at: string | null
        }
        Insert: {
          article_id?: string | null
          id?: string
          ip_address?: unknown
          session_id: string
          user_agent?: string | null
          user_id?: string | null
          viewed_at?: string | null
        }
        Update: {
          article_id?: string | null
          id?: string
          ip_address?: unknown
          session_id?: string
          user_agent?: string | null
          user_id?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "page_views_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "page_views_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "auth_users_view"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          is_admin: boolean | null
          role: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          is_admin?: boolean | null
          role?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          is_admin?: boolean | null
          role?: string | null
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
      reading_progress: {
        Row: {
          article_id: string
          completed: boolean | null
          created_at: string
          id: string
          last_position: number | null
          progress_percentage: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          article_id: string
          completed?: boolean | null
          created_at?: string
          id?: string
          last_position?: number | null
          progress_percentage?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          article_id?: string
          completed?: boolean | null
          created_at?: string
          id?: string
          last_position?: number | null
          progress_percentage?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reading_progress_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reading_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "auth_users_view"
            referencedColumns: ["id"]
          },
        ]
      }
      site_statistics: {
        Row: {
          id: string
          last_updated: string | null
          total_page_views: number | null
          total_visitors: number | null
          year: number
        }
        Insert: {
          id?: string
          last_updated?: string | null
          total_page_views?: number | null
          total_visitors?: number | null
          year: number
        }
        Update: {
          id?: string
          last_updated?: string | null
          total_page_views?: number | null
          total_visitors?: number | null
          year?: number
        }
        Relationships: []
      }
      sticky_cta_messages: {
        Row: {
          active: boolean | null
          created_at: string | null
          cta: string
          description: string
          emoji: string | null
          id: string
          priority: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          cta: string
          description: string
          emoji?: string | null
          id?: string
          priority?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          cta?: string
          description?: string
          emoji?: string | null
          id?: string
          priority?: number | null
          title?: string
          updated_at?: string | null
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
      cta_daily_stats: {
        Row: {
          context: string | null
          cta_type: string | null
          date: string | null
          total_clicks: number | null
          unique_ctas_clicked: number | null
          unique_sessions: number | null
        }
        Relationships: []
      }
      cta_performance: {
        Row: {
          active: boolean | null
          avg_clicks_per_day: number | null
          button_text: string | null
          context: string | null
          created_at: string | null
          days_active: number | null
          description: string | null
          id: string | null
          last_clicked: string | null
          priority: number | null
          title: string | null
          total_clicks: number | null
        }
        Relationships: []
      }
      sticky_performance: {
        Row: {
          active: boolean | null
          avg_clicks_per_day: number | null
          created_at: string | null
          cta: string | null
          days_active: number | null
          description: string | null
          emoji: string | null
          id: string | null
          last_clicked: string | null
          priority: number | null
          title: string | null
          total_clicks: number | null
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
      get_article_view_count: {
        Args: { p_article_id: string }
        Returns: {
          display_count: number
          view_count: number
        }[]
      }
      get_auth_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          email: string
          id: string
        }[]
      }
      get_cta_recommendations: {
        Args: Record<PropertyKey, never>
        Returns: {
          cta_id: string
          current_priority: number
          impact: string
          reason: string
          recommendation_type: string
          suggested_priority: number
          title: string
        }[]
      }
      get_current_year_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_page_views: number
          total_visitors: number
          year: number
        }[]
      }
      get_device_breakdown: { Args: { since_date?: string }; Returns: Json }
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
      get_top_ctas: {
        Args: { days_back?: number; limit_count?: number }
        Returns: {
          avg_daily_clicks: number
          context: string
          conversion_score: number
          cta_id: string
          title: string
          total_clicks: number
        }[]
      }
      get_trending_articles: {
        Args: { limit_count?: number; since_date?: string }
        Returns: {
          category: string[]
          description: string
          id: string
          image_url: string
          slug: string
          title: string
          views: number
        }[]
      }
      is_admin: { Args: { user_id?: string }; Returns: boolean }
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
