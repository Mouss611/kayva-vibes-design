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
      profiles: {
        Row: {
          created_at: string
          documents_status: Json | null
          employment_status: string | null
          estimated_income_range: Json | null
          first_name: string
          id: string
          last_name: string
          onboarding_completed: boolean | null
          phone_number: string
          postal_code: string | null
          preferred_location: string | null
          role: Database["public"]["Enums"]["user_role"]
          stripe_customer_id: string | null
          students_per_day: number | null
          teaching_hours: string | null
          updated_at: string
          working_days: string[] | null
        }
        Insert: {
          created_at?: string
          documents_status?: Json | null
          employment_status?: string | null
          estimated_income_range?: Json | null
          first_name: string
          id: string
          last_name: string
          onboarding_completed?: boolean | null
          phone_number: string
          postal_code?: string | null
          preferred_location?: string | null
          role: Database["public"]["Enums"]["user_role"]
          stripe_customer_id?: string | null
          students_per_day?: number | null
          teaching_hours?: string | null
          updated_at?: string
          working_days?: string[] | null
        }
        Update: {
          created_at?: string
          documents_status?: Json | null
          employment_status?: string | null
          estimated_income_range?: Json | null
          first_name?: string
          id?: string
          last_name?: string
          onboarding_completed?: boolean | null
          phone_number?: string
          postal_code?: string | null
          preferred_location?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          stripe_customer_id?: string | null
          students_per_day?: number | null
          teaching_hours?: string | null
          updated_at?: string
          working_days?: string[] | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          answer_a: string
          answer_b: string
          answer_c: string
          answer_d: string
          category: string
          correct_answer: string
          created_at: string
          explanation: string
          id: string
          question: string
          updated_at: string
        }
        Insert: {
          answer_a: string
          answer_b: string
          answer_c: string
          answer_d: string
          category: string
          correct_answer: string
          created_at?: string
          explanation: string
          id?: string
          question: string
          updated_at?: string
        }
        Update: {
          answer_a?: string
          answer_b?: string
          answer_c?: string
          answer_d?: string
          category?: string
          correct_answer?: string
          created_at?: string
          explanation?: string
          id?: string
          question?: string
          updated_at?: string
        }
        Relationships: []
      }
      student_onboarding: {
        Row: {
          age: number
          availability: Database["public"]["Enums"]["availability"][]
          city: string
          created_at: string
          driving_experience: boolean
          driving_motivation: string
          gender: Database["public"]["Enums"]["gender"]
          id: string
          max_distance: number
          onboarding_completed: boolean | null
          postal_code: string
          start_preference: Database["public"]["Enums"]["start_preference"]
          updated_at: string
        }
        Insert: {
          age: number
          availability: Database["public"]["Enums"]["availability"][]
          city: string
          created_at?: string
          driving_experience: boolean
          driving_motivation: string
          gender: Database["public"]["Enums"]["gender"]
          id: string
          max_distance: number
          onboarding_completed?: boolean | null
          postal_code: string
          start_preference: Database["public"]["Enums"]["start_preference"]
          updated_at?: string
        }
        Update: {
          age?: number
          availability?: Database["public"]["Enums"]["availability"][]
          city?: string
          created_at?: string
          driving_experience?: boolean
          driving_motivation?: string
          gender?: Database["public"]["Enums"]["gender"]
          id?: string
          max_distance?: number
          onboarding_completed?: boolean | null
          postal_code?: string
          start_preference?: Database["public"]["Enums"]["start_preference"]
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          amount: number
          created_at: string
          end_date: string
          hours: number
          id: string
          last_payment_date: string | null
          next_payment_date: string | null
          payment_count: number
          start_date: string
          status: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id: string
          stripe_subscription_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          end_date: string
          hours: number
          id?: string
          last_payment_date?: string | null
          next_payment_date?: string | null
          payment_count?: number
          start_date: string
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id: string
          stripe_subscription_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          end_date?: string
          hours?: number
          id?: string
          last_payment_date?: string | null
          next_payment_date?: string | null
          payment_count?: number
          start_date?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string
          stripe_subscription_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_answers: {
        Row: {
          created_at: string
          id: string
          is_correct: boolean
          question_id: string | null
          selected_answer: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_correct: boolean
          question_id?: string | null
          selected_answer: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_correct?: boolean
          question_id?: string | null
          selected_answer?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          category: string
          correct_answers: number | null
          created_at: string
          id: string
          total_answers: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category: string
          correct_answers?: number | null
          created_at?: string
          id?: string
          total_answers?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category?: string
          correct_answers?: number | null
          created_at?: string
          id?: string
          total_answers?: number | null
          updated_at?: string
          user_id?: string | null
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
      availability: "morning" | "afternoon" | "evening" | "weekend"
      gender: "male" | "female"
      start_preference: "as_soon_as_possible" | "next_week" | "later"
      subscription_status:
        | "active"
        | "payment_failed"
        | "payment_pending"
        | "canceled"
        | "completed"
        | "suspended"
      user_role: "student" | "instructor"
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
