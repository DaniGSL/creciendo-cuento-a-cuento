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
    console.log('No autorizado: sesión o usuario no encontrado')
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  console.log('Usuario autenticado:', session.user.id)

  const storyKey = `user:${session.user.id}:story:${params.id}`
  console.log('Buscando cuento con clave:', storyKey)

  const storyData = await kv.get(storyKey)
  console.log(`Datos del cuento para la clave ${storyKey}:`, storyData)

  if (!storyData) {
    console.log(`Cuento no encontrado para la clave ${storyKey}`)
    return NextResponse.json({ error: 'Cuento no encontrado' }, { status: 404 })
  }

  let story: Story;
  if (typeof storyData === 'string') {
    try {
      story = JSON.parse(storyData)
    } catch (error) {
      console.error(`Error al parsear los datos del cuento para la clave ${storyKey}:`, error)
      return NextResponse.json({ error: 'Error al obtener el cuento' }, { status: 500 })
    }
  } else if (typeof storyData === 'object') {
    story = storyData as Story
  } else {
    console.error(`Datos del cuento inválidos para la clave ${storyKey}:`, storyData)
    return NextResponse.json({ error: 'Error al obtener el cuento' }, { status: 500 })
  }

  console.log('Cuento encontrado:', story)
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

  const storyKey = `user:${session.user.id}:story:${params.id}`
  const storyData = await kv.get(storyKey)

  if (!storyData) {
    return NextResponse.json({ error: 'Cuento no encontrado' }, { status: 404 })
  }

  let story: Story;
  if (typeof storyData === 'string') {
    try {
      story = JSON.parse(storyData)
    } catch (error) {
      console.error(`Error al parsear los datos del cuento para la clave ${storyKey}:`, error)
      return NextResponse.json({ error: 'Error al eliminar el cuento' }, { status: 500 })
    }
  } else if (typeof storyData === 'object') {
    story = storyData as Story
  } else {
    return NextResponse.json({ error: 'Error al eliminar el cuento' }, { status: 500 })
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