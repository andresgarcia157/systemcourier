"use server"

import { PAYMENT_CONFIG } from "@/lib/payment-gateway"
import type { PaymentRequest, PaymentResponse } from "@/lib/payment-gateway"
import { validateCard, validateExpiry, validateCVC } from "@/lib/utils/validate-card"

export async function processPayment(formData: FormData): Promise<PaymentResponse> {
  try {
    // Get and validate form data
    const cardNumber = formData.get("cardNumber") as string
    const expiry = formData.get("expiry") as string
    const cvc = formData.get("cvc") as string
    const name = formData.get("name") as string
    const amount = Number.parseFloat(formData.get("amount") as string)
    const orderId = formData.get("orderId") as string
    const items = JSON.parse(formData.get("items") as string)

    // Validate card details
    if (!validateCard(cardNumber)) {
      throw new Error("Número de tarjeta inválido")
    }
    if (!validateExpiry(expiry)) {
      throw new Error("Fecha de expiración inválida")
    }
    if (!validateCVC(cvc)) {
      throw new Error("Código CVC inválido")
    }
    if (!name.trim()) {
      throw new Error("Nombre requerido")
    }

    // Create authorization header
    const authHeader = Buffer.from(`${PAYMENT_CONFIG.clientId}:${PAYMENT_CONFIG.secretKey}`).toString("base64")

    // Make request to payment gateway
    const response = await fetch(PAYMENT_CONFIG.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authHeader}`,
      },
      body: JSON.stringify({
        identifier: PAYMENT_CONFIG.identifier,
        amount,
        currency: "USD",
        orderId,
        card: {
          number: cardNumber.replace(/\s/g, ""),
          expiry,
          cvc,
          name,
        },
        items,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Error procesando el pago")
    }

    return {
      success: true,
      transactionId: data.transactionId,
    }
  } catch (error) {
    console.error("Payment error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error procesando el pago",
    }
  }
}

