
/**
 * Tipos de dias de aula
 */
export type DiasAula = "Segunda a Quinta" | "Segunda e Quarta" | "Terça e Quinta" | "Sábado";

/**
 * Status possíveis para uma prova
 */
export type StatusProva = 'pending' | 'approved' | 'failed';

/**
 * Tipos de prova
 */
export type TipoProva = 'P1' | 'Rec.1' | 'Rec.2';

/**
 * Turnos disponíveis
 */
export type Turno = 'morning' | 'afternoon';

/**
 * Interface que define a estrutura de dados de uma prova
 */
export interface ProvaType {
  id: string;                // Identificador único da prova
  nomeAluno: string;         // Nome do aluno
  modulo: string;            // Módulo da prova
  dataProva: string;         // Data da prova (formato ISO)
  status: StatusProva;       // Status da prova (pending, approved, failed)
  tipoProva: TipoProva;      // Tipo da prova (P1, Rec.1, Rec.2)
  diasAula: DiasAula;        // Padrão de dias de aula
  computer_number: number;   // Número do computador
  shift: Turno;              // Turno (manhã ou tarde)
  class_time: string;        // Horário da aula detalhado
  created_by: string;        // ID do usuário que criou o agendamento
  recovery_date?: string;    // Data de recuperação (opcional)
}

/**
 * Interface para exames no formato do Supabase
 */
export interface ExamRecord {
  id: string;
  student_name: string;
  exam_date: string;
  computer_number: number;
  shift: Turno;
  class_time: string;
  exam_type: TipoProva;
  status: StatusProva;
  recovery_date?: string;
  created_by: string;
  created_at?: string;
  updated_at?: string;
  module?: string;          // Campo opcional para o módulo
}
