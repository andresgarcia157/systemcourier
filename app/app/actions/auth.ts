"use server"

import { db } from "@/lib/db"
import { hash, compare } from "bcryptjs"
import { cookies } from "next/headers"

interface AuthResponse {
  success?: boolean
  error?: string
  redirect?: string
}

export async function login(formData: FormData): Promise<AuthResponse> {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
      return {
        error: "Email y contraseña son requeridos"
      }
    }

    const user = await db.user.findUnique({
      where: {
        email: email
      }
    })

    if (!user) {
      return {
        error: "Credenciales inválidas"
      }
    }

    const passwordsMatch = await compare(password, user.password)

    if (!passwordsMatch) {
      return {
        error: "Credenciales inválidas"
      }
    }

    const session = {
      id: user.id,
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      role: user.role,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }

    cookies().set("session", JSON.stringify(session), {
      expires: session.expires,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/"
    })

    return {
      success: true,
      redirect: user.role === "ADMIN" ? "/admin" : "/dashboard"
    }

  } catch (error) {
    console.error("Error de autenticación:", error)
    return {
      error: "Error al iniciar sesión"
    }
  }
}

export async function register(formData: FormData): Promise<AuthResponse> {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const name = formData.get("name") as string
    const lastName = formData.get("lastName") as string
    const phone = formData.get("phone") as string
    const address = formData.get("address") as string

    if (!email || !password || !name || !lastName) {
      return {
        error: "Todos los campos son requeridos"
      }
    }

    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return {
        error: "El correo electrónico ya está registrado"
      }
    }

    const hashedPassword = await hash(password, 10)
    
    await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        lastName,
        phone: phone || "",
        address: address || "",
        role: "CLIENT"
      }
    })

    return {
      success: true
    }

  } catch (error) {
    console.error("Error de registro:", error)
    return {
      error: "Error al registrar usuario"
    }
  }
}

export async function logout() {
  try {
    cookies().delete("session")
    return { success: true }
  } catch (error) {
    console.error("Error al cerrar sesión:", error)
    return {
      success: false,
      error: "Error al cerrar sesión"
    }
  }
}

export async function getSession() {
  const session = cookies().get("session")
  if (!session) return null
  
  try {
    return JSON.parse(session.value)
  } catch {
    return null
  }
}
