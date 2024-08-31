'use client'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function Perfil() {
  const { data: session } = useSession()

  if (!session) {
    return <div>Por favor, inicia sesión para ver tu perfil.</div>
  }

  const user = session.user as any

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="container mx-auto p-4">
      
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
            {user.achievements.map((achievement: any, index: number) => (
              <li key={index} className="mb-2">
                <strong>{achievement.name}</strong>: {achievement.description}
                {achievement.dateAchieved && (
                  <span className="text-sm text-gray-500"> - Conseguido el: {new Date(achievement.dateAchieved).toLocaleDateString()}</span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>Aún no has conseguido ningún logro. ¡Sigue creando cuentos!</p>
        )}
      </div>
    </div>
  )
}