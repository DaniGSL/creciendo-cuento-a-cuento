// src/app/services/chatgptService.ts
import axios from 'axios';

const API_URL = 'https://api.openai.com/v1/chat/completions';

export async function generateStory(prompt: string): Promise<string> {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error al generar la historia:', error);
    throw new Error('No se pudo generar la historia');
  }
}