import type { Metadata } from 'next'
import { Toaster } from "sonner"
import './globals.css'

export const metadata: Metadata = {
  title: 'System Courier - Sistema de Gestión',
  description: 'Sistema de gestión de paquetes y liquidaciones',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
