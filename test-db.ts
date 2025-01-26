const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testDB() {
  try {
    // Verificar la conexión intentando contar usuarios
    const userCount = await prisma.user.count()
    console.log('Número de usuarios en la BD:', userCount)

    // Intentar listar todos los usuarios
    const users = await prisma.user.findMany()
    console.log('\nUsuarios existentes:', JSON.stringify(users, null, 2))

  } catch (error) {
    console.error('Error al conectar con la base de datos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testDB()
