
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { FormData } from "@/types/agendamento";

/**
 * Custom hook para gerenciar o agendamento de provas
 * Gerencia o estado do formulário e as operações de banco de dados
 */
export const useAgendamento = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  // Estado inicial do formulário
  const [formData, setFormData] = useState<FormData>({
    nomeAluno: "",
    examDate: new Date(),
    computerNumber: "",
    shift: "",
    classTime: "",
    examType: "P1",
  });

  // Mutation para criar novo agendamento
  const createExamMutation = useMutation({
    mutationFn: async (examData: FormData) => {
      if (!supabase) throw new Error("Cliente Supabase não inicializado");
      if (!user?.id) throw new Error("Usuário não autenticado");

      console.log("Creating new exam:", examData);

      const { error: examError } = await supabase
        .from('exams')
        .insert({
          student_name: examData.nomeAluno,
          exam_date: examData.examDate.toISOString(),
          computer_number: parseInt(examData.computerNumber),
          shift: examData.shift,
          class_time: examData.classTime,
          exam_type: examData.examType,
          created_by: user.id,
          status: 'pending'
        });

      if (examError) {
        console.error("Error creating exam:", examError);
        throw examError;
      }
    },
    onSuccess: () => {
      // Invalidar as queries relevantes para atualizar a UI
      queryClient.invalidateQueries({ queryKey: ['recent-exams'] });
      queryClient.invalidateQueries({ queryKey: ['admin-exams'] });
      
      toast({
        title: "Agendamento realizado",
        description: "A prova foi agendada com sucesso!",
      });
      
      // Resetar o formulário
      setFormData({
        nomeAluno: "",
        examDate: new Date(),
        computerNumber: "",
        shift: "",
        classTime: "",
        examType: "P1",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao agendar",
        description: error instanceof Error ? error.message : "Erro desconhecido",
      });
    },
  });

  // Função para lidar com o envio do formulário - sem parâmetros
  const handleSubmit = () => {
    createExamMutation.mutate(formData);
  };

  return {
    formData,
    setFormData,
    isPending: createExamMutation.isPending,
    handleSubmit
  };
};
