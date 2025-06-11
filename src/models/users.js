const prisma = require("../config/prisma");

class userModel {
  static async getUserData({ id }) {
    console.log(id)
    try {
      const usuario = await prisma.usuario.findUnique({
        where: {
          id: id,
        },
        select: {
          nombre: true,
          correo: true,
          telefono: true,
          ciudad: {
            select: {
              nombre: true,
            }
          },
          reservas: {
            select: {
              id: true,
              fecha_creacion: true,
              fecha_inicio: true,
              fecha_fin: true,
              fecha_expiracion: true,
              estado: true
            }
          }
        }
      })
      return usuario
    } catch (error) {
      console.error('La tabla no existe:', error)
      throw new Error('La tabla no existe')
    }
  }

  static async getUser({ id }) {
    try {
      const user = await prisma.usuario.findUnique({
        where: {
          id: id,
        },
        select: {
          nombre: true,
          correo: true,
          telefono: true,
          ciudad: {
            select: {
              nombre: true
            }
          }
        }
      })
      return {
        nombre: user.nombre,
        correo: user.correo,
        telefono: user.telefono,
        ciudad: user.ciudad.nombre,
      }
    } catch (error) {
      console.error('No existe el usuario:', error)
      throw new Error('No existe el usuario')
    }
  }
}

module.exports = { userModel }