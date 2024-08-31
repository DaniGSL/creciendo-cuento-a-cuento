'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Story } from '@/types/story'

const ITEMS_PER_PAGE = 10;

export default function Biblioteca() {
  const [stories, setStories] = useState<Story[]>([])
  const [filteredStories, setFilteredStories] = useState<Story[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [genreFilter, setGenreFilter] = useState('')
  const [characterFilter, setCharacterFilter] = useState('')
  const { data: session } = useSession()

  useEffect(() => {
    if (session) {
      fetchStories()
    }
  }, [session])

  const fetchStories = async () => {
    try {
      const response = await fetch('/api/stories')
      if (response.ok) {
        const data = await response.json()
        setStories(data)
      } else {
        console.error('Error al obtener los cuentos')
      }
    } catch (error) {
      console.error('Error al obtener los cuentos:', error)
    }
  }

  const filterStories = useCallback(() => {
    let filtered = stories;
    if (genreFilter) {
      filtered = filtered.filter(story => story.genre.toLowerCase().includes(genreFilter.toLowerCase()));
    }
    if (characterFilter) {
      filtered = filtered.filter(story => 
        story.characters.some((char: string) => char.toLowerCase().includes(characterFilter.toLowerCase()))
      );
    }
    setFilteredStories(filtered);
  }, [stories, genreFilter, characterFilter]);

  useEffect(() => {
    filterStories();
  }, [filterStories]);

  const handleDeleteStory = async (storyId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este cuento?')) {
      try {
        const response = await fetch(`/api/stories/${storyId}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          setStories(stories.filter(story => story.id !== storyId))
        } else {
          console.error('Error al eliminar el cuento')
        }
      } catch (error) {
        console.error('Error al eliminar el cuento:', error)
      }
    }
  }

  const pageCount = Math.ceil(filteredStories.length / ITEMS_PER_PAGE);
  const paginatedStories = filteredStories.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (!session) {
    return <div>Por favor, inicia sesión para ver tu biblioteca.</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-[#28405F]">Tu Biblioteca</h1>
      
      <div className="mb-4 flex space-x-4">
        <input
          type="text"
          placeholder="Filtrar por género"
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Filtrar por personaje"
          value={characterFilter}
          onChange={(e) => setCharacterFilter(e.target.value)}
          className="p-2 border rounded"
        />
      </div>

      {paginatedStories.length === 0 ? (
        <p>No se encontraron cuentos. ¡Empieza a crear!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedStories.map((story) => (
            <div key={story.id} className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-semibold mb-2 text-[#3F69D9]">{story.title}</h2>
              <p className="text-sm text-gray-600 mb-2">Género: {story.genre}</p>
              <p className="text-sm text-gray-600 mb-2">Idioma: {story.language}</p>
              <p className="text-sm text-gray-600 mb-2">Tiempo de lectura: {story.readingTime} minutos</p>
              <p className="text-sm text-gray-600 mb-2">Creado el: {new Date(story.createdAt).toLocaleDateString()}</p>
              <div className="mt-4">
                <Link href={`/cuento/${story.id}`} className="text-[#3F69D9] hover:underline mr-4">
                  Leer
                </Link>
                <button
                  onClick={() => handleDeleteStory(story.id)}
                  className="text-red-500 hover:underline"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {pageCount > 1 && (
        <div className="mt-6 flex justify-center space-x-2">
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page ? 'bg-[#3F69D9] text-white' : 'bg-gray-200'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}