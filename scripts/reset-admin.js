const { PrismaClient } = require('@prisma/client')
const { hash } = require('bcryptjs')

const prisma = new PrismaClient()

async function resetAdminPassword() {
  try {
    const newPassword = 'Admin2024'
    const hashedPassword = await hash(newPassword, 10)

    const updatedUser = await prisma.user.update({
      where: {
        email: 'admin@courier.com'
      },
      data: {
        password: hashedPassword
      }
    })

    console.log('Contraseña actualizada exitosamente')
    console.log('Usuario:', updatedUser.email)
    console.log('Nueva contraseña:', newPassword)

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

resetAdminPassword()
