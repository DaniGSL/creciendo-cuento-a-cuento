import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { Story } from '@/types/story'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const storyKey = `story:${params.id}`
  const storyData = await kv.get(storyKey)
  
  console.log(`Story data for key ${storyKey}:`, storyData)

  let story: Story;
  if (typeof storyData === 'string') {
    try {
      story = JSON.parse(storyData)
    } catch (error) {
      console.error(`Error parsing story data for key ${storyKey}:`, error)
      return NextResponse.json({ error: 'Error al obtener el cuento' }, { status: 500 })
    }
  } else if (storyData && typeof storyData === 'object') {
    story = storyData as Story
  } else {
    console.error(`Invalid story data for key ${storyKey}:`, storyData)
    return NextResponse.json({ error: 'Cuento no encontrado' }, { status: 404 })
  }

  if (!story || story.userId !== session.user.id) {
    return NextResponse.json({ error: 'Cuento no encontrado' }, { status: 404 })
  }

  return NextResponse.json(story)
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const storyKey = `story:${params.id}`
  const storyData = await kv.get(storyKey)

  let story: Story;
  if (typeof storyData === 'string') {
    try {
      story = JSON.parse(storyData)
    } catch (error) {
      console.error(`Error parsing story data for key ${storyKey}:`, error)
      return NextResponse.json({ error: 'Error al eliminar el cuento' }, { status: 500 })
    }
  } else if (storyData && typeof storyData === 'object') {
    story = storyData as Story
  } else {
    return NextResponse.json({ error: 'Cuento no encontrado' }, { status: 404 })
  }

  if (!story || story.userId !== session.user.id) {
    return NextResponse.json({ error: 'Cuento no encontrado' }, { status: 404 })
  }

  await kv.del(storyKey)

  // Actualizar el contador de cuentos del usuario
  const userKey = `user:${session.user.email}`
  const userData = await kv.get(userKey)
  if (userData) {
    const user = typeof userData === 'string' ? JSON.parse(userData) : userData
    user.storiesCount = Math.max((user.storiesCount || 1) - 1, 0)
    await kv.set(userKey, JSON.stringify(user))
  }

  return NextResponse.json({ success: true })
}