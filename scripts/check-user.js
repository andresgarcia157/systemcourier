const { PrismaClient } = require('@prisma/client')
const { compare } = require('bcryptjs')

const prisma = new PrismaClient()

async function checkUser(email, password) {
  try {
    console.log('Buscando usuario:', email)
    
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.log('Usuario no encontrado')
      return
    }

    console.log('Usuario encontrado:')
    console.log('ID:', user.id)
    console.log('Email:', user.email)
    console.log('Rol:', user.role)
    console.log('Nombre:', user.name)
    console.log('Apellido:', user.lastName)
    
    const passwordMatch = await compare(password, user.password)
    console.log('Contraseña coincide:', passwordMatch ? 'Sí' : 'No')

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Verificar un usuario específico
checkUser('admin@courier.com', 'Andres4420*')
