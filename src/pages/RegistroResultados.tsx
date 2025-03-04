
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ResultsTable } from "@/components/ResultsTable";
import { sugerirNovaData } from "@/utils/dateUtils";
import { supabase } from "@/lib/supabase";
import { ProvaType } from "@/types/prova";

const RegistroResultados = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar provas pendentes
  const { data: provas, isLoading } = useQuery({
    queryKey: ['pending-exams'],
    queryFn: async () => {
      if (!supabase) throw new Error("Cliente Supabase não inicializado");

      const { data, error } = await supabase
        .from('exams')
        .select(`*`)
        .eq('status', 'pending')
        .order('exam_date', { ascending: true });

      if (error) throw error;

      return data.map(exam => ({
        id: exam.id,
        nomeAluno: exam.student_name,
        modulo: "Módulo",
        dataProva: exam.exam_date.split('T')[0],
        status: exam.status,
        tipoProva: exam.exam_type,
        diasAula: exam.class_time.includes("Sábado") ? "Sábado" : "Segunda a Quinta",
        student_id: "", // Esta coluna não existe mais
        computer_number: exam.computer_number,
        shift: exam.shift,
        class_time: exam.class_time,
        created_by: exam.created_by,
        recovery_date: exam.recovery_date
      })) as ProvaType[];
    },
  });

  // Mutation para atualizar resultado
  const updateResultMutation = useMutation({
    mutationFn: async ({ 
      examId, 
      status, 
      recoveryDate 
    }: { 
      examId: string; 
      status: 'approved' | 'failed' | 'pending'; 
      recoveryDate?: string;
    }) => {
      if (!supabase) throw new Error("Cliente Supabase não inicializado");

      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };

      if (recoveryDate) {
        updateData.recovery_date = recoveryDate;
      }

      const { error } = await supabase
        .from('exams')
        .update(updateData)
        .eq('id', examId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-exams'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar resultado",
        description: error instanceof Error ? error.message : "Erro desconhecido",
      });
    },
  });

  const handleResultado = async (provaId: number, aprovado: boolean) => {
    const prova = provas?.find(p => p.id === provaId.toString());
    if (!prova) return;

    if (aprovado) {
      await updateResultMutation.mutateAsync({ 
        examId: prova.id, 
        status: 'approved' 
      });
      
      toast({
        title: "Aluno Aprovado",
        description: `${prova.nomeAluno} foi aprovado no ${prova.modulo}`,
      });
    } else {
      const novaData = sugerirNovaData(new Date(prova.dataProva), prova.diasAula);
      let novoTipo = prova.tipoProva === "P1" ? "Rec.1" : "Rec.2";
      
      if (prova.tipoProva === "Rec.2") {
        await updateResultMutation.mutateAsync({ 
          examId: prova.id, 
          status: 'failed' 
        });
        
        toast({
          title: "Aluno Reprovado",
          description: `${prova.nomeAluno} foi reprovado no ${prova.modulo} e precisará refazer o módulo`,
          variant: "destructive",
        });
      } else {
        await updateResultMutation.mutateAsync({ 
          examId: prova.id, 
          status: 'failed',
          recoveryDate: novaData.toISOString()
        });
        
        // Criar novo agendamento para recuperação
        if (supabase) {
          const { error: createError } = await supabase
            .from('exams')
            .insert({
              student_name: prova.nomeAluno,
              exam_date: novaData.toISOString(),
              computer_number: prova.computer_number,
              shift: prova.shift,
              class_time: prova.class_time,
              exam_type: novoTipo,
              status: 'pending',
              created_by: prova.created_by
            });

          if (createError) {
            toast({
              variant: "destructive",
              title: "Erro ao agendar recuperação",
              description: createError.message,
            });
          } else {
            toast({
              title: "Recuperação Agendada",
              description: `Nova prova agendada para ${novaData.toLocaleDateString()}`,
            });
          }
        }
      }
    }
  };

  const handleDataRecuperacaoChange = async (provaId: number, novaData: Date) => {
    if (!novaData) return;
    
    const prova = provas?.find(p => p.id === provaId.toString());
    if (!prova) return;
    
    try {
      await updateResultMutation.mutateAsync({ 
        examId: prova.id,
        status: 'pending',
        recoveryDate: novaData.toISOString()
      });

      toast({
        title: "Data Atualizada",
        description: "A nova data de recuperação foi salva com sucesso.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar data",
        description: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Carregando provas pendentes...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 animate-fade-in">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-primary mb-2">
          Registro de Resultados
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Registre o status das provas e defina datas de recuperação, se necessário.
        </p>
      </div>

      <ResultsTable
        provas={provas || []}
        onResultado={handleResultado}
        onDataRecuperacaoChange={handleDataRecuperacaoChange}
      />

      <div className="mt-6 flex flex-col md:flex-row justify-end space-y-4 md:space-y-0 md:space-x-4">
        <Button
          onClick={() => navigate("/admin/dashboard/agendar")}
          variant="outline"
          className="w-full md:w-auto"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Voltar ao Agendamento
        </Button>
      </div>
    </div>
  );
};

export default RegistroResultados;
