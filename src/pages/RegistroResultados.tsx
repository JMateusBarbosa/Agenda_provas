
import { ResultsTable } from "@/components/ResultsTable";
import ResultsHeader from "@/components/resultados/ResultsHeader";
import ResultsActions from "@/components/resultados/ResultsActions";
import { useExamResults } from "@/hooks/useExamResults";

/**
 * Página de Registro de Resultados
 * 
 * Esta página permite aos administradores:
 * 1. Visualizar provas pendentes de avaliação
 * 2. Registrar aprovação ou reprovação de alunos
 * 3. Definir datas para provas de recuperação
 * 4. Editar informações dos exames manualmente
 * 
 * A página usa o hook useExamResults para gerenciar os dados
 * e interações com o banco de dados Supabase.
 */
const RegistroResultados = () => {
  // Custom hook para gerenciar os resultados das provas
  const { 
    provas, 
    isLoading, 
    handleResultado, 
    handleDataRecuperacaoChange,
    handleExamUpdate
  } = useExamResults();

  // Exibe um estado de carregamento enquanto os dados são buscados
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground animate-pulse">
          Carregando provas pendentes...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-3 md:p-6 animate-fade-in">
      {/* Cabeçalho da página com título e descrição */}
      <ResultsHeader />

      {/* 
        Tabela de provas pendentes
        - Exibe todos os exames com status pendente
        - Permite aprovar, reprovar ou editar cada exame
        - Possibilita a alteração de datas de recuperação
      */}
      <div className="mt-6 overflow-hidden">
        <ResultsTable
          provas={provas || []}
          onResultado={handleResultado}
          onDataRecuperacaoChange={handleDataRecuperacaoChange}
          onExamUpdate={handleExamUpdate}
        />
      </div>

      {/* Botões de ação no final da página */}
      <ResultsActions />
    </div>
  );
};

export default RegistroResultados;
