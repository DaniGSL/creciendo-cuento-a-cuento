import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { Story } from '@/types/story'

interface DBUser {
  id: string;
  email: string;
  username: string;
  password: string;
  registrationDate: string;
  storiesCount: number;
  charactersCount: number;
  achievements: any[];
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    console.log('POST: No autorizado')
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { title, content, genre, characters, language, readingTime } = await request.json()
  
  const story: Story = {
    id: `story_${Date.now()}`,
    userId: session.user.id,
    title,
    content,
    genre,
    characters,
    language,
    readingTime,
    createdAt: new Date().toISOString()
  }

  try {
    const storyKey = `user:${session.user.id}:story:${story.id}`
    await kv.set(storyKey, JSON.stringify(story))
    console.log(`Historia guardada: ${story.id} para el usuario ${session.user.id}`)
    
    // Verificar que la historia se guardó correctamente
    const savedStory = await kv.get(storyKey)
    console.log(`Datos guardados para la historia ${story.id}:`, savedStory)
    
    // Actualizar el contador de cuentos del usuario
    const userKey = `user:${session.user.email}`
    const user = await kv.get(userKey) as DBUser | null
    if (user) {
      user.storiesCount = (user.storiesCount || 0) + 1
      await kv.set(userKey, JSON.stringify(user))
      console.log(`Contador de historias actualizado para el usuario ${session.user.email}`)
    } else {
      console.log(`Usuario no encontrado en la base de datos: ${session.user.email}`)
    }

    return NextResponse.json({ success: true, storyId: story.id })
  } catch (error) {
    console.error('Error al guardar la historia:', error)
    return NextResponse.json({ error: 'Error al guardar la historia' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    console.log('GET: No autorizado')
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const storyKeys = await kv.keys(`user:${session.user.id}:story:*`)
    console.log(`Encontradas ${storyKeys.length} claves de historias para el usuario ${session.user.id}`)
    
    const stories: Story[] = []
    const rawData: any[] = []

    for (const key of storyKeys) {
      const storyData = await kv.get(key)
      console.log(`Datos para la clave ${key}:`, storyData)
      rawData.push({ key, data: storyData })
      
      if (typeof storyData === 'string') {
        try {
          const parsedStory = JSON.parse(storyData)
          stories.push(parsedStory)
        } catch (parseError) {
          console.error(`Error al parsear los datos de la historia ${key}:`, parseError)
        }
      } else if (storyData !== null && typeof storyData === 'object') {
        stories.push(storyData as Story)
      } else {
        console.log(`Datos no válidos para la clave ${key}`)
      }
    }

    console.log(`Recuperadas ${stories.length} historias para el usuario ${session.user.id}`)
    return NextResponse.json({ stories, rawData })
  } catch (error) {
    console.error('Error fetching stories:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}