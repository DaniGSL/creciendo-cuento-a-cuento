'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Character {
  id: string;
  name: string;
  description: string;
  storyCount: number;
}

export default function Personajes() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([])
  const [nameSearchTerm, setNameSearchTerm] = useState('')
  const [descriptionSearchTerm, setDescriptionSearchTerm] = useState('')
  const [newCharacter, setNewCharacter] = useState({ name: '', description: '' })
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      fetchCharacters()
    }
  }, [session])

  useEffect(() => {
    const filtered = characters.filter(character =>
      removeAccents(character.name.toLowerCase()).includes(removeAccents(nameSearchTerm.toLowerCase())) &&
      removeAccents(character.description.toLowerCase()).includes(removeAccents(descriptionSearchTerm.toLowerCase()))
    )
    setFilteredCharacters(filtered)
  }, [nameSearchTerm, descriptionSearchTerm, characters])

  const removeAccents = (str: string) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  }

  const fetchCharacters = async () => {
    try {
      const response = await fetch('/api/characters')
      if (response.ok) {
        const data = await response.json()
        setCharacters(data)
        setFilteredCharacters(data)
      } else {
        console.error('Error fetching characters')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleNameSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameSearchTerm(e.target.value)
  }

  const handleDescriptionSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescriptionSearchTerm(e.target.value)
  }

  const handleCharacterClick = (characterName: string) => {
    router.push(`/biblioteca?character=${encodeURIComponent(characterName)}`)
  }

  const handleNewCharacterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCharacter({ ...newCharacter, [e.target.name]: e.target.value })
  }

  const handleCreateCharacter = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newCharacter.name && newCharacter.description) {
      try {
        const response = await fetch('/api/characters', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCharacter),
        })
        if (response.ok) {
          fetchCharacters()
          setNewCharacter({ name: '', description: '' })
        } else {
          console.error('Error creating character')
        }
      } catch (error) {
        console.error('Error:', error)
      }
    }
  }

  const handleDeleteCharacter = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('¿Estás seguro de que quieres eliminar este personaje?')) {
      try {
        const response = await fetch(`/api/characters/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setCharacters(characters.filter(character => character.id !== id));
          setFilteredCharacters(filteredCharacters.filter(character => character.id !== id));
        } else {
          console.error('Error al eliminar el personaje');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  if (!session) {
    return <div className="text-center mt-8">Por favor, inicia sesión para ver tus personajes.</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-[#28405F]">Galería de Personajes</h1>
      
      <div className="mb-4 flex flex-wrap">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={nameSearchTerm}
          onChange={handleNameSearch}
          className="w-full sm:w-1/2 p-2 border rounded mr-2 mb-2 sm:mb-0"
        />
        <input
          type="text"
          placeholder="Buscar por descripción..."
          value={descriptionSearchTerm}
          onChange={handleDescriptionSearch}
          className="w-full sm:w-1/2 p-2 border rounded"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCharacters.map((character) => (
          <div
            key={character.id}
            className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow relative"
            onClick={() => handleCharacterClick(character.name)}
          >
            <h2 className="text-xl font-semibold mb-2 text-[#3F69D9]">{character.name}</h2>
            <p className="text-gray-600 mb-2">{character.description}</p>
            <p className="text-gray-500">
              {character.storyCount === 1
                ? `Aparece en 1 cuento`
                : character.storyCount > 1
                ? `Aparece en ${character.storyCount} cuentos`
                : 'Sin cuentos asociados'}
            </p>
            <button
              onClick={(e) => handleDeleteCharacter(character.id, e)}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>

      {filteredCharacters.length === 0 && (
        <p className="text-center mt-8">No se encontraron personajes. ¡Crea uno nuevo!</p>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-[#28405F]">Crear Nuevo Personaje</h2>
        <form onSubmit={handleCreateCharacter} className="space-y-4">
          <input
            type="text"
            name="name"
            value={newCharacter.name}
            onChange={handleNewCharacterChange}
            placeholder="Nombre del personaje"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="description"
            value={newCharacter.description}
            onChange={handleNewCharacterChange}
            placeholder="Descripción del personaje"
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#3F69D9] text-white px-4 py-2 rounded hover:bg-[#28405F]"
          >
            Crear Personaje
          </button>
        </form>
      </div>
    </div>
  )
}