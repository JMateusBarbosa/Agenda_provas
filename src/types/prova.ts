
export type DiasAula = "Segunda a Quinta" | "Segunda e Quarta" | "Terça e Quinta" | "Sábado";

export interface ProvaType {
  id: string;
  nomeAluno: string;
  modulo: string;
  dataProva: string;
  status: 'pending' | 'approved' | 'failed';
  tipoProva: 'P1' | 'Rec.1' | 'Rec.2';
  diasAula: DiasAula;
  computer_number: number;
  shift: 'morning' | 'afternoon';
  class_time: string;
  created_by: string;
  recovery_date?: string;
}
