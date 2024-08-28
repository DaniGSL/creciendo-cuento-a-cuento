// src/app/services/chatgptService.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 60000, // 60 segundos
  maxRetries: 3,
});

export async function generateStory(prompt: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    console.error('La clave de API de OpenAI no está configurada');
    throw new Error('Configuración de API incompleta');
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {"role": "system", "content": "You are a helpful assistant that generates creative stories for children."},
        {"role": "user", "content": prompt}
      ],
      max_tokens: 2000, // Aumentado para permitir historias más largas
      temperature: 0.7,
    });

    return response.choices[0].message.content || 'No se pudo generar una historia.';
  } catch (error) {
    console.error('Error al generar la historia:', error);
    if (error instanceof Error) {
      throw new Error(`No se pudo generar la historia: ${error.message}`);
    }
    throw new Error('No se pudo generar la historia debido a un error desconocido');
  }
}