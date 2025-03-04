
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
      console.log("Fetching pending exams data");
      
      try {
        // Usar o fetch nativo para buscar os dados
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/exams?select=*&status=eq.pending`,
          {
            method: 'GET',
            headers: {
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            }
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error fetching pending exams:", errorData);
          throw new Error(errorData.message || "Erro ao buscar provas pendentes");
        }

        const data = await response.json();
        console.log("Pending exams data retrieved:", data);

        // Ordenar por data (mais recente primeiro)
        const sortedData = data.sort((a: any, b: any) => 
          new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime()
        );

        return sortedData.map((exam: any) => ({
          id: exam.id,
          nomeAluno: exam.student_name,
          modulo: "Módulo",
          dataProva: exam.exam_date.split('T')[0],
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
      console.log("Updating exam result:", { examId, status, recoveryDate });
      
      try {
        const updateData: any = {
          status,
          updated_at: new Date().toISOString()
        };

        if (recoveryDate) {
          updateData.recovery_date = recoveryDate;
        }

        // Usar o fetch nativo para atualizar os dados
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/exams?id=eq.${examId}`,
          {
            method: 'PATCH',
            headers: {
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify(updateData)
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error updating exam result:", errorData);
          throw new Error(errorData.message || "Erro ao atualizar resultado");
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
        
        // Criar novo agendamento para recuperação usando fetch nativo
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
          
          const response = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/exams`,
            {
              method: 'POST',
              headers: {
                'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
              },
              body: JSON.stringify(newExam)
            }
          );
          
          if (!response.ok) {
            const errorData = await response.json();
            console.error("Error creating recovery exam:", errorData);
            toast({
              variant: "destructive",
              title: "Erro ao agendar recuperação",
              description: errorData.message || "Falha ao criar agendamento de recuperação",
            });
          } else {
            toast({
              title: "Recuperação Agendada",
              description: `Nova prova agendada para ${novaData.toLocaleDateString()}`,
            });
          }
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
