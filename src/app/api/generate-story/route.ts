// src/app/api/generate-story/route.ts
import { NextResponse } from 'next/server';
import { generateStory } from '../../services/chatgptService';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
    responseLimit: '8mb',
  },
}

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    console.log('Prompt recibido:', prompt); // Para depuración

    if (!prompt) {
      return NextResponse.json({ error: 'El prompt es requerido' }, { status: 400 });
    }

    const story = await generateStory(prompt);
    return NextResponse.json({ story });
  } catch (error) {
    console.error('Error en el endpoint generate-story:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Error al generar la historia', details: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Error desconocido al generar la historia' },
      { status: 500 }
    );
  }
}