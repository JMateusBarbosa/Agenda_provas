
/**
 * Interface para os dados do formulário de agendamento
 */
export interface FormData {
  nomeAluno: string;
  examDate: Date;
  computerNumber: string;
  shift: string;
  classTime: string;
  examType: "P1" | "Rec.1" | "Rec.2";
}
