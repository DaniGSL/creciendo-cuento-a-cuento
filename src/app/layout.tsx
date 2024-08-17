import './globals.css'
import Nav from './components/Nav'
import ClientProvider from './components/ClientProvider'

export const metadata = {
  title: 'Creciendo cuento a cuento',
  description: 'Generador de cuentos personalizados',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gradient-to-b from-[#E4E9FE] to-[#FFFFFF]">
        <ClientProvider>
          <header className="bg-[#3F69D9] p-4 text-white">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold">Creciendo cuento a cuento</h1>
              <Nav />
            </div>
          </header>
          <main className="container mx-auto p-4">
            {children}
          </main>
        </ClientProvider>
      </body>
    </html>
  )
}