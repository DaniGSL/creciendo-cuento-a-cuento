import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { kv } from '@vercel/kv';

interface Character {
  id: string;
  name: string;
  description: string;
  storyCount: number;
}

interface Story {
  id: string;
  title: string;
  content: string;
  characters?: string[]; // Hacemos que characters sea opcional
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const userId = session.user.id;
  try {
    const charactersKeys = await kv.keys(`user:${userId}:character:*`);
    const characters: Character[] = [];

    for (const key of charactersKeys) {
      const character = await kv.get(key) as Omit<Character, 'storyCount'>;
      if (character) {
        // Obtener el conteo de cuentos para este personaje
        const storyKeys = await kv.keys(`user:${userId}:story:*`);
        let storyCount = 0;
        for (const storyKey of storyKeys) {
          const story = await kv.get(storyKey) as Story;
          if (story && story.characters && story.characters.includes(character.name)) {
            storyCount++;
          }
        }
        characters.push({ ...character, storyCount });
      }
    }

    return NextResponse.json(characters);
  } catch (error) {
    console.error('Error fetching characters:', error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const userId = session.user.id;
  const character: Omit<Character, 'id' | 'storyCount'> = await req.json();

  if (!character.name || !character.description) {
    return NextResponse.json({ error: "Nombre y descripción son requeridos" }, { status: 400 });
  }

  const newCharacter: Character = {
    id: `${Date.now()}`,
    name: character.name,
    description: character.description,
    storyCount: 0
  };

  try {
    await kv.set(`user:${userId}:character:${newCharacter.id}`, newCharacter);
    return NextResponse.json(newCharacter, { status: 201 });
  } catch (error) {
    console.error('Error saving character:', error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
  
    const userId = session.user.id;
    const url = new URL(req.url);
    const characterId = url.pathname.split('/').pop();
  
    if (!characterId) {
      return NextResponse.json({ error: "ID de personaje no proporcionado" }, { status: 400 });
    }
  
    try {
      const characterKey = `user:${userId}:character:${characterId}`;
      const deleted = await kv.del(characterKey);
  
      if (deleted) {
        return NextResponse.json({ message: "Personaje eliminado con éxito" }, { status: 200 });
      } else {
        return NextResponse.json({ error: "Personaje no encontrado" }, { status: 404 });
      }
    } catch (error) {
      console.error('Error deleting character:', error);
      return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
  }