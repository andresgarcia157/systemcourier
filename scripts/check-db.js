const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkDatabase() {
  try {
    console.log('Verificando conexión a la base de datos...')
    
    // Verificar la tabla de usuarios
    const usersCount = await prisma.user.count()
    console.log('Número total de usuarios:', usersCount)

    // Listar todos los usuarios
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        lastName: true,
        role: true,
        createdAt: true
      }
    })

    console.log('\nLista de usuarios:')
    users.forEach(user => {
      console.log('\n-------------------')
      console.log('ID:', user.id)
      console.log('Email:', user.email)
      console.log('Nombre:', user.name)
      console.log('Apellido:', user.lastName)
      console.log('Rol:', user.role)
      console.log('Creado:', user.createdAt)
    })

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()
