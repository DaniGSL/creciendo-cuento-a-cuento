// src/app/api/generate-story/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateStory } from '@/app/services/chatgptService';

// Cambiamos el runtime a 'nodejs' para usar una función serverless
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    console.log('Prompt recibido:', prompt);

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