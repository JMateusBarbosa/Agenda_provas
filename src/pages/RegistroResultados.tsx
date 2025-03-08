
import { ResultsTable } from "@/components/ResultsTable";
import ResultsHeader from "@/components/resultados/ResultsHeader";
import ResultsActions from "@/components/resultados/ResultsActions";
import { useExamResults } from "@/hooks/useExamResults";

/**
 * Página de Registro de Resultados
 * 
 * Esta página permite aos administradores:
 * 1. Visualizar provas pendentes
 * 2. Registrar aprovação ou reprovação de alunos
 * 3. Definir datas para provas de recuperação
 */
const RegistroResultados = () => {
  // Custom hook para gerenciar os resultados das provas
  const { provas, isLoading, handleResultado, handleDataRecuperacaoChange } = useExamResults();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Carregando provas pendentes...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 animate-fade-in">
      {/* Cabeçalho da página */}
      <ResultsHeader />

      {/* Tabela de provas pendentes */}
      <ResultsTable
        provas={provas || []}
        onResultado={handleResultado}
        onDataRecuperacaoChange={handleDataRecuperacaoChange}
      />

      {/* Botões de ação */}
      <ResultsActions />
    </div>
  );
};

export default RegistroResultados;
