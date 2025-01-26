"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

interface PaymentResponse {
  success: boolean
  message: string
  data?: any
}

export async function processPayment(formData: FormData): Promise<PaymentResponse> {
  try {
    // Validar los datos del formulario
    const amount = formData.get("amount")
    const liquidationId = formData.get("liquidationId")

    if (!amount || !liquidationId) {
      return {
        success: false,
        message: "Faltan datos requeridos"
      }
    }

    // Verificar que la liquidación existe
    const existingLiquidation = await db.liquidation.findUnique({
      where: {
        id: liquidationId as string
      }
    })

    if (!existingLiquidation) {
      return {
        success: false,
        message: "Liquidación no encontrada"
      }
    }

    // Procesar el pago
    const updatedLiquidation = await db.liquidation.update({
      where: {
        id: liquidationId as string
      },
      data: {
        status: "PAID",
      }
    })

    // Revalidar la página para actualizar los datos
    revalidatePath('/dashboard/liquidacion')

    return {
      success: true,
      message: "Pago procesado exitosamente",
      data: updatedLiquidation
    }

  } catch (error) {
    console.error("Error procesando pago:", error)
    return {
      success: false,
      message: "Error al procesar el pago"
    }
  }
}
