import { prisma } from "../config/prisma"


export class ReservationModel {
  static async createReservation ({ userId, carId, starDate, endDate, estado }) {
    const start = new Date(starDate)
    const end = new Date(endDate)
    if (start >= end) {
      throw new Error('La fecha de inicio debe ser menor que la fecha de fin')
    }

    const existingReservation = await prisma.reserva.findMany({
      where: {
        id_carro: carId,
        OR: [
          {
            fecha_inicio: { lte: end },
            fecha_fin: { gte: start },
          },
        ],
        estado: {
          not: 'cancelada',
        },
      }
    })

    if (existingReservation.length > 0) {
      throw new Error('El carro ya está reservado para esas fechas')
    }

    let expirationDate = null;
    if (estado === 'pendiente') {
      const now = new Date();
      const daysUntilReservation = (new Date(starDate) - now) / (1000 * 60 * 60 * 24)
      
      if (daysUntilReservation < 3) {
        throw new Error('No se puede hacer la reserva al 0% para fechas tan cercanas')
      }

      expirationDate = new Date()
      expirationDate.setDate(expirationDate.getDate() + 3)
    }

    const newReservation = await prisma.reserva.create({
      data: {
        id_carro: carId,
        id_usuario: userId,
        fecha_inicio: start,
        fecha_fin: end,
        estado: estado,
        fecha_expiracion: expirationDate,
      }
    })

    return newReservation
  }
}