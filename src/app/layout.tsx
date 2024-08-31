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
          <header className="bg-[#3F69D9] p-4 text-white sticky top-0 z-50">
            <div className="container mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-center">
                {/* Eliminamos el título de aquí, ya que debe estar en el componente Nav */}
                <Nav />
              </div>
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