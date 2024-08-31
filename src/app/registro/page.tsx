'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { kv } from '@vercel/kv'
import bcrypt from 'bcryptjs'

export default function Registro() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = {
      id: `user_${Date.now()}`,
      username,
      email,
      password: hashedPassword,
      registrationDate: new Date().toISOString(),
      storiesCount: 0,
      charactersCount: 0,
      achievements: []
    }
    await kv.set(`user:${email}`, JSON.stringify(user))
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
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
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
