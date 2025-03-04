
// Definição dos tipos para o banco de dados Supabase
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // Tabela de exames
      exams: {
        Row: {
          id: string                                   // ID único do exame
          computer_number: number                      // Número do computador
          shift: "morning" | "afternoon"               // Turno do exame
          class_time: string                          // Horário da aula
          exam_type: "P1" | "Rec.1" | "Rec.2"        // Tipo do exame
          exam_date: string                           // Data do exame
          status: "pending" | "approved" | "failed"   // Status do exame
          recovery_date: string | null                // Data da recuperação (se houver)
          created_by: string                          // ID do usuário que criou
          created_at: string                          // Data de criação
          updated_at: string                          // Data de atualização
          student_name: string                        // Nome do aluno
        }
        Insert: {
          id?: string
          computer_number: number
          shift: "morning" | "afternoon"
          class_time: string
          exam_type: "P1" | "Rec.1" | "Rec.2"
          exam_date: string
          status?: "pending" | "approved" | "failed"
          recovery_date?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
          student_name: string
        }
        Update: {
          id?: string
          computer_number?: number
          shift?: "morning" | "afternoon"
          class_time?: string
          exam_type?: "P1" | "Rec.1" | "Rec.2"
          exam_date?: string
          status?: "pending" | "approved" | "failed"
          recovery_date?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
          student_name?: string
        }
      }
      // Tabela de usuários
      users: {
        Row: {
          id: string              // ID único do usuário
          email: string           // Email do usuário
          name: string           // Nome do usuário
          role: "admin" | "student" // Papel do usuário
          created_at: string      // Data de criação
          updated_at: string      // Data de atualização
        }
        Insert: {
          id?: string
          email: string
          name: string
          role?: "admin" | "student"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: "admin" | "student"
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
