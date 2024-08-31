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

  await kv.set(`story:${story.id}`, JSON.stringify(story))
  
  // Actualizar el contador de cuentos del usuario
  const userKey = `user:${session.user.email}`
  const user = await kv.get(userKey) as DBUser | null
  if (user) {
    user.storiesCount = (user.storiesCount || 0) + 1
    await kv.set(userKey, JSON.stringify(user))
  }

  return NextResponse.json({ success: true, storyId: story.id })
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const storyKeys = await kv.keys(`story:*`)
  console.log('Story keys:', storyKeys)

  const userStories = await Promise.all(
    storyKeys.map(async (key) => {
      const storyData = await kv.get(key)
      console.log(`Story data for key ${key}:`, storyData)
      
      let story: Story;
      if (typeof storyData === 'string') {
        try {
          story = JSON.parse(storyData)
        } catch (error) {
          console.error(`Error parsing story data for key ${key}:`, error)
          return null
        }
      } else if (storyData && typeof storyData === 'object') {
        story = storyData as Story
      } else {
        console.error(`Invalid story data for key ${key}:`, storyData)
        return null
      }

      return story.userId === session.user.id ? story : null
    })
  )

  console.log('User stories:', userStories)

  return NextResponse.json(userStories.filter(Boolean))
}