import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { kv } from '@vercel/kv'
import bcrypt from 'bcryptjs'

interface DBUser {
  id: string;
  email: string;
  username: string;
  password: string;
  registrationDate: string;
  storiesCount: number;
  charactersCount: number;
  achievements: any[];
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        const user = await kv.get(`user:${credentials.email}`) as DBUser | null
        if (!user) return null

        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) return null

        return { 
          id: user.id, 
          email: user.email, 
          username: user.username,
          storiesCount: user.storiesCount,
          charactersCount: user.charactersCount,
          achievements: user.achievements,
          registrationDate: user.registrationDate
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        const dbUser = await kv.get(`user:${session.user.email}`) as DBUser | null;
        if (dbUser) {
          session.user = {
            ...session.user,
            id: dbUser.id,
            username: dbUser.username,
            storiesCount: dbUser.storiesCount,
            charactersCount: dbUser.charactersCount,
            achievements: dbUser.achievements,
            registrationDate: dbUser.registrationDate
          };
        }
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  }
}
