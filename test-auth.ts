import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function testAuth() {
  try {
    // Limpiar usuarios existentes
    await prisma.user.deleteMany()
    
    // Crear usuario de prueba
    const hashedPassword = await hash('test123', 10)
    const user = await prisma.user.create({
      data: {
        email: 'test@test.com',
        name: 'Test User',
        password: hashedPassword,
        role: 'ADMIN'
      }
    })
    console.log('Usuario creado:', user)

    // Buscar el usuario
    const foundUser = await prisma.user.findUnique({
      where: {
        email: 'test@test.com'
      }
    })
    console.log('Usuario encontrado:', foundUser)

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testAuth()
