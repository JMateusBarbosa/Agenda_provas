
import React from 'react';

/**
 * Header component for the Results Registration page
 * Displays the title and description of the page
 */
const ResultsHeader = () => {
  return (
    <div className="mb-6 md:mb-8">
      <h1 className="text-xl md:text-2xl font-bold text-primary mb-2">
        Registro de Resultados
      </h1>
      <p className="text-sm md:text-base text-gray-600">
        Registre o status das provas e defina datas de recuperação, se necessário.
      </p>
    </div>
  );
};

export default ResultsHeader;
