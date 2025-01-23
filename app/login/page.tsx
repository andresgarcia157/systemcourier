"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X } from "lucide-react"

interface Message {
  id: string
  title: string
  content: string
  image?: string
}

interface ThemeConfig {
  logo: string | null
  loginBackground: string | null
  primaryColor: string
  secondaryColor: string
}

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [theme, setTheme] = useState<ThemeConfig | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [showMessages, setShowMessages] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    // In a real app, fetch this from your API
    const fetchConfig = async () => {
      // Simulated API call
      const config = {
        theme: {
          logo: "/logo.png",
          loginBackground: "/login-bg.jpg",
          primaryColor: "#0f172a",
          secondaryColor: "#64748b",
        },
        messages: [
          {
            id: "1",
            title: "¡Bienvenido a nuestra nueva plataforma!",
            content: "Hemos actualizado nuestro sistema para brindarte una mejor experiencia.",
            image: "/placeholder.svg?height=200&width=400",
          },
        ],
      }
      setTheme(config.theme)
      setMessages(config.messages)
    }
    fetchConfig()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simular login
    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.push("/dashboard")
  }

  const backgroundStyle = theme?.loginBackground
    ? { backgroundImage: `url(${theme.loginBackground})` }
    : { background: "bg-gradient-to-br from-slate-900 to-slate-800" }

  return (
    <>
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={backgroundStyle}
      >
        <Card className="w-full max-w-md mx-4 relative">
          {messages.length > 0 && showMessages && (
            <div className="absolute -top-4 -right-4">
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full shadow-lg"
                onClick={() => setShowMessages(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          <CardHeader className="space-y-1 text-center">
            {theme?.logo && (
              <div className="flex justify-center mb-4">
                <Image
                  src={theme.logo || "/placeholder.svg"}
                  alt="Logo"
                  width={150}
                  height={50}
                  className="h-12 w-auto object-contain"
                />
              </div>
            )}
            <CardTitle className="text-2xl font-bold">Iniciar sesión</CardTitle>
            <CardDescription>Ingrese sus credenciales para acceder al sistema</CardDescription>
          </CardHeader>
          <CardContent>
            {messages.length > 0 && showMessages && (
              <div className="mb-6 space-y-4">
                {messages.map((message) => (
                  <Card key={message.id}>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">{message.title}</h3>
                      <p className="text-sm text-muted-foreground">{message.content}</p>
                      {message.image && (
                        <div className="mt-4">
                          <div
                            className="relative h-32 w-full cursor-pointer"
                            onClick={() => setSelectedImage(message.image)}
                          >
                            <Image
                              src={message.image || "/placeholder.svg"}
                              alt={message.title}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input id="email" placeholder="correo@ejemplo.com" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" type="password" required />
              </div>
              <Button
                className="w-full"
                type="submit"
                disabled={loading}
                style={{ backgroundColor: theme?.primaryColor }}
              >
                {loading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              <Link href="/forgot-password" className="text-primary hover:underline">
                ¿Olvidó su contraseña?
              </Link>
            </div>
            <div className="mt-4 text-center text-sm">
              ¿No tiene una cuenta?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Registrarse
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          {selectedImage && (
            <div className="relative aspect-video">
              <Image src={selectedImage || "/placeholder.svg"} alt="Preview" fill className="object-contain" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

