export const PAYMENT_CONFIG = {
  apiUrl: "https://gpspositioningtracker.com/wc-api/WC_Gateway_PayPhone",
  identifier: "pvNJAMQCUC4FPEzQTQS0w",
  clientId: "CHjVNA9nEGLybggtywatw",
  secretKey: "jg7ITPrkEMgLkOP07mEQ",
  encodingPassword: "a8a87487eb0a41ca8a07555398afa709",
}

export interface PaymentRequest {
  amount: number
  currency: string
  orderId: string
  customerEmail: string
  customerName: string
  items: {
    id: string
    description: string
    amount: number
  }[]
}

export interface PaymentResponse {
  success: boolean
  transactionId?: string
  error?: string
}

