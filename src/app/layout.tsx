'use client'
import './globals.css'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { SessionProvider } from "next-auth/react"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <html lang="es">
        <body className="min-h-screen bg-gradient-to-b from-[#E4E9FE] to-[#FFFFFF]">
          <header className="bg-[#3F69D9] p-4 text-white">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold">Creciendo cuento a cuento</h1>
              <Nav />
            </div>
          </header>
          <main className="container mx-auto p-4">
            {children}
          </main>
        </body>
      </html>
    </SessionProvider>
  )
}

function Nav() {
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
