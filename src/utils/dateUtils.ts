
import { addDays, isWeekend } from "date-fns";
import { DiasAula } from "@/types/prova";

/**
 * Sugere uma nova data para prova de recuperação com base na data atual e dias de aula
 * 
 * @param dataAtual Data da prova atual
 * @param diasAula Padrão de dias de aula ("Segunda a Quinta", "Segunda e Quarta", "Terça e Quinta", "Sábado")
 * @returns Data sugerida para recuperação
 */
export const sugerirNovaData = (dataAtual: Date, diasAula: DiasAula): Date => {
  const diaSemana = dataAtual.getDay(); // 0 = Domingo, 1 = Segunda, etc.
  let novaData = new Date(dataAtual);

  // Adiciona pelo menos um dia para evitar reagendar para o mesmo dia
  novaData = addDays(novaData, 1);

  switch (diasAula) {
    case "Segunda a Quinta":
      // Se cair no fim de semana ou na sexta, avança para a próxima segunda
      while (isWeekend(novaData) || novaData.getDay() === 5) {
        novaData = addDays(novaData, 1);
      }
      break;
    case "Segunda e Quarta":
      // Avança para a próxima segunda ou quarta
      while (novaData.getDay() !== 1 && novaData.getDay() !== 3) {
        novaData = addDays(novaData, 1);
      }
      break;
    case "Terça e Quinta":
      // Avança para a próxima terça ou quinta
      while (novaData.getDay() !== 2 && novaData.getDay() !== 4) {
        novaData = addDays(novaData, 1);
      }
      break;
    case "Sábado":
      // Avança para o próximo sábado
      while (novaData.getDay() !== 6) {
        novaData = addDays(novaData, 1);
      }
      break;
    default:
      // Caso padrão, adiciona 7 dias
      novaData = addDays(dataAtual, 7);
  }

  return novaData;
};

/**
 * Verifica se a data é um dia útil (segunda a sexta)
 * 
 * @param data Data a ser verificada
 * @returns true se for dia útil, false caso contrário
 */
export const ehDiaUtil = (data: Date): boolean => {
  const diaSemana = data.getDay();
  return diaSemana >= 1 && diaSemana <= 5; // Segunda a Sexta
};

/**
 * Encontra o próximo dia útil a partir de uma data
 * 
 * @param data Data base
 * @returns Próximo dia útil
 */
export const proximoDiaUtil = (data: Date): Date => {
  let proximaData = new Date(data);
  while (!ehDiaUtil(proximaData)) {
    proximaData = addDays(proximaData, 1);
  }
  return proximaData;
};
