export type UserRole = "admin" | "client";
export type ProfileStatus = "invited" | "active" | "suspended" | "archived";
export type BillingCycle = "monthly" | "semiannual" | "annual" | "custom";
export type ServiceModality = "in_person" | "online";

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
      client_admin_notes: {
        Row: {
          client_id: string;
          notes: string;
          updated_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          client_id: string;
          notes?: string;
          updated_by: string;
        };
        Update: {
          notes?: string;
          updated_by?: string;
        };
        Relationships: [];
      };
      pricing_plans: {
        Row: {
          id: string;
          name: string;
          billing_cycle: BillingCycle;
          duration_months: number;
          service_modality: ServiceModality | null;
          days_per_week: number | null;
          default_amount_eur: number;
          active: boolean;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          billing_cycle: BillingCycle;
          duration_months?: number;
          service_modality?: ServiceModality | null;
          days_per_week?: number | null;
          default_amount_eur: number;
          active?: boolean;
          created_by: string;
        };
        Update: {
          name?: string;
          billing_cycle?: BillingCycle;
          duration_months?: number;
          service_modality?: ServiceModality | null;
          days_per_week?: number | null;
          default_amount_eur?: number;
          active?: boolean;
        };
        Relationships: [];
      };
      client_commercial_terms: {
        Row: {
          client_id: string;
          modality: ServiceModality;
          pricing_plan_id: string | null;
          agreed_amount_eur: number;
          updated_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          client_id: string;
          modality: ServiceModality;
          pricing_plan_id?: string | null;
          agreed_amount_eur: number;
          updated_by: string;
        };
        Update: {
          modality?: ServiceModality;
          pricing_plan_id?: string | null;
          agreed_amount_eur?: number;
          updated_by?: string;
        };
        Relationships: [];
      };
      admin_dashboard_settings: {
        Row: {
          admin_id: string;
          monthly_revenue_goal_eur: number;
          active_clients_goal: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          admin_id: string;
          monthly_revenue_goal_eur?: number;
          active_clients_goal?: number;
        };
        Update: {
          monthly_revenue_goal_eur?: number;
          active_clients_goal?: number;
        };
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
      assignment_templates: {
        Row: {
          id: string;
          kind: "workout" | "nutrition";
          name: string;
          title: string;
          content: string;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          kind: "workout" | "nutrition";
          name: string;
          title: string;
          content: string;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["assignment_templates"]["Insert"]>;
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
      admin_notifications: {
        Row: {
          id: string;
          recipient_id: string;
          event_key: string;
          category: "lead" | "client" | "questionnaire" | "check_in" | "workout_log";
          title: string;
          message: string;
          href: string;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          recipient_id: string;
          event_key: string;
          category: "lead" | "client" | "questionnaire" | "check_in" | "workout_log";
          title: string;
          message: string;
          href: string;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          read_at?: string | null;
        };
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
      billing_cycle: BillingCycle;
      service_modality: ServiceModality;
    };
    CompositeTypes: Record<string, never>;
  };
};
