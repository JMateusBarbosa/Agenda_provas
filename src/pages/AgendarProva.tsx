
import AgendamentoForm from "@/components/agendamentos/AgendamentoForm";
import RecentExamsTable from "@/components/agendamentos/RecentExamsTable";

const AgendarProva = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Agendamento de Provas
        </h1>
        <p className="text-gray-600">
          Cadastre novas provas preenchendo os campos abaixo.
        </p>
      </div>

      <AgendamentoForm />
      <RecentExamsTable />
    </div>
  );
};

export default AgendarProva;
