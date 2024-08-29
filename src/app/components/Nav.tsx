'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function Nav() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="relative">
      <div className="sm:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-white focus:outline-none"
        >
          ☰
        </button>
      </div>
      <ul className={`${isMenuOpen ? 'block' : 'hidden'} sm:flex sm:space-x-4 absolute sm:relative top-full left-0 bg-[#3F69D9] sm:bg-transparent w-full sm:w-auto p-2 sm:p-0`}>
        <li><Link href="/" className="block py-1 hover:underline">Inicio</Link></li>
        {session ? (
          <>
            <li><Link href="/perfil" className="block py-1 hover:underline">Perfil</Link></li>
            <li><Link href="/personajes" className="block py-1 hover:underline">Personajes</Link></li>
            <li><Link href="/generar" className="block py-1 hover:underline">Generar</Link></li>
            <li><Link href="/biblioteca" className="block py-1 hover:underline">Biblioteca</Link></li>
            <li><button onClick={() => signOut()} className="block w-full text-left py-1 hover:underline">Cerrar sesión</button></li>
          </>
        ) : (
          <>
            <li><Link href="/login" className="block py-1 hover:underline">Iniciar sesión</Link></li>
            <li><Link href="/registro" className="block py-1 hover:underline">Registrarse</Link></li>
          </>
        )}
        <li><Link href="/contacto" className="block py-1 hover:underline">Contacto</Link></li>
      </ul>
    </nav>
  )
}