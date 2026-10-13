export type UserRole = "admin" | "client";
export type ProfileStatus = "invited" | "active" | "suspended" | "archived";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          phone: string | null;
          avatar_path: string | null;
          role: UserRole;
          status: ProfileStatus;
          onboarding_complete: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string;
          phone?: string | null;
          avatar_path?: string | null;
          role?: UserRole;
          status?: ProfileStatus;
          onboarding_complete?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      leads: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string;
          goal: string;
          contact_preference: string;
          status: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          full_name: string;
          email: string;
          phone: string;
          goal: string;
          contact_preference?: string;
          status?: string;
          notes?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["leads"]["Insert"]>;
        Relationships: [];
      };
      client_invitations: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          invited_by: string;
          accepted_at: string | null;
          created_at: string;
        };
        Insert: {
          email: string;
          full_name: string;
          invited_by: string;
          accepted_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["client_invitations"]["Insert"]>;
        Relationships: [];
      };
      onboarding_submissions: {
        Row: {
          id: string;
          user_id: string;
          age: number;
          sex: string;
          weight_kg: number;
          height_cm: number;
          occupation_schedule: string;
          training_priority: string;
          meal_availability: string;
          conditions_injuries: string | null;
          allergies_intolerances: string | null;
          goals: string;
          social_networks: string | null;
          submitted_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          age: number;
          sex: string;
          weight_kg: number;
          height_cm: number;
          occupation_schedule: string;
          training_priority: string;
          meal_availability: string;
          conditions_injuries?: string | null;
          allergies_intolerances?: string | null;
          goals: string;
          social_networks?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["onboarding_submissions"]["Insert"]>;
        Relationships: [];
      };
      consent_acceptances: {
        Row: {
          id: string;
          user_id: string;
          consent_type: string;
          policy_version: string;
          accepted_at: string;
        };
        Insert: {
          user_id: string;
          consent_type: string;
          policy_version: string;
        };
        Update: never;
        Relationships: [];
      };
      workout_assignments: {
        Row: {
          id: string;
          client_id: string;
          title: string;
          content: string;
          status: string;
          version: number;
          starts_on: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          client_id: string;
          title: string;
          content: string;
          status?: string;
          version?: number;
          starts_on?: string | null;
          created_by: string;
        };
        Update: Partial<Database["public"]["Tables"]["workout_assignments"]["Insert"]>;
        Relationships: [];
      };
      nutrition_assignments: {
        Row: {
          id: string;
          client_id: string;
          title: string;
          content: string;
          status: string;
          version: number;
          starts_on: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          client_id: string;
          title: string;
          content: string;
          status?: string;
          version?: number;
          starts_on?: string | null;
          created_by: string;
        };
        Update: Partial<Database["public"]["Tables"]["nutrition_assignments"]["Insert"]>;
        Relationships: [];
      };
      workout_logs: {
        Row: {
          id: string;
          client_id: string;
          assignment_id: string | null;
          completed_on: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          client_id: string;
          assignment_id?: string | null;
          completed_on?: string;
          notes?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["workout_logs"]["Insert"]>;
        Relationships: [];
      };
      check_ins: {
        Row: {
          id: string;
          client_id: string;
          weight_kg: number | null;
          energy_level: number;
          adherence_level: number;
          notes: string | null;
          trainer_notes: string | null;
          created_at: string;
        };
        Insert: {
          client_id: string;
          weight_kg?: number | null;
          energy_level: number;
          adherence_level: number;
          notes?: string | null;
          trainer_notes?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["check_ins"]["Insert"]>;
        Relationships: [];
      };
      manual_fee_records: {
        Row: {
          id: string;
          client_id: string;
          period: string;
          amount_eur: number;
          status: string;
          notes: string | null;
          recorded_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          client_id: string;
          period: string;
          amount_eur: number;
          status?: string;
          notes?: string | null;
          recorded_by: string;
        };
        Update: Partial<Database["public"]["Tables"]["manual_fee_records"]["Insert"]>;
        Relationships: [];
      };
      audit_events: {
        Row: {
          id: string;
          actor_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          metadata: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          actor_id?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          metadata?: Record<string, unknown>;
        };
        Update: never;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      complete_onboarding: { Args: Record<PropertyKey, never>; Returns: undefined };
      is_admin: { Args: { user_id?: string }; Returns: boolean };
    };
    Enums: {
      user_role: UserRole;
      profile_status: ProfileStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};
