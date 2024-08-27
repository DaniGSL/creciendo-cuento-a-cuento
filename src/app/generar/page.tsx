// src/app/generar/page.tsx
'use client';

import GenerateTaleForm from '../components/GenerateTaleForm';

export default function GenerarCuento() {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-4 text-[#28405F]">Generar un Nuevo Cuento</h1>
      <GenerateTaleForm />
    </div>
  );
}