
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { ExamRecord } from "@/types/prova";

/**
 * Componente que exibe uma tabela com os agendamentos de prova mais recentes
 * Busca dados do Supabase e os exibe de forma organizada
 */
const RecentExamsTable = () => {
  const { toast } = useToast();

  // Query para buscar provas recentes
  const { data: recentExams, isLoading: loadingExams } = useQuery({
    queryKey: ['recent-exams'],
    queryFn: async () => {
      if (!supabase) throw new Error("Cliente Supabase não inicializado");
      
      console.log("Fetching recent exams");
      try {
        const { data, error } = await supabase
          .from('exams')
          .select(`*`)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) {
          console.error("Error fetching recent exams:", error);
          toast({
            variant: "destructive",
            title: "Erro ao carregar agendamentos recentes",
            description: error.message,
          });
          throw error;
        }
        
        console.log("Recent exams fetched:", data);
        return data as ExamRecord[];
      } catch (error: any) {
        console.error("Error in fetchRecentExams:", error);
        throw error;
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  /**
   * Traduz o turno para português
   */
  const translateShift = (shift: string): string => {
    return shift === 'morning' ? 'Manhã' : 'Tarde';
  };

  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold text-primary mb-4">
        Provas Agendadas Recentemente
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Aluno</th>
              <th className="p-3 text-left">Módulo</th>
              <th className="p-3 text-left">Tipo</th>
              <th className="p-3 text-left">Data</th>
              <th className="p-3 text-left">Computador</th>
              <th className="p-3 text-left">Turno</th>
              <th className="p-3 text-left">Horário</th>
            </tr>
          </thead>
          <tbody>
            {loadingExams ? (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  Carregando agendamentos recentes...
                </td>
              </tr>
            ) : recentExams && recentExams.length > 0 ? (
              recentExams.map((exam) => (
                <tr
                  key={exam.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="p-3">{exam.student_name}</td>
                  <td className="p-3">{exam.module || "Módulo"}</td>
                  <td className="p-3">{exam.exam_type}</td>
                  <td className="p-3">{format(new Date(exam.exam_date), "dd/MM/yyyy")}</td>
                  <td className="p-3">PC-{String(exam.computer_number).padStart(2, '0')}</td>
                  <td className="p-3">{translateShift(exam.shift)}</td>
                  <td className="p-3">{exam.class_time}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  Nenhum agendamento recente encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentExamsTable;
