
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Action buttons component for the Results Registration page
 * Currently contains a button to navigate back to the scheduling page
 */
const ResultsActions = () => {
  const navigate = useNavigate();

  return (
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
  );
};

export default ResultsActions;
