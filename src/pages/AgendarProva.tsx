
import React from 'react';
import AgendamentoForm from "@/components/agendamentos/AgendamentoForm";
import RecentExamsTable from "@/components/agendamentos/RecentExamsTable";
import FormHeader from "@/components/agendamentos/FormHeader";

/**
 * Página de Agendamento de Provas
 * 
 * Esta página permite aos administradores:
 * 1. Cadastrar novas provas
 * 2. Visualizar os agendamentos recentes
 */
const AgendarProva = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in">
      {/* Cabeçalho da página */}
      <FormHeader />

      {/* Formulário de agendamento */}
      <AgendamentoForm />
      
      {/* Tabela de agendamentos recentes */}
      <RecentExamsTable />
    </div>
  );
};

export default AgendarProva;
