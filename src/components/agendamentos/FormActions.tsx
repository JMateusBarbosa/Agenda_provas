
import React from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  isPending: boolean;
  onSubmit: (e?: React.FormEvent) => void;
}

/**
 * Componente com os botões de ação do formulário
 * Inclui botões para salvar o agendamento e navegar para a página de resultados
 */
const FormActions = ({ isPending, onSubmit }: FormActionsProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
      <Button
        type="submit"
        className="bg-primary text-white hover:bg-primary-gold transition-colors duration-200"
        disabled={isPending}
      >
        {isPending ? "Salvando..." : "Salvar Agendamento"}
      </Button>
      <Button
        type="button"
        onClick={() => navigate("/admin/dashboard/resultados")}
        className="bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-200"
      >
        Ver Provas Pendentes
      </Button>
    </div>
  );
};

export default FormActions;
