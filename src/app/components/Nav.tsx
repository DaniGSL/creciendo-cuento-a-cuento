'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function Nav() {
  const { data: session } = useSession()

  return (
    <nav>
      <ul className="flex space-x-4">
        <li><Link href="/" className="hover:underline">Inicio</Link></li>
        {session ? (
          <>
            <li><Link href="/perfil" className="hover:underline">Perfil</Link></li>
            <li><Link href="/personajes" className="hover:underline">Personajes</Link></li>
            <li><Link href="/generar" className="hover:underline">Generar</Link></li>
            <li><Link href="/biblioteca" className="hover:underline">Biblioteca</Link></li>
            <li><button onClick={() => signOut()} className="hover:underline">Cerrar sesión</button></li>
          </>
        ) : (
          <>
            <li><Link href="/login" className="hover:underline">Iniciar sesión</Link></li>
            <li><Link href="/registro" className="hover:underline">Registrarse</Link></li>
          </>
        )}
        <li><Link href="/contacto" className="hover:underline">Contacto</Link></li>
      </ul>
    </nav>
  )
}
