export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
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
  public: {
    Tables: {
      face: {
        Row: {
          created_at: string
          file_path: string
          gender: Database["public"]["Enums"]["gender"]
          id: string
          name: string
          race: Database["public"]["Enums"]["race"]
        }
        Insert: {
          created_at?: string
          file_path: string
          gender: Database["public"]["Enums"]["gender"]
          id?: string
          name: string
          race: Database["public"]["Enums"]["race"]
        }
        Update: {
          created_at?: string
          file_path?: string
          gender?: Database["public"]["Enums"]["gender"]
          id?: string
          name?: string
          race?: Database["public"]["Enums"]["race"]
        }
        Relationships: []
      }
      game_answer: {
        Row: {
          answer: string
          created_at: string
          face_id: string
          id: string
          is_correct: boolean
          session_id: string
        }
        Insert: {
          answer: string
          created_at?: string
          face_id: string
          id?: string
          is_correct: boolean
          session_id: string
        }
        Update: {
          answer?: string
          created_at?: string
          face_id?: string
          id?: string
          is_correct?: boolean
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_answer_face_id_fkey"
            columns: ["face_id"]
            isOneToOne: false
            referencedRelation: "face"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_answer_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "game_session"
            referencedColumns: ["id"]
          },
        ]
      }
      game_session: {
        Row: {
          completed_at: string | null
          created_at: string
          face_ids: string[]
          id: string
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          face_ids: string[]
          id?: string
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          face_ids?: string[]
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      number_answer: {
        Row: {
          answer: string
          created_at: string | null
          id: string
          number_session_id: string | null
          user_id: string | null
        }
        Insert: {
          answer: string
          created_at?: string | null
          id?: string
          number_session_id?: string | null
          user_id?: string | null
        }
        Update: {
          answer?: string
          created_at?: string | null
          id?: string
          number_session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "number_answer_number_session_id_fkey"
            columns: ["number_session_id"]
            isOneToOne: false
            referencedRelation: "number_session"
            referencedColumns: ["id"]
          },
        ]
      }
      number_session: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          number: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          number: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          number?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_random_faces: {
        Args: { count: number }
        Returns: {
          created_at: string
          file_path: string
          gender: Database["public"]["Enums"]["gender"]
          id: string
          name: string
          race: Database["public"]["Enums"]["race"]
        }[]
        SetofOptions: {
          from: "*"
          to: "face"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_unseen_random_faces: {
        Args: { count: number }
        Returns: {
          created_at: string
          file_path: string
          gender: Database["public"]["Enums"]["gender"]
          id: string
          name: string
          race: Database["public"]["Enums"]["race"]
        }[]
        SetofOptions: {
          from: "*"
          to: "face"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_user_session_stats: {
        Args: never
        Returns: {
          correct: number
          created_at: string
          face_count: number
          id: string
          total: number
        }[]
      }
    }
    Enums: {
      gender: "MALE" | "FEMALE"
      race:
        | "East Asian"
        | "Indian"
        | "Black"
        | "White"
        | "Middle Eastern"
        | "Latino_Hispanic"
        | "Southeast Asian"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      gender: ["MALE", "FEMALE"],
      race: [
        "East Asian",
        "Indian",
        "Black",
        "White",
        "Middle Eastern",
        "Latino_Hispanic",
        "Southeast Asian",
      ],
    },
  },
} as const

