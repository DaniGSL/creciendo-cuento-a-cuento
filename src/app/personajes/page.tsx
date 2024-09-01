'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Character {
  id: string;
  name: string;
  description: string;
}

export default function Personajes() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      fetchCharacters()
    }
  }, [session])

  useEffect(() => {
    const filtered = characters.filter(character =>
      character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      character.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredCharacters(filtered)
  }, [searchTerm, characters])

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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleCharacterClick = (characterId: string) => {
    router.push(`/biblioteca?character=${characterId}`)
  }

  if (!session) {
    return <div className="text-center mt-8">Por favor, inicia sesión para ver tus personajes.</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-[#28405F]">Galería de Personajes</h1>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar personajes..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCharacters.map((character) => (
          <div
            key={character.id}
            className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleCharacterClick(character.id)}
          >
            <h2 className="text-xl font-semibold mb-2 text-[#3F69D9]">{character.name}</h2>
            <p className="text-gray-600">{character.description}</p>
          </div>
        ))}
      </div>

      {filteredCharacters.length === 0 && (
        <p className="text-center mt-8">No se encontraron personajes. ¡Crea uno nuevo en el generador de cuentos!</p>
      )}

      <div className="mt-8">
        <Link href="/generar" className="bg-[#3F69D9] text-white px-4 py-2 rounded hover:bg-[#28405F]">
          Crear nuevo personaje
        </Link>
      </div>
    </div>
  )
}