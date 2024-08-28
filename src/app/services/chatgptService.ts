// src/app/services/chatgptService.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
      max_tokens: 1000,
    });

    return response.choices[0].message.content || 'No se pudo generar una historia.';
  } catch (error) {
    console.error('Error al generar la historia:', error);
    throw new Error('No se pudo generar la historia');
  }
}