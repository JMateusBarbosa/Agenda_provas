
import { useToast } from '@/hooks/use-toast';
import { ProvaType } from '@/types/prova';
import { sugerirNovaData } from "@/utils/dateUtils";
import { useExamFetching } from './exam/useExamFetching';
import { useExamMutations } from './exam/useExamMutations';

/**
 * Custom hook principal para gerenciar resultados dos exames
 * Integra as funcionalidades de busca e mutação de dados
 */
export const useExamResults = () => {
  const { toast } = useToast();
  const { provas, isLoading } = useExamFetching();
  const { 
    updateResultMutation, 
    createRecoveryExamMutation, 
    updateExamMutation 
  } = useExamMutations();

  /**
   * Manipula a aprovação ou reprovação de um exame
   * @param provaId O ID do exame
   * @param aprovado Se o aluno foi aprovado ou não
   */
  const handleResultado = async (provaId: number, aprovado: boolean) => {
    const prova = provas?.find(p => p.id === provaId.toString());
    if (!prova) return;

    if (aprovado) {
      // Caso aprovado, atualiza status para approved
      await updateResultMutation.mutateAsync({ 
        examId: prova.id, 
        status: 'approved' 
      });
      
      toast({
        title: "Aluno Aprovado",
        description: `${prova.nomeAluno} foi aprovado no ${prova.modulo}`,
      });
    } else {
      // Caso reprovado
      const novaData = sugerirNovaData(new Date(prova.dataProva), prova.diasAula);
      let novoTipo = prova.tipoProva === "P1" ? "Rec.1" : "Rec.2";
      
      if (prova.tipoProva === "Rec.2") {
        // Se já é a segunda recuperação, reprova definitivamente
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
        // Marca como reprovado e agenda recuperação
        await updateResultMutation.mutateAsync({ 
          examId: prova.id, 
          status: 'failed',
          recoveryDate: novaData.toISOString()
        });
        
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
   * Atualiza a data de recuperação para um exame
   * @param provaId O ID do exame
   * @param novaData A nova data de recuperação
   */
  const handleDataRecuperacaoChange = async (provaId: number, novaData: Date | undefined) => {
    if (!novaData) return;
    
    const prova = provas?.find(p => p.id === provaId.toString());
    if (!prova) return;
    
    try {
      await updateResultMutation.mutateAsync({ 
        examId: prova.id,
        status: prova.status,
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

  /**
   * Atualiza informações do exame manualmente
   * @param provaId O ID do exame
   * @param dadosAtualizados Os dados atualizados do exame
   */
  const handleExamUpdate = async (provaId: number, dadosAtualizados: Partial<ProvaType>) => {
    const prova = provas?.find(p => p.id === provaId.toString());
    if (!prova) return;
    
    try {
      await updateExamMutation.mutateAsync({ 
        examId: prova.id,
        updatedData: dadosAtualizados
      });

      toast({
        title: "Exame Atualizado",
        description: "As informações do exame foram atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar exame",
        description: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  };

  return {
    provas,
    isLoading,
    handleResultado,
    handleDataRecuperacaoChange,
    handleExamUpdate
  };
};
