
import { addDays } from "date-fns";
import { DiasAula } from "@/types/prova";

export const sugerirNovaData = (dataAtual: Date, diasAula: DiasAula): Date => {
  const diaSemana = dataAtual.getDay();
  let novaData = new Date(dataAtual);

  switch (diasAula) {
    case "Segunda/Quarta":
      if (diaSemana === 1) { // Se é segunda
        novaData = addDays(dataAtual, 2); // Próxima quarta
      } else {
        novaData = addDays(dataAtual, 5); // Próxima segunda
      }
      break;
    case "Terça/Quinta":
      if (diaSemana === 2) { // Se é terça
        novaData = addDays(dataAtual, 2); // Próxima quinta
      } else {
        novaData = addDays(dataAtual, 5); // Próxima terça
      }
      break;
    case "Sábado":
      novaData = addDays(dataAtual, 7); // Próximo sábado
      break;
    case "Segunda a Quinta":
      novaData = addDays(dataAtual, 1); // Próximo dia útil
      while (novaData.getDay() > 4 || novaData.getDay() === 0) {
        novaData = addDays(novaData, 1);
      }
      break;
  }

  return novaData;
};
