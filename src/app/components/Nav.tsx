'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Nav() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <nav className="w-full flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-2">
        <h1 className="text-xl sm:text-2xl font-bold text-center">
          Creciendo cuento a cuento
        </h1>
        {session && session.user && (
          <div className="flex items-center">
            <span className="mr-2 text-sm hidden sm:inline">{session.user.username}</span>
            <div className="w-8 h-8 rounded-full bg-[#3F69D9] flex items-center justify-center text-white text-sm font-bold">
              {getInitials(session.user.username || '')}
            </div>
          </div>
        )}
      </div>
      <div className="w-full flex flex-col sm:flex-row justify-between items-center">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="sm:hidden text-white focus:outline-none mb-2"
        >
          ☰
        </button>
        <div className={`${isMenuOpen ? 'flex' : 'hidden'} sm:flex flex-col sm:flex-row w-full justify-between items-center sm:items-center mt-2 sm:mt-0`}>
          <ul className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 items-center sm:items-start">
            <li><Link href="/" className="block py-1 hover:underline">Inicio</Link></li>
            {session && (
              <>
                <li><Link href="/perfil" className="block py-1 hover:underline">Perfil</Link></li>
                <li><Link href="/personajes" className="block py-1 hover:underline">Personajes</Link></li>
                <li><Link href="/generar" className="block py-1 hover:underline">Generar</Link></li>
                <li><Link href="/biblioteca" className="block py-1 hover:underline">Biblioteca</Link></li>
              </>
            )}
          </ul>
          <ul className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-2 sm:mt-0 items-center sm:items-start">
            {session ? (
              <li><button onClick={handleSignOut} className="block py-1 hover:underline">Cerrar sesión</button></li>
            ) : (
              <>
                <li><Link href="/login" className="block py-1 hover:underline">Iniciar sesión</Link></li>
                <li><Link href="/registro" className="block py-1 hover:underline">Registrarse</Link></li>
              </>
            )}
            <li><Link href="/contacto" className="block py-1 hover:underline">Contacto</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
