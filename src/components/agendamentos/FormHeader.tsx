
import React from 'react';

/**
 * Cabeçalho do formulário de agendamento
 * Exibe o título e a descrição do formulário
 */
const FormHeader = () => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-primary mb-2">
        Agendamento de Provas
      </h1>
      <p className="text-gray-600">
        Cadastre novas provas preenchendo os campos abaixo.
      </p>
    </div>
  );
};

export default FormHeader;
