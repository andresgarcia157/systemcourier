const { PrismaClient } = require('@prisma/client')
const { hash } = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    // Crear usuario administrador
    const hashedPassword = await hash('Admin2024@', 10)
    
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@courier.com',
        password: hashedPassword,
        name: 'Admin',
        lastName: 'System',
        role: 'ADMIN',
        phone: '123456789', // opcional
        address: 'System Address' // opcional
      }
    })

    console.log('Usuario administrador creado exitosamente:')
    console.log(JSON.stringify(adminUser, null, 2))

    // Verificar que el usuario existe
    const verifyUser = await prisma.user.findUnique({
      where: {
        email: 'admin@courier.com'
      }
    })

    console.log('\nVerificación del usuario:')
    console.log(JSON.stringify(verifyUser, null, 2))

  } catch (error) {
    if (error.code === 'P2002') {
      console.error('Error: El email ya existe en la base de datos')
    } else {
      console.error('Error:', error)
    }
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
