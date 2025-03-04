
export type DiasAula = "Segunda a Quinta" | "Sábado";

export interface ProvaType {
  id: string;
  nomeAluno: string;
  modulo: string;
  dataProva: string;
  status: 'pending' | 'approved' | 'failed';
  tipoProva: 'P1' | 'Rec.1' | 'Rec.2';
  diasAula: DiasAula;
  student_id?: string; // Optional now as it's been removed from DB
  computer_number: number;
  shift: 'morning' | 'afternoon';
  class_time: string;
  created_by: string;
  recovery_date?: string;
}
