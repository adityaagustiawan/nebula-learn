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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          full_name: string | null
          github_username: string | null
          id: string
          updated_at: string
          role: string
          major: string | null
          total_points: number
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          github_username?: string | null
          id: string
          updated_at?: string
          role?: string
          major?: string | null
          total_points?: number
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          github_username?: string | null
          id?: string
          updated_at?: string
          role?: string
          major?: string | null
          total_points?: number
        }
        Relationships: []
      }
      skills: {
        Row: {
          id: string
          user_id: string
          skill_name: string
          evidence_url: string | null
          status: string
          points: number | null
          review_note: string | null
          reviewed_by: string | null
          reviewed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          skill_name: string
          evidence_url?: string | null
          status?: string
          points?: number | null
          review_note?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          skill_name?: string
          evidence_url?: string | null
          status?: string
          points?: number | null
          review_note?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      portfolios: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          description: string | null
          evidence_url: string | null
          status: string
          points: number | null
          review_note: string | null
          reviewed_by: string | null
          reviewed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          description?: string | null
          evidence_url?: string | null
          status?: string
          points?: number | null
          review_note?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          description?: string | null
          evidence_url?: string | null
          status?: string
          points?: number | null
          review_note?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          id: string
          user_id: string
          level: string
          title: string
          evidence_url: string | null
          status: string
          points: number | null
          review_note: string | null
          reviewed_by: string | null
          reviewed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          level: string
          title: string
          evidence_url?: string | null
          status?: string
          points?: number | null
          review_note?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          level?: string
          title?: string
          evidence_url?: string | null
          status?: string
          points?: number | null
          review_note?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      points_transactions: {
        Row: {
          id: string
          user_id: string
          source_type: string
          source_id: string
          points: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          source_type: string
          source_id: string
          points: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          source_type?: string
          source_id?: string
          points?: number
          created_at?: string
        }
        Relationships: []
      }
      rewards: {
        Row: {
          id: string
          name: string
          description: string | null
          required_points: number
          image_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          required_points?: number
          image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          required_points?: number
          image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      reward_claims: {
        Row: {
          id: string
          user_id: string
          reward_id: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          reward_id: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          reward_id?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          id: string
          title: string
          description: string
          type: string
          required_skills: string[] | null
          posted_by: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          type: string
          required_skills?: string[] | null
          posted_by: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          type?: string
          required_skills?: string[] | null
          posted_by?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_files: {
        Row: {
          created_at: string
          id: string
          mime_type: string | null
          name: string
          size: number
          storage_path: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mime_type?: string | null
          name: string
          size?: number
          storage_path: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mime_type?: string | null
          name?: string
          size?: number
          storage_path?: string
          user_id?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          id: string
          slug: string
          title: string
          category: string
          level: string
          hours: number
          rating: number
          enrolled_count: number
          instructor: string
          description: string
          tag: string | null
          external_url: string | null
          updated_at: string
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          category: string
          level: string
          hours?: number
          rating?: number
          enrolled_count?: number
          instructor: string
          description: string
          tag?: string | null
          external_url?: string | null
          updated_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          category?: string
          level?: string
          hours?: number
          rating?: number
          enrolled_count?: number
          instructor?: string
          description?: string
          tag?: string | null
          external_url?: string | null
          updated_at?: string
          created_at?: string
        }
        Relationships: []
      }
      course_lessons: {
        Row: {
          id: string
          course_id: string
          slug: string
          title: string
          content: string
          lesson_type: string
          duration_min: number
          sort_order: number
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          slug: string
          title: string
          content: string
          lesson_type?: string
          duration_min?: number
          sort_order?: number
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          slug?: string
          title?: string
          content?: string
          lesson_type?: string
          duration_min?: number
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          id: string
          user_id: string
          course_id: string
          progress_percent: number
          last_lesson_id: string | null
          enrolled_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          progress_percent?: number
          last_lesson_id?: string | null
          enrolled_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          progress_percent?: number
          last_lesson_id?: string | null
          enrolled_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      lesson_progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          completed: boolean
          completed_at: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          completed?: boolean
          completed_at?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          completed?: boolean
          completed_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      competitions: {
        Row: {
          id: string
          slug: string
          title: string
          host: string
          prize: string
          starts_label: string
          days_left: number
          participants: number
          tags: string[]
          status: string
          external_url: string | null
          image_url: string | null
          competition_type: string | null
          description: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          host: string
          prize: string
          starts_label: string
          days_left?: number
          participants?: number
          tags?: string[]
          status: string
          external_url?: string | null
          image_url?: string | null
          competition_type?: string | null
          description?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          host?: string
          prize?: string
          starts_label?: string
          days_left?: number
          participants?: number
          tags?: string[]
          status?: string
          external_url?: string | null
          image_url?: string | null
          competition_type?: string | null
          description?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      webinars: {
        Row: {
          id: string
          slug: string
          title: string
          speaker: string
          role: string
          starts_at: string
          duration_min: number
          attendees: number
          status: string
          topic: string
          external_url: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          speaker: string
          role: string
          starts_at: string
          duration_min: number
          attendees?: number
          status: string
          topic: string
          external_url?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          speaker?: string
          role?: string
          starts_at?: string
          duration_min?: number
          attendees?: number
          status?: string
          topic?: string
          external_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      feed_items: {
        Row: {
          id: string
          external_id: string
          source: string
          title: string
          url: string
          summary: string | null
          category: string
          published_at: string | null
          synced_at: string
        }
        Insert: {
          id?: string
          external_id: string
          source: string
          title: string
          url: string
          summary?: string | null
          category?: string
          published_at?: string | null
          synced_at?: string
        }
        Update: {
          id?: string
          external_id?: string
          source?: string
          title?: string
          url?: string
          summary?: string | null
          category?: string
          published_at?: string | null
          synced_at?: string
        }
        Relationships: []
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
