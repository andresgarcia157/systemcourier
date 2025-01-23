"use server"

import { hash } from "bcrypt"
import { db } from "@/lib/db"

export async function registerUser(formData: FormData) {
  const nombres = formData.get("nombres") as string
  const apellidos = formData.get("apellidos") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const cedula = formData.get("cedula") as string
  const telefono = formData.get("telefono") as string
  const direccion = formData.get("direccion") as string

  // Get the last used ID from the database or start from 100000
  const lastUser = await db.user.findFirst({
    orderBy: { id: "desc" },
  })
  const lastId = lastUser ? Number.parseInt(lastUser.id) : 100000
  const importerId = (lastId + 1).toString()

  // Hash password
  const hashedPassword = await hash(password, 10)

  // Here you would typically save to your database
  // For demo purposes, we'll just return the generated ID
  return {
    success: true,
    importerId,
    message: "Usuario registrado exitosamente",
  }
}

