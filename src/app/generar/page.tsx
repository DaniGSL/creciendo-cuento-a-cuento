import React from 'react';
import GenerateTaleForm from '../components/GenerateTaleForm';

export default function GenerarCuento() {
  return (
    <div className="min-h-screen bg-[#E4E9FE] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center text-[#28405F]">Generar un Nuevo Cuento</h1>
        <p className="text-lg mb-8 text-center text-[#28405F]">
          Utiliza el formulario a continuación para crear tu cuento personalizado.
        </p>
        <GenerateTaleForm />
      </div>
    </div>
  );
}