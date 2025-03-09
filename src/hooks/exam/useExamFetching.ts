
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { ProvaType } from '@/types/prova';

/**
 * Custom hook para buscar exames pendentes
 * Extrai a lógica de busca de dados do Supabase
 */
export const useExamFetching = () => {
  const { toast } = useToast();

  /**
   * Busca exames pendentes no banco de dados
   */
  const { data: provas, isLoading } = useQuery({
    queryKey: ['pending-exams'],
    queryFn: async () => {
      console.log("Fetching pending exams data");
      
      if (!supabase) {
        throw new Error("Cliente Supabase não inicializado");
      }
      
      try {
        const { data, error } = await supabase
          .from('exams')
          .select('*')
          .eq('status', 'pending')
          .order('exam_date', { ascending: true });
          
        if (error) {
          console.error("Error fetching pending exams:", error);
          throw new Error(error.message || "Erro ao buscar provas pendentes");
        }

        console.log("Pending exams data retrieved:", data);

        return data.map((exam: any) => ({
          id: exam.id,
          nomeAluno: exam.student_name,
          modulo: exam.module || "Módulo",
          dataProva: exam.exam_date,
          status: exam.status,
          tipoProva: exam.exam_type,
          diasAula: exam.class_time.includes("Sábado") ? "Sábado" : 
                   exam.class_time.includes("Segunda e Quarta") ? "Segunda e Quarta" :
                   exam.class_time.includes("Terça e Quinta") ? "Terça e Quinta" : 
                   "Segunda a Quinta",
          computer_number: exam.computer_number,
          shift: exam.shift,
          class_time: exam.class_time,
          created_by: exam.created_by,
          recovery_date: exam.recovery_date
        })) as ProvaType[];
      } catch (error: any) {
        console.error("Error fetching pending exams:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar provas",
          description: error.message || "Falha ao buscar dados",
        });
        throw error;
      }
    },
  });

  return {
    provas,
    isLoading
  };
};
