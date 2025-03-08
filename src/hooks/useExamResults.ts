
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { ProvaType } from '@/types/prova';
import { sugerirNovaData } from "@/utils/dateUtils";

/**
 * Custom hook for managing exam results
 * Handles fetching pending exams, updating results, and creating recovery exams
 */
export const useExamResults = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  /**
   * Fetch pending exams from the database
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
          modulo: "Módulo",
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

  /**
   * Mutation for updating exam results in the database
   */
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
      console.log("Updating exam result:", { examId, status, recoveryDate });
      
      if (!supabase) {
        throw new Error("Cliente Supabase não inicializado");
      }
      
      try {
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

        if (error) {
          console.error("Error updating exam result:", error);
          throw new Error(error.message || "Erro ao atualizar resultado");
        }
      } catch (error: any) {
        console.error("Error updating exam result:", error);
        throw error;
      }
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

  /**
   * Mutation for creating a new recovery exam in the database
   */
  const createRecoveryExamMutation = useMutation({
    mutationFn: async (newExam: any) => {
      console.log("Creating recovery exam:", newExam);
      
      if (!supabase) {
        throw new Error("Cliente Supabase não inicializado");
      }
      
      const { error } = await supabase
        .from('exams')
        .insert(newExam);
        
      if (error) {
        console.error("Error creating recovery exam:", error);
        throw new Error(error.message || "Erro ao criar prova de recuperação");
      }
    },
    onSuccess: () => {
      // Invalidate relevant queries to update the UI
      queryClient.invalidateQueries({ queryKey: ['pending-exams'] });
      queryClient.invalidateQueries({ queryKey: ['recent-exams'] });
      queryClient.invalidateQueries({ queryKey: ['admin-exams'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao criar recuperação",
        description: error instanceof Error ? error.message : "Erro desconhecido",
      });
    },
  });

  /**
   * Handle approving or failing an exam
   * @param provaId The ID of the exam
   * @param aprovado Whether the student passed or failed
   */
  const handleResultado = async (provaId: number, aprovado: boolean) => {
    const prova = provas?.find(p => p.id === provaId.toString());
    if (!prova) return;

    if (aprovado) {
      // Handle student approval
      await updateResultMutation.mutateAsync({ 
        examId: prova.id, 
        status: 'approved' 
      });
      
      toast({
        title: "Aluno Aprovado",
        description: `${prova.nomeAluno} foi aprovado no ${prova.modulo}`,
      });
    } else {
      // Handle student failure and schedule recovery if needed
      const novaData = sugerirNovaData(new Date(prova.dataProva), prova.diasAula);
      let novoTipo = prova.tipoProva === "P1" ? "Rec.1" : "Rec.2";
      
      if (prova.tipoProva === "Rec.2") {
        // If this was the second recovery, mark as failed without scheduling a new recovery
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
        // For P1 or Rec.1 failures, schedule a recovery exam
        await updateResultMutation.mutateAsync({ 
          examId: prova.id, 
          status: 'failed',
          recoveryDate: novaData.toISOString()
        });
        
        // Create new recovery exam
        try {
          const newExam = {
            student_name: prova.nomeAluno,
            exam_date: novaData.toISOString(),
            computer_number: prova.computer_number,
            shift: prova.shift,
            class_time: prova.class_time,
            exam_type: novoTipo,
            status: 'pending',
            created_by: prova.created_by
          };
          
          await createRecoveryExamMutation.mutateAsync(newExam);
          
          toast({
            title: "Recuperação Agendada",
            description: `Nova prova agendada para ${novaData.toLocaleDateString()}`,
          });
        } catch (error: any) {
          console.error("Error creating recovery exam:", error);
          toast({
            variant: "destructive",
            title: "Erro ao agendar recuperação",
            description: error.message || "Falha ao criar agendamento de recuperação",
          });
        }
      }
    }
  };

  /**
   * Update the recovery date for an exam
   * @param provaId The ID of the exam
   * @param novaData The new recovery date
   */
  const handleDataRecuperacaoChange = async (provaId: number, novaData: Date | undefined) => {
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

  return {
    provas,
    isLoading,
    handleResultado,
    handleDataRecuperacaoChange
  };
};
