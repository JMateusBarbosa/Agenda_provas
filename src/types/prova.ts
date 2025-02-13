
export type ProvaStatus = "Pendente" | "Aprovado" | "Reprovado";
export type TipoProva = "P1" | "Rec.1" | "Rec.2";
export type DiasAula = "Segunda/Quarta" | "Terça/Quinta" | "Sábado" | "Segunda a Quinta";

export interface ProvaType {
  id: number;
  nomeAluno: string;
  modulo: string;
  dataProva: string;
  status: ProvaStatus;
  tipoProva: TipoProva;
  diasAula: DiasAula;
  dataRecuperacao?: string;
}
