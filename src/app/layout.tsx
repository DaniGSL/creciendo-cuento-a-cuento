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
            <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
              <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-0">Creciendo cuento a cuento</h1>
              <Nav />
            </div>
          </header>
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </ClientProvider>
      </body>
    </html>
  )
}
