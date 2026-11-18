export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string | null;
          role: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email?: string | null;
          role?: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          email?: string | null;
          role?: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          event_name: string;
          description: string | null;
          location: string;
          event_date: string;
          start_time: string;
          end_time: string;
          expected_attendance: number;
          number_of_teams: number;
          budget_limit: number;
          current_budget: number;
          event_status: string;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          event_name: string;
          description?: string | null;
          location?: string;
          event_date?: string;
          start_time?: string;
          end_time?: string;
          expected_attendance?: number;
          number_of_teams?: number;
          budget_limit?: number;
          current_budget?: number;
          event_status?: string;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          event_name?: string;
          description?: string | null;
          location?: string;
          event_date?: string;
          start_time?: string;
          end_time?: string;
          expected_attendance?: number;
          number_of_teams?: number;
          budget_limit?: number;
          current_budget?: number;
          event_status?: string;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      event_members: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          role: string;
          membership_status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          user_id: string;
          role?: string;
          membership_status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          user_id?: string;
          role?: string;
          membership_status?: string;
          created_at?: string;
        };
      };
      shared_event_plans: {
        Row: {
          id: string;
          event_id: string;
          version: number;
          is_valid: boolean;
          event_details: Json;
          venue_details: Json;
          catering_details: Json;
          budget_details: Json;
          schedule_details: Json;
          judging_details: Json;
          staff_details: Json;
          requirements: Json;
          risks: Json;
          pending_questions: Json;
          last_updated_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          version?: number;
          is_valid?: boolean;
          event_details?: Json;
          venue_details?: Json;
          catering_details?: Json;
          budget_details?: Json;
          schedule_details?: Json;
          judging_details?: Json;
          staff_details?: Json;
          requirements?: Json;
          risks?: Json;
          pending_questions?: Json;
          last_updated_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          version?: number;
          is_valid?: boolean;
          event_details?: Json;
          venue_details?: Json;
          catering_details?: Json;
          budget_details?: Json;
          schedule_details?: Json;
          judging_details?: Json;
          staff_details?: Json;
          requirements?: Json;
          risks?: Json;
          pending_questions?: Json;
          last_updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          event_id: string;
          user_id: string | null;
          sender_name: string;
          sender_role: string;
          message_content: string;
          source_type: string;
          processing_status: string;
          decision_status: string | null;
          decision_reason: string | null;
          affected_sections: Json;
          language: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          user_id?: string | null;
          sender_name?: string;
          sender_role?: string;
          message_content: string;
          source_type?: string;
          processing_status?: string;
          decision_status?: string | null;
          decision_reason?: string | null;
          affected_sections?: Json;
          language?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          user_id?: string | null;
          sender_name?: string;
          sender_role?: string;
          message_content?: string;
          source_type?: string;
          processing_status?: string;
          decision_status?: string | null;
          decision_reason?: string | null;
          affected_sections?: Json;
          language?: string | null;
          created_at?: string;
        };
      };
      plan_change_history: {
        Row: {
          id: string;
          event_id: string;
          message_id: string | null;
          changed_by: string;
          changed_by_role: string;
          affected_section: string;
          previous_value: string | null;
          new_value: string | null;
          change_reason: string;
          status: string;
          ai_provider: string;
          ai_model: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          message_id?: string | null;
          changed_by: string;
          changed_by_role: string;
          affected_section: string;
          previous_value?: string | null;
          new_value?: string | null;
          change_reason: string;
          status?: string;
          ai_provider?: string;
          ai_model?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          message_id?: string | null;
          changed_by?: string;
          changed_by_role?: string;
          affected_section?: string;
          previous_value?: string | null;
          new_value?: string | null;
          change_reason?: string;
          status?: string;
          ai_provider?: string;
          ai_model?: string;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          event_id: string;
          recipient_role: string | null;
          recipient_user_id: string | null;
          title: string;
          message: string;
          related_change_id: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          recipient_role?: string | null;
          recipient_user_id?: string | null;
          title: string;
          message: string;
          related_change_id?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          recipient_role?: string | null;
          recipient_user_id?: string | null;
          title?: string;
          message?: string;
          related_change_id?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
      };
      ai_requests: {
        Row: {
          id: string;
          event_id: string;
          user_id: string | null;
          user_role: string;
          task_type: string;
          request_payload: Json;
          request_status: string;
          retry_count: number;
          next_retry_at: string | null;
          selected_provider: string | null;
          selected_model: string | null;
          error_type: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          user_id?: string | null;
          user_role?: string;
          task_type?: string;
          request_payload: Json;
          request_status?: string;
          retry_count?: number;
          next_retry_at?: string | null;
          selected_provider?: string | null;
          selected_model?: string | null;
          error_type?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          user_id?: string | null;
          user_role?: string;
          task_type?: string;
          request_payload?: Json;
          request_status?: string;
          retry_count?: number;
          next_retry_at?: string | null;
          selected_provider?: string | null;
          selected_model?: string | null;
          error_type?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      ai_usage_logs: {
        Row: {
          id: string;
          request_id: string | null;
          event_id: string;
          user_id: string | null;
          user_role: string | null;
          provider: string;
          model: string;
          task_type: string;
          input_tokens: number | null;
          output_tokens: number | null;
          total_tokens: number | null;
          response_time_ms: number;
          cache_hit: boolean;
          fallback_used: boolean;
          request_status: string;
          error_type: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          request_id?: string | null;
          event_id: string;
          user_id?: string | null;
          user_role?: string | null;
          provider: string;
          model: string;
          task_type?: string;
          input_tokens?: number | null;
          output_tokens?: number | null;
          total_tokens?: number | null;
          response_time_ms?: number;
          cache_hit?: boolean;
          fallback_used?: boolean;
          request_status?: string;
          error_type?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          request_id?: string | null;
          event_id?: string;
          user_id?: string | null;
          user_role?: string | null;
          provider?: string;
          model?: string;
          task_type?: string;
          input_tokens?: number | null;
          output_tokens?: number | null;
          total_tokens?: number | null;
          response_time_ms?: number;
          cache_hit?: boolean;
          fallback_used?: boolean;
          request_status?: string;
          error_type?: string | null;
          created_at?: string;
        };
      };
      ai_response_cache: {
        Row: {
          id: string;
          cache_key: string;
          event_id: string;
          task_type: string;
          request_hash: string;
          response_data: Json;
          provider: string;
          model: string;
          created_at: string;
          expires_at: string;
        };
        Insert: {
          id?: string;
          cache_key: string;
          event_id: string;
          task_type: string;
          request_hash: string;
          response_data: Json;
          provider: string;
          model: string;
          created_at?: string;
          expires_at: string;
        };
        Update: {
          id?: string;
          cache_key?: string;
          event_id?: string;
          task_type?: string;
          request_hash?: string;
          response_data?: Json;
          provider?: string;
          model?: string;
          created_at?: string;
          expires_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
