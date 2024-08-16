import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Aquí deberías verificar las credencias del usuario
        // Por ahora, permitiremos cualquier usuario/contraseña
        if (credentials?.username && credentials?.password) {
          return { id: "1", name: credentials.username }
        } else {
          return null
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
  }
})

export { handler as GET, handler as POST }
