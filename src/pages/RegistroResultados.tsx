
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ResultsTable } from "@/components/ResultsTable";
import { sugerirNovaData } from "@/utils/dateUtils";
import { ProvaType } from "@/types/prova";

const RegistroResultados = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock data - in a real app this would come from a database
  const [provas, setProvas] = useState<ProvaType[]>([
    {
      id: 1,
      nomeAluno: "João Silva",
      modulo: "JavaScript Básico",
      dataProva: "2024-04-15",
      status: "Pendente",
      tipoProva: "P1",
      diasAula: "Segunda/Quarta"
    },
    {
      id: 2,
      nomeAluno: "Maria Santos",
      modulo: "HTML e CSS",
      dataProva: "2024-04-16",
      status: "Pendente",
      tipoProva: "P1",
      diasAula: "Terça/Quinta"
    },
  ]);

  const handleResultado = (provaId: number, aprovado: boolean) => {
    setProvas(provasAtuais => {
      return provasAtuais.map(prova => {
        if (prova.id === provaId) {
          if (aprovado) {
            toast({
              title: "Aluno Aprovado",
              description: `${prova.nomeAluno} foi aprovado em ${prova.modulo}`,
            });
            return { ...prova, status: "Aprovado", dataRecuperacao: undefined };
          } else {
            const novaData = sugerirNovaData(new Date(prova.dataProva), prova.diasAula);
            let novoTipo: ProvaType["tipoProva"] = "Rec.1";
            
            if (prova.tipoProva === "Rec.1") {
              novoTipo = "Rec.2";
            } else if (prova.tipoProva === "Rec.2") {
              toast({
                title: "Aluno Reprovado",
                description: `${prova.nomeAluno} foi reprovado em ${prova.modulo} e precisará refazer o módulo`,
                variant: "destructive",
              });
              return { ...prova, status: "Reprovado", dataRecuperacao: undefined };
            }
            
            toast({
              title: "Recuperação Agendada",
              description: `Nova prova agendada para ${novaData.toLocaleDateString()}`,
            });
            
            return {
              ...prova,
              status: "Pendente",
              tipoProva: novoTipo,
              dataProva: novaData.toISOString().split('T')[0],
              dataRecuperacao: novaData.toISOString().split('T')[0]
            };
          }
        }
        return prova;
      });
    });
  };

  const handleDataRecuperacaoChange = (provaId: number, novaData: Date | undefined) => {
    if (!novaData) return;
    
    setProvas(provasAtuais => {
      return provasAtuais.map(prova => {
        if (prova.id === provaId) {
          return {
            ...prova,
            dataRecuperacao: novaData.toISOString().split('T')[0]
          };
        }
        return prova;
      });
    });

    toast({
      title: "Data Atualizada",
      description: "A nova data de recuperação foi salva com sucesso.",
    });
  };

  const salvarAlteracoes = () => {
    // Aqui você implementaria a lógica para salvar no backend
    toast({
      title: "Alterações Salvas",
      description: "Todas as alterações foram salvas com sucesso",
    });
  };

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
        provas={provas}
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
        <Button
          onClick={salvarAlteracoes}
          className="w-full md:w-auto bg-primary hover:bg-primary-gold text-white"
        >
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
};

export default RegistroResultados;
