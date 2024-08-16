'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Registro() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí deberías implementar la lógica para registrar al usuario
    console.log('Registro:', username, password)
    // Redirigir al login después del registro
    router.push('/login')
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10">
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="w-full p-2 mb-4 border rounded"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full p-2 mb-4 border rounded"
      />
      <button type="submit" className="w-full p-2 bg-green-500 text-white rounded">
        Registrarse
      </button>
    </form>
  )
}
