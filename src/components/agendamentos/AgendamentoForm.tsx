
import React from "react";
import FormFields from "./FormFields";
import FormActions from "./FormActions";
import { useAgendamento } from "@/hooks/useAgendamento";

/**
 * Componente principal do formulário de agendamento
 * Gerencia o estado do formulário e a submissão de dados
 */
const AgendamentoForm = () => {
  // Custom hook para gerenciar o agendamento
  const { formData, setFormData, isPending, handleSubmit } = useAgendamento();

  // Função de submissão do formulário que chama o hook
  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <form onSubmit={onFormSubmit} className="space-y-6 mb-8">
      {/* Campos do formulário */}
      <FormFields 
        formData={formData} 
        setFormData={setFormData} 
      />

      {/* Botões de ação */}
      <FormActions 
        isPending={isPending} 
        onSubmit={handleSubmit} 
      />
    </form>
  );
};

export default AgendamentoForm;
