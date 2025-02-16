
import { addDays } from "date-fns";
import { DiasAula } from "@/types/prova";

export const sugerirNovaData = (dataAtual: Date, diasAula: DiasAula): Date => {
  const diaSemana = dataAtual.getDay();
  let novaData = new Date(dataAtual);

  switch (diasAula) {
    case "Segunda a Quinta":
      novaData = addDays(dataAtual, 1); // Próximo dia útil
      while (novaData.getDay() > 4 || novaData.getDay() === 0) {
        novaData = addDays(novaData, 1);
      }
      break;
    case "Sábado":
      novaData = addDays(dataAtual, 7); // Próximo sábado
      break;
  }

  return novaData;
};
