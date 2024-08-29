'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function Nav() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="w-full">
      <div className="flex justify-center sm:justify-between items-center">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="sm:hidden text-white focus:outline-none"
        >
          ☰
        </button>
        <ul className={`${isMenuOpen ? 'flex' : 'hidden'} sm:flex flex-col sm:flex-row w-full sm:w-auto space-y-2 sm:space-y-0 sm:space-x-4 mt-2 sm:mt-0 items-center sm:items-stretch`}>
          <div className="flex flex-col sm:flex-row items-center sm:space-x-4">
            <li><Link href="/" className="block py-1 hover:underline">Inicio</Link></li>
            {session && (
              <>
                <li><Link href="/perfil" className="block py-1 hover:underline">Perfil</Link></li>
                <li><Link href="/personajes" className="block py-1 hover:underline">Personajes</Link></li>
                <li><Link href="/generar" className="block py-1 hover:underline">Generar</Link></li>
                <li><Link href="/biblioteca" className="block py-1 hover:underline">Biblioteca</Link></li>
              </>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-center sm:ml-auto">
            {session ? (
              <li><button onClick={() => signOut()} className="block w-full text-left py-1 hover:underline">Cerrar sesión</button></li>
            ) : (
              <>
                <li><Link href="/login" className="block py-1 hover:underline">Iniciar sesión</Link></li>
                <li><Link href="/registro" className="block py-1 hover:underline">Registrarse</Link></li>
              </>
            )}
            <li><Link href="/contacto" className="block py-1 hover:underline">Contacto</Link></li>
          </div>
        </ul>
      </div>
    </nav>
  )
}