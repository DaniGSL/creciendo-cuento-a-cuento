'use client';

import { useState, FormEvent } from 'react';

export default function Contacto() {
  const [asunto, setAsunto] = useState<string>('');
  const [mensaje, setMensaje] = useState<string>('');
  const [estado, setEstado] = useState<string>('');

  const enviarMensaje = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEstado('');

    try {
      const respuesta = await fetch('/api/enviar-correo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          asunto,
          mensaje,
          destinatario: 'daniel.secodelucena@gmail.com',
        }),
      });

      if (respuesta.ok) {
        setEstado('Mensaje enviado. Contactaremos con usted lo antes posible. Gracias');
        setAsunto('');
        setMensaje('');
      } else {
        setEstado('Error al enviar el mensaje, vuelva a intentarlo más tarde');
      }
    } catch (error) {
      setEstado('Error al enviar el mensaje, vuelva a intentarlo más tarde');
    }
  };

  return (
    <div className="text-[#28405F] max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Contacto</h1>
      <p className="mb-4">¿Tienes alguna sugerencia? ¡Contáctanos!</p>
      
      <form onSubmit={enviarMensaje} className="space-y-4">
        <div>
          <label htmlFor="asunto" className="block mb-1">Asunto:</label>
          <input
            type="text"
            id="asunto"
            value={asunto}
            onChange={(e) => setAsunto(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="mensaje" className="block mb-1">Mensaje:</label>
          <textarea
            id="mensaje"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            required
            className="w-full p-2 border rounded h-32"
          ></textarea>
        </div>
        <button type="submit" className="bg-[#3F69D9] text-white px-4 py-2 rounded hover:bg-[#28405F]">
          Enviar mensaje
        </button>
      </form>
      
      {estado && (
        <p className={`mt-4 ${estado.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
          {estado}
        </p>
      )}
    </div>
  );
}
