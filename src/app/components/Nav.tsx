'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function Nav() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="w-full flex flex-col items-center">
      <h1 className="text-xl sm:text-2xl font-bold mb-2 text-center">
        Creciendo cuento a cuento
      </h1>
      <div className="w-full flex justify-between items-center">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="sm:hidden text-white focus:outline-none"
        >
          ☰
        </button>
        <div className={`${isMenuOpen ? 'flex' : 'hidden'} sm:flex flex-col sm:flex-row w-full justify-between items-start sm:items-center mt-2 sm:mt-0`}>
          <ul className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
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
          <ul className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-2 sm:mt-0">
            {session ? (
              <li><button onClick={() => signOut()} className="block py-1 hover:underline">Cerrar sesión</button></li>
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