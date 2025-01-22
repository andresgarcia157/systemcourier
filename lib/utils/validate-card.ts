export function validateCard(number: string): boolean {
  // Remove any spaces or dashes
  const cleanNumber = number.replace(/[\s-]/g, "")

  // Check if the number contains only digits
  if (!/^\d+$/.test(cleanNumber)) return false

  // Check length (most cards are between 13-19 digits)
  if (cleanNumber.length < 13 || cleanNumber.length > 19) return false

  // Luhn algorithm
  let sum = 0
  let isEven = false

  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = Number.parseInt(cleanNumber[i])

    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}

export function validateExpiry(expiry: string): boolean {
  // Check format MM/YY
  if (!/^\d{2}\/\d{2}$/.test(expiry)) return false

  const [month, year] = expiry.split("/").map((num) => Number.parseInt(num))
  const now = new Date()
  const currentYear = now.getFullYear() % 100
  const currentMonth = now.getMonth() + 1

  // Check month validity
  if (month < 1 || month > 12) return false

  // Check if card is expired
  if (year < currentYear || (year === currentYear && month < currentMonth)) return false

  return true
}

export function validateCVC(cvc: string): boolean {
  // Most CVC numbers are 3-4 digits
  return /^\d{3,4}$/.test(cvc)
}

export function formatCardNumber(number: string): string {
  const cleaned = number.replace(/\D/g, "")
  const groups = cleaned.match(/.{1,4}/g)
  return groups ? groups.join(" ") : cleaned
}

export function formatExpiry(input: string): string {
  const cleaned = input.replace(/\D/g, "")
  if (cleaned.length >= 2) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`
  }
  return cleaned
}

