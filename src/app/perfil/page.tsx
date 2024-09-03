'use client'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'

interface User {
  username: string;
  email: string;
  storiesCount: number;
  charactersCount: number;
  achievements: Achievement[];
}

interface Achievement {
  name: string;
  description: string;
  dateAchieved: string;
}

interface Story {
  id: string;
  title: string;
  // Añade aquí más propiedades si son necesarias
}

export default function Perfil() {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUserData = useCallback(async () => {
    if (status === 'authenticated' && session) {
      try {
        setLoading(true)
        setError(null)

        const [storiesResponse, charactersResponse] = await Promise.all([
          fetch('/api/stories'),
          fetch('/api/characters')
        ]);

        if (storiesResponse.ok && charactersResponse.ok) {
          const storiesData: { stories: Story[] } = await storiesResponse.json();
          const charactersData = await charactersResponse.json();

          const userData: User = {
            username: session.user?.name || 'Usuario',
            email: session.user?.email || '',
            storiesCount: storiesData.stories.length,
            charactersCount: charactersData.length,
            achievements: (session.user as any)?.achievements || []
          }
          setUser(userData)
        } else {
          throw new Error('Error al obtener datos de cuentos o personajes');
        }
      } catch (error) {
        console.error('Error al procesar datos del usuario:', error)
        setError('Error al cargar los datos del usuario')
      } finally {
        setLoading(false)
      }
    } else if (status === 'unauthenticated') {
      setLoading(false)
    }
  }, [session, status])

  useEffect(() => {
    fetchUserData()
  }, [fetchUserData])

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (status === 'loading' || loading) {
    return <div className="text-center mt-8">Cargando datos del usuario...</div>
  }

  if (status === 'unauthenticated') {
    return <div className="text-center mt-8">Por favor, inicia sesión para ver tu perfil.</div>
  }

  if (error) {
    return (
      <div className="text-center mt-8">
        <p className="text-red-500">Error: {error}</p>
        <button 
          onClick={fetchUserData} 
          className="mt-4 bg-[#3F69D9] text-white px-4 py-2 rounded hover:bg-[#28405F]"
        >
          Intentar de nuevo
        </button>
      </div>
    )
  }

  if (!user) {
    return <div className="text-center mt-8">No se encontraron datos del usuario.</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-[#28405F]">Mi Perfil</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Información Personal */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-[#3F69D9]">Información Personal</h2>
          <div className="mb-4 flex items-center">
            <div className="w-16 h-16 rounded-full bg-[#3F69D9] flex items-center justify-center text-white text-2xl font-bold mr-4">
              {getInitials(user.username)}
            </div>
            <div>
              <p><strong>Nombre:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
          </div>
        </div>

        {/* Cuentos Creados */}
        <Link href="/biblioteca" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-4 text-[#3F69D9]">Cuentos Creados</h2>
          <p className="text-4xl font-bold">{user.storiesCount}</p>
        </Link>

        {/* Personajes Creados */}
        <Link href="/personajes" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-4 text-[#3F69D9]">Personajes Creados</h2>
          <p className="text-4xl font-bold">{user.charactersCount}</p>
        </Link>
      </div>

      {/* Logros */}
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-[#3F69D9]">Tus Logros</h2>
        {user.achievements && user.achievements.length > 0 ? (
          <ul className="list-disc pl-5">
            {user.achievements.map((achievement: Achievement, index: number) => (
              <li key={index} className="mb-2">
                <strong>{achievement.name}</strong>: {achievement.description}
                {achievement.dateAchieved && (
                  <span className="text-sm text-gray-500"> - Conseguido el: {new Date(achievement.dateAchieved).toLocaleDateString()}</span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>Aún no has conseguido ningún logro. ¡Sigue creando cuentos y personajes!</p>
        )}
      </div>

      {/* Acciones rápidas */}
      <div className="mt-6 flex flex-wrap gap-4">
        <Link href="/generar" className="bg-[#3F69D9] text-white px-6 py-3 rounded-lg hover:bg-[#28405F] transition-colors">
          Crear Nuevo Cuento
        </Link>
        <Link href="/personajes" className="bg-[#3D8BF2] text-white px-6 py-3 rounded-lg hover:bg-[#3F69D9] transition-colors">
          Gestionar Personajes
        </Link>
        <Link href="/biblioteca" className="bg-[#28405F] text-white px-6 py-3 rounded-lg hover:bg-[#3F69D9] transition-colors">
          Ver Biblioteca
        </Link>
      </div>
    </div>
  )
}