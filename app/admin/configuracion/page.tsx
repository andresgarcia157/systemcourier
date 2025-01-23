"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import {
  Loader2,
  Mail,
  Server,
  Globe,
  Building,
  Bell,
  Palette,
  MessageSquare,
  Upload,
  ImageIcon,
  X,
  Plus,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { saveSystemConfig, testSmtpConnection } from "@/app/actions/config"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

interface ThemeConfig {
  logo: string | null
  loginBackground: string | null
  primaryColor: string
  secondaryColor: string
}

interface Message {
  id: string
  title: string
  content: string
  image?: string
  active: boolean
  startDate: string
  endDate: string
}

interface SystemConfig {
  companyName: string
  supportEmail: string
  supportPhone: string
  address: string
  website: string
  smtp: SmtpConfig
  templates: {
    welcome: EmailTemplate
    packageRegistered: EmailTemplate
    liquidationCreated: EmailTemplate
  }
  theme: ThemeConfig
  messages: Message[]
}

interface SmtpConfig {
  host: string
  port: string
  secure: boolean
  user: string
  password: string
  from: string
}

interface EmailTemplate {
  subject: string
  body: string
}

const defaultConfig: SystemConfig = {
  companyName: "Cargo Express",
  supportEmail: "soporte@cargoexpress.com",
  supportPhone: "+593 98 653 9819",
  address: "Av. Principal #123",
  website: "https://cargoexpress.com",
  smtp: {
    host: "smtp.gmail.com",
    port: "587",
    secure: true,
    user: "notifications@cargoexpress.com",
    password: "",
    from: "Cargo Express <notifications@cargoexpress.com>",
  },
  templates: {
    welcome: {
      subject: "Bienvenido a Cargo Express",
      body: "Estimado {name},\n\nBienvenido a Cargo Express. Su código de importador es: {importerId}",
    },
    packageRegistered: {
      subject: "Paquete Registrado - {tracking}",
      body: "Su paquete con tracking {tracking} ha sido registrado en nuestro sistema.",
    },
    liquidationCreated: {
      subject: "Nueva Liquidación - {liquidationId}",
      body: "Se ha generado una nueva liquidación para su paquete {tracking}.",
    },
  },
  theme: {
    logo: null,
    loginBackground: null,
    primaryColor: "#0f172a",
    secondaryColor: "#64748b",
  },
  messages: [],
}

export default function ConfiguracionPage() {
  const [config, setConfig] = useState<SystemConfig>(defaultConfig)
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "logo" | "background" | "message") => {
    const file = e.target.files?.[0]
    setFileError(null)

    if (file) {
      if (!file.type.startsWith("image/")) {
        setFileError("Solo se permiten archivos de imagen")
        setSelectedFile(null)
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        setFileError("El archivo no debe superar los 5MB")
        setSelectedFile(null)
        return
      }

      const imageUrl = URL.createObjectURL(file)

      if (type === "logo") {
        setConfig((prev) => ({
          ...prev,
          theme: { ...prev.theme, logo: imageUrl },
        }))
      } else if (type === "background") {
        setConfig((prev) => ({
          ...prev,
          theme: { ...prev.theme, loginBackground: imageUrl },
        }))
      }

      setSelectedFile(file)
    }
  }

  const handleAddMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const newMessage: Message = {
      id: Date.now().toString(),
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      active: true,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      image: selectedFile ? URL.createObjectURL(selectedFile) : undefined,
    }

    setConfig((prev) => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }))

    // Reset form
    e.currentTarget.reset()
    setSelectedFile(null)
  }

  const handleToggleMessage = (messageId: string) => {
    setConfig((prev) => ({
      ...prev,
      messages: prev.messages.map((msg) => (msg.id === messageId ? { ...msg, active: !msg.active } : msg)),
    }))
  }

  const handleDeleteMessage = (messageId: string) => {
    setConfig((prev) => ({
      ...prev,
      messages: prev.messages.filter((msg) => msg.id !== messageId),
    }))
  }

  const handleSmtpChange = (key: keyof SmtpConfig, value: string | boolean) => {
    setConfig((prev) => ({
      ...prev,
      smtp: {
        ...prev.smtp,
        [key]: value,
      },
    }))
  }

  const handleTemplateChange = (
    template: keyof SystemConfig["templates"],
    field: keyof EmailTemplate,
    value: string,
  ) => {
    setConfig((prev) => ({
      ...prev,
      templates: {
        ...prev.templates,
        [template]: {
          ...prev.templates[template],
          [field]: value,
        },
      },
    }))
  }

  const handleTestEmail = async () => {
    setLoading(true)
    try {
      const response = await testSmtpConnection(config.smtp)
      if (response.success) {
        toast.success("Conexión SMTP probada exitosamente")
      } else {
        toast.error(response.error || "Error al probar la conexión SMTP")
      }
    } catch (error) {
      toast.error("Error al probar la conexión SMTP")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveConfig = async () => {
    setLoading(true)
    try {
      const response = await saveSystemConfig(config)
      if (response.success) {
        toast.success("Configuración guardada exitosamente")
      } else {
        toast.error(response.error || "Error al guardar la configuración")
      }
    } catch (error) {
      toast.error("Error al guardar la configuración")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Configuración del Sistema</h2>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">
            <Building className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="smtp">
            <Mail className="h-4 w-4 mr-2" />
            Servidor SMTP
          </TabsTrigger>
          <TabsTrigger value="templates">
            <Server className="h-4 w-4 mr-2" />
            Plantillas de Correo
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notificaciones
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="h-4 w-4 mr-2" />
            Apariencia
          </TabsTrigger>
          <TabsTrigger value="messages">
            <MessageSquare className="h-4 w-4 mr-2" />
            Mensajes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Configuración General</CardTitle>
              <CardDescription>Información básica de la empresa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Nombre de la Empresa</Label>
                <Input
                  id="company-name"
                  value={config.companyName}
                  onChange={(e) => setConfig((prev) => ({ ...prev, companyName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Sitio Web</Label>
                <Input
                  id="website"
                  value={config.website}
                  onChange={(e) => setConfig((prev) => ({ ...prev, website: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="support-email">Correo de Soporte</Label>
                <Input
                  id="support-email"
                  type="email"
                  value={config.supportEmail}
                  onChange={(e) => setConfig((prev) => ({ ...prev, supportEmail: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="support-phone">Teléfono de Soporte</Label>
                <Input
                  id="support-phone"
                  value={config.supportPhone}
                  onChange={(e) => setConfig((prev) => ({ ...prev, supportPhone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Textarea
                  id="address"
                  value={config.address}
                  onChange={(e) => setConfig((prev) => ({ ...prev, address: e.target.value }))}
                />
              </div>
              <Button onClick={handleSaveConfig} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar Cambios"
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="smtp">
          <Card>
            <CardHeader>
              <CardTitle>Configuración del Servidor SMTP</CardTitle>
              <CardDescription>Configuración para el envío de correos electrónicos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="smtp-host">Servidor SMTP</Label>
                <Input
                  id="smtp-host"
                  value={config.smtp.host}
                  onChange={(e) => handleSmtpChange("host", e.target.value)}
                  placeholder="smtp.gmail.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">Puerto</Label>
                  <Input
                    id="smtp-port"
                    value={config.smtp.port}
                    onChange={(e) => handleSmtpChange("port", e.target.value)}
                    placeholder="587"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-secure">Conexión Segura (SSL/TLS)</Label>
                  <div className="flex items-center pt-2">
                    <Switch
                      id="smtp-secure"
                      checked={config.smtp.secure}
                      onCheckedChange={(checked) => handleSmtpChange("secure", checked)}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-user">Usuario SMTP</Label>
                <Input
                  id="smtp-user"
                  value={config.smtp.user}
                  onChange={(e) => handleSmtpChange("user", e.target.value)}
                  placeholder="notifications@cargoexpress.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-password">Contraseña SMTP</Label>
                <Input
                  id="smtp-password"
                  type="password"
                  value={config.smtp.password}
                  onChange={(e) => handleSmtpChange("password", e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-from">Remitente</Label>
                <Input
                  id="smtp-from"
                  value={config.smtp.from}
                  onChange={(e) => handleSmtpChange("from", e.target.value)}
                  placeholder="Cargo Express <notifications@cargoexpress.com>"
                />
              </div>
              <div className="flex gap-4">
                <Button onClick={handleTestEmail} variant="outline" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar Correo de Prueba"
                  )}
                </Button>
                <Button onClick={handleSaveConfig} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    "Guardar Configuración"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Plantillas de Correo</CardTitle>
              <CardDescription>Personaliza los correos automáticos del sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Bienvenida</Label>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="welcome-subject">Asunto</Label>
                    <Input
                      id="welcome-subject"
                      value={config.templates.welcome.subject}
                      onChange={(e) => handleTemplateChange("welcome", "subject", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="welcome-body">Contenido</Label>
                    <Textarea
                      id="welcome-body"
                      value={config.templates.welcome.body}
                      onChange={(e) => handleTemplateChange("welcome", "body", e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Registro de Paquete</Label>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="package-subject">Asunto</Label>
                    <Input
                      id="package-subject"
                      value={config.templates.packageRegistered.subject}
                      onChange={(e) => handleTemplateChange("packageRegistered", "subject", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="package-body">Contenido</Label>
                    <Textarea
                      id="package-body"
                      value={config.templates.packageRegistered.body}
                      onChange={(e) => handleTemplateChange("packageRegistered", "body", e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Nueva Liquidación</Label>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="liquidation-subject">Asunto</Label>
                    <Input
                      id="liquidation-subject"
                      value={config.templates.liquidationCreated.subject}
                      onChange={(e) => handleTemplateChange("liquidationCreated", "subject", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="liquidation-body">Contenido</Label>
                    <Textarea
                      id="liquidation-body"
                      value={config.templates.liquidationCreated.body}
                      onChange={(e) => handleTemplateChange("liquidationCreated", "body", e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveConfig} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar Plantillas"
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Notificaciones</CardTitle>
              <CardDescription>Personaliza cuándo y cómo se envían las notificaciones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notificaciones por Correo</h3>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Registro de Usuario</Label>
                      <p className="text-sm text-muted-foreground">
                        Enviar correo de bienvenida cuando un nuevo usuario se registra
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Registro de Paquete</Label>
                      <p className="text-sm text-muted-foreground">Notificar cuando se registra un nuevo paquete</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Cambio de Estado</Label>
                      <p className="text-sm text-muted-foreground">Notificar cuando cambia el estado de un paquete</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Nueva Liquidación</Label>
                      <p className="text-sm text-muted-foreground">Notificar cuando se genera una nueva liquidación</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Frecuencia de Notificaciones</h3>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label>Resumen de Actividad</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar frecuencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtime">Tiempo real</SelectItem>
                        <SelectItem value="daily">Diario</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="never">Nunca</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveConfig} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar Configuración"
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Personalización</CardTitle>
              <CardDescription>Personaliza la apariencia de tu sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Logo de la Empresa</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, "logo")}
                    />
                    <Button type="button" variant="outline" onClick={() => document.getElementById("logo")?.click()}>
                      <Upload className="mr-2 h-4 w-4" />
                      Subir Logo
                    </Button>
                    {config.theme.logo && (
                      <div className="relative h-16 w-32">
                        <Image
                          src={config.theme.logo || "/placeholder.svg"}
                          alt="Logo"
                          fill
                          className="object-contain"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute -top-2 -right-2"
                          onClick={() =>
                            setConfig((prev) => ({
                              ...prev,
                              theme: { ...prev.theme, logo: null },
                            }))
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Fondo de Login</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="background"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, "background")}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("background")?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Subir Imagen de Fondo
                    </Button>
                    {config.theme.loginBackground && (
                      <div className="relative h-32 w-48">
                        <Image
                          src={config.theme.loginBackground || "/placeholder.svg"}
                          alt="Background"
                          fill
                          className="object-cover rounded-md"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute -top-2 -right-2"
                          onClick={() =>
                            setConfig((prev) => ({
                              ...prev,
                              theme: { ...prev.theme, loginBackground: null },
                            }))
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Color Primario</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={config.theme.primaryColor}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            theme: { ...prev.theme, primaryColor: e.target.value },
                          }))
                        }
                        className="w-16"
                      />
                      <Input
                        value={config.theme.primaryColor}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            theme: { ...prev.theme, primaryColor: e.target.value },
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Color Secundario</Label>
                    <div className="flex gap-2">
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={config.theme.secondaryColor}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            theme: { ...prev.theme, secondaryColor: e.target.value },
                          }))
                        }
                        className="w-16"
                      />
                      <Input
                        value={config.theme.secondaryColor}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            theme: { ...prev.theme, secondaryColor: e.target.value },
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveConfig} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar Cambios"
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Mensajes y Anuncios</CardTitle>
              <CardDescription>Gestiona los mensajes que verán los usuarios al iniciar sesión</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleAddMessage} className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título</Label>
                    <Input id="title" name="title" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Contenido</Label>
                    <Textarea id="content" name="content" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Fecha de Inicio</Label>
                      <Input id="startDate" name="startDate" type="date" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">Fecha de Fin</Label>
                      <Input id="endDate" name="endDate" type="date" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Imagen (Opcional)</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="messageImage"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, "message")}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("messageImage")?.click()}
                      >
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Subir Imagen
                      </Button>
                      {selectedFile && (
                        <div className="flex items-center gap-2 p-2 bg-muted rounded-md flex-1">
                          <ImageIcon className="h-4 w-4" />
                          <span className="text-sm truncate">{selectedFile.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="ml-auto h-8 w-8"
                            onClick={() => setSelectedFile(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <Button type="submit">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Mensaje
                </Button>
              </form>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Mensajes Activos</h3>
                <ScrollArea className="h-[400px] rounded-md border">
                  <div className="p-4 space-y-4">
                    {config.messages.map((message) => (
                      <Card key={message.id}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start gap-4">
                            <div className="space-y-1">
                              <h4 className="font-medium">{message.title}</h4>
                              <p className="text-sm text-muted-foreground">{message.content}</p>
                              <div className="flex gap-2 text-xs text-muted-foreground">
                                <span>Desde: {message.startDate}</span>
                                <span>Hasta: {message.endDate}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={message.active ? "default" : "secondary"}>
                                {message.active ? "Activo" : "Inactivo"}
                              </Badge>
                              <Button variant="ghost" size="icon" onClick={() => handleToggleMessage(message.id)}>
                                <Switch checked={message.active} />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteMessage(message.id)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          {message.image && (
                            <div className="mt-4">
                              <div className="relative h-32 w-full">
                                <Image
                                  src={message.image || "/placeholder.svg"}
                                  alt={message.title}
                                  fill
                                  className="object-cover rounded-md"
                                  onClick={() => {
                                    setSelectedImageUrl(message.image)
                                    setShowImageDialog(true)
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

