'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'

interface Character {
  name?: string;
  description?: string;
}

interface Story {
  id: string;
  userId: string;
  title: string;
  content: string;
  genre: string;
  characters: (Character | string)[];
  language: string;
  readingTime: number;
  createdAt: string;
}

function BibliotecaContent() {
  const [stories, setStories] = useState<Story[]>([])
  const [filteredStories, setFilteredStories] = useState<Story[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [genreFilter, setGenreFilter] = useState('')
  const [characterFilter, setCharacterFilter] = useState('')
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (status === 'authenticated') {
      fetchStories()
    }
  }, [status])

  useEffect(() => {
    const character = searchParams?.get('character')
    if (character) {
      setCharacterFilter(decodeURIComponent(character))
    }
  }, [searchParams])

  useEffect(() => {
    const filtered = stories.filter(story => {
      const titleMatch = story.title.toLowerCase().includes(searchTerm.toLowerCase())
      const contentMatch = story.content.toLowerCase().includes(searchTerm.toLowerCase())
      const genreMatch = story.genre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .includes(genreFilter.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
      
      const characterMatch = characterFilter === '' || story.characters.some(char => {
        if (typeof char === 'string') {
          return char.toLowerCase().includes(characterFilter.toLowerCase())
        } else if (char && typeof char === 'object') {
          return (char.name && char.name.toLowerCase().includes(characterFilter.toLowerCase())) ||
                 (char.description && char.description.toLowerCase().includes(characterFilter.toLowerCase()))
        }
        return false
      })

      return (titleMatch || contentMatch) && genreMatch && characterMatch
    })
    setFilteredStories(filtered)
  }, [searchTerm, genreFilter, characterFilter, stories])

  const fetchStories = async () => {
    try {
      const response = await fetch('/api/stories')
      if (response.ok) {
        const data = await response.json()
        console.log('Datos recibidos de la API:', data)
        if (Array.isArray(data.stories)) {
          setStories(data.stories)
          setFilteredStories(data.stories)
        } else {
          console.error('Los datos recibidos no son un array:', data)
          setStories([])
          setFilteredStories([])
        }
      } else {
        console.error('Error fetching stories:', await response.text())
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleGenreFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGenreFilter(e.target.value)
  }

  const handleCharacterFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCharacterFilter(e.target.value)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setGenreFilter('')
    setCharacterFilter('')
    router.push('/biblioteca')
  }

  const handleStoryClick = (storyId: string) => {
    router.push(`/cuento/${storyId}`)
  }

  const handleDeleteStory = async (storyId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este cuento?')) {
      try {
        const response = await fetch(`/api/stories/${storyId}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          setStories(stories.filter(story => story.id !== storyId))
          setFilteredStories(filteredStories.filter(story => story.id !== storyId))
        } else {
          console.error('Error al eliminar el cuento')
        }
      } catch (error) {
        console.error('Error al eliminar el cuento:', error)
      }
    }
  }

  const renderCharacters = (characters: (Character | string)[]) => {
    return characters.map(char => {
      if (typeof char === 'string') return char
      if (char && char.name) return char.name
      return ''
    }).filter(Boolean).join(', ')
  }

  if (status === 'loading') {
    return <div className="text-center mt-8">Cargando...</div>
  }

  if (status === 'unauthenticated') {
    return <div className="text-center mt-8">Por favor, inicia sesión para ver tu biblioteca.</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-[#28405F]">Mi Biblioteca</h1>
      
      <div className="mb-4 flex flex-wrap items-center">
        <input
          type="text"
          placeholder="Buscar cuentos..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full sm:w-auto flex-grow sm:flex-grow-0 p-2 border rounded mr-2 mb-2 sm:mb-0"
        />
        <input
          type="text"
          placeholder="Filtrar por género..."
          value={genreFilter}
          onChange={handleGenreFilter}
          className="w-full sm:w-auto flex-grow sm:flex-grow-0 p-2 border rounded mr-2 mb-2 sm:mb-0"
        />
        <input
          type="text"
          placeholder="Filtrar por personaje..."
          value={characterFilter}
          onChange={handleCharacterFilter}
          className="w-full sm:w-auto flex-grow sm:flex-grow-0 p-2 border rounded mr-2 mb-2 sm:mb-0"
        />
        <button
          onClick={clearFilters}
          className="w-full sm:w-auto px-4 py-2 bg-[#3D8BF2] text-white rounded hover:bg-[#3F69D9]"
        >
          Borrar filtros
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStories.map((story) => (
          <div
            key={story.id}
            className="bg-white rounded-lg shadow p-4"
          >
            <h2 className="text-xl font-semibold mb-2 text-[#3F69D9]">{story.title}</h2>
            <p className="text-gray-600 mb-2">{story.content.substring(0, 100)}...</p>
            <p className="text-gray-600 mb-2">Género: {story.genre}</p>
            <p className="text-gray-600 mb-2">Idioma: {story.language}</p>
            <p className="text-gray-600">Personajes: {renderCharacters(story.characters)}</p>
            <p className="text-gray-500 text-sm mt-2">Creado el: {new Date(story.createdAt).toLocaleDateString()}</p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => handleStoryClick(story.id)}
                className="text-[#3F69D9] hover:underline"
              >
                Leer
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteStory(story.id);
                }}
                className="text-red-500 hover:underline"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredStories.length === 0 && (
        <p className="text-center mt-8">No se encontraron cuentos. ¡Crea uno nuevo!</p>
      )}

      <div className="mt-8">
        <Link href="/generar" className="bg-[#3F69D9] text-white px-4 py-2 rounded hover:bg-[#28405F]">
          Crear nuevo cuento
        </Link>
      </div>
    </div>
  )
}

export default function Biblioteca() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <BibliotecaContent />
    </Suspense>
  )
}