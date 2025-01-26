"use server"

import { db } from "@/lib/db"
import { hash } from "bcryptjs"
import { cookies } from "next/headers"

interface AuthResponse {
  success?: boolean
  error?: string
  redirect?: string
}

export async function register(formData: FormData): Promise<AuthResponse> {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const name = formData.get("name") as string
    const lastName = formData.get("lastName") as string
    const phone = formData.get("phone") as string
    const address = formData.get("address") as string
    const document = formData.get("document") as string

    // Validar campos requeridos
    if (!email || !password || !name || !lastName || !document) {
      return {
        error: "Todos los campos son requeridos"
      }
    }

    // Verificar si el usuario ya existe
    const existingUser = await db.user.findUnique({
      where: {
        email: email
      }
    })

    if (existingUser) {
      return {
        error: "El correo electrónico ya está registrado"
      }
    }

    // Crear el usuario
    const hashedPassword = await hash(password, 10)
    await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        lastName,
        phone,
        address,
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
