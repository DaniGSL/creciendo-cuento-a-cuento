import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { asunto, mensaje, destinatario } = await request.json();

  // Aquí deberías implementar la lógica para enviar el correo electrónico
  // Puedes usar servicios como Nodemailer, SendGrid, etc.

  try {
    // Simula el envío de correo (reemplaza esto con tu lógica real)
    console.log('Enviando correo:', { asunto, mensaje, destinatario });
    
    // Si el envío es exitoso:
    return NextResponse.json({ mensaje: 'Correo enviado con éxito' }, { status: 200 });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    return NextResponse.json({ error: 'Error al enviar el correo' }, { status: 500 });
  }
}
