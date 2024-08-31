'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Story } from '@/types/story'

export default function VerCuento() {
  const [story, setStory] = useState<Story | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const { id } = params

  useEffect(() => {
    const fetchStory = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/stories/${id}`)
        if (response.ok) {
          const data = await response.json()
          setStory(data)
        } else {
          setError('Error al obtener el cuento')
        }
      } catch (error) {
        console.error('Error al obtener el cuento:', error)
        setError('Error al obtener el cuento')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchStory()
    }
  }, [id])

  if (loading) {
    return <div>Cargando...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!story) {
    return <div>No se encontró el cuento</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-[#28405F]">{story.title}</h1>
      <p className="text-sm text-gray-600 mb-2">Género: {story.genre}</p>
      <p className="text-sm text-gray-600 mb-4">Creado el: {new Date(story.createdAt).toLocaleDateString()}</p>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="whitespace-pre-wrap">{story.content}</p>
      </div>
    </div>
  )
}