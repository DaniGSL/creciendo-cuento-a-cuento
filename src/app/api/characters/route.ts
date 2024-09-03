import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { kv } from '@vercel/kv';

interface Character {
  id: string;
  name: string;
  description: string;
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
      const character = await kv.get(key);
      if (character) {
        characters.push(character as Character);
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
  const character: Omit<Character, 'id'> = await req.json();

  if (!character.name || !character.description) {
    return NextResponse.json({ error: "Nombre y descripción son requeridos" }, { status: 400 });
  }

  const newCharacter: Character = {
    id: `${Date.now()}`,
    name: character.name,
    description: character.description,
  };

  try {
    await kv.set(`user:${userId}:character:${newCharacter.id}`, newCharacter);
    return NextResponse.json(newCharacter, { status: 201 });
  } catch (error) {
    console.error('Error saving character:', error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}