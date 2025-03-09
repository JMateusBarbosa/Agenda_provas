
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { ProvaType } from '@/types/prova';

/**
 * Custom hook para gerenciar as operações de mutação de exames
 * Contém as funções para atualizar resultados, criar recuperações e editar exames
 */
export const useExamMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  /**
   * Mutation para atualizar o resultado do exame no banco de dados
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
   * Mutation para criar um novo exame de recuperação no banco de dados
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
   * Mutation para atualizar informações do exame manualmente
   */
  const updateExamMutation = useMutation({
    mutationFn: async ({ 
      examId, 
      updatedData 
    }: { 
      examId: string; 
      updatedData: Partial<ProvaType>; 
    }) => {
      console.log("Updating exam information manually:", { examId, updatedData });
      
      if (!supabase) {
        throw new Error("Cliente Supabase não inicializado");
      }
      
      try {
        const examData: any = {};
        
        if (updatedData.nomeAluno !== undefined) examData.student_name = updatedData.nomeAluno;
        if (updatedData.dataProva !== undefined) examData.exam_date = updatedData.dataProva;
        if (updatedData.status !== undefined) examData.status = updatedData.status;
        if (updatedData.tipoProva !== undefined) examData.exam_type = updatedData.tipoProva;
        if (updatedData.recovery_date !== undefined) examData.recovery_date = updatedData.recovery_date;
        
        examData.updated_at = new Date().toISOString();

        console.log("Formatted data for Supabase update:", examData);

        const { error } = await supabase
          .from('exams')
          .update(examData)
          .eq('id', examId);

        if (error) {
          console.error("Error updating exam information:", error);
          throw new Error(error.message || "Erro ao atualizar informações do exame");
        }
      } catch (error: any) {
        console.error("Error updating exam information:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-exams'] });
      queryClient.invalidateQueries({ queryKey: ['recent-exams'] });
      queryClient.invalidateQueries({ queryKey: ['admin-exams'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar informações",
        description: error instanceof Error ? error.message : "Erro desconhecido",
      });
    },
  });

  return {
    updateResultMutation,
    createRecoveryExamMutation,
    updateExamMutation
  };
};
