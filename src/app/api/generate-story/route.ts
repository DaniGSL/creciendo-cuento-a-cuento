// src/app/api/generate-story/route.ts
import { NextResponse } from 'next/server';
import { generateStory } from '../../services/chatgptService';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    const story = await generateStory(prompt);
    return NextResponse.json({ story });
  } catch (error) {
    console.error('Error en el endpoint generate-story:', error);
    return NextResponse.json({ error: 'Error al generar la historia' }, { status: 500 });
  }
}