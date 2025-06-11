const prisma = require("../config/prisma");

class ReservationModel {
  static async createReservation({ userId, carId, starDate, endDate, estado }) {
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
          not: 'cancelado',
        },
      }
    })

    if (existingReservation.length > 0) {
      throw new Error('El carro ya está reservado para esas fechas')
    }

    let expirationDate = null
    if (estado === 'pendiente') {
      const now = new Date()
      const daysUntilReservation = (new Date(starDate) - now) / (1000 * 60 * 60 * 24)

      if (daysUntilReservation < 3) {
        throw new Error('No se puede hacer la reserva al 0% para fechas tan cercanas')
      }

      expirationDate = new Date()
      expirationDate.setDate(expirationDate.getDate() + 2)
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

  static async updateReservationState({ id, estado }) {
    const reservation = await prisma.reserva.findUnique({
      where: { id: id }
    })

    if (!reservation) {
      throw new Error('Reserva no encontrada')
    }

    const updated = await prisma.reserva.update({
      where: { id: id },
      data: { estado: estado }
    })

    return updated
  }

  static async deleteReservation({ id }) {
    const reservation = await prisma.reserva.findUnique({
      where: { id: id }
    })

    if (!reservation) {
      throw new Error('Reserva no encontrada')
    }

    const deleted = await prisma.reserva.delete({
      where: { id: id }
    })
    return deleted
  }
  static async cancelExpiredReservations() {
    const now = new Date();

    const expiredReservations = await prisma.reserva.findMany({
      where: {
        estado: 'pendiente',
        fecha_expiracion: {
          lt: now,
        },
      },
    });

    for (const reservation of expiredReservations) {
      await prisma.reserva.update({
        where: { id: reservation.id },
        data: { estado: 'cancelado' },
      });
    }

    return expiredReservations.length;
  }
  static async usuarioHizoReserva(idUsuario, idCarro) {
    try {
      const reserva = await prisma.reserva.findFirst({
        where: {
          id_usuario: idUsuario,
          id_carro: idCarro
        },
        select: {
          id: true
        }
      });

      return !!reserva; // Devuelve true si existe, false si no
    } catch (error) {
      console.error('Error al verificar la reserva:', error);
      throw new Error('No se pudo verificar la reserva');
    }
  }

  static async verficarReserva({ carId, starDate, endDate }) {
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
        Estado: {
          not: 'CANCELADA',
        },
      }
    })

    if (existingReservation.length > 0) {
      return {
        available: false,
        message: 'Ya existe una reserva para estas fechas'
      }
    }
    return {
      available: true,
      message: 'Reservado con exito'
    }
  }
}

module.exports = { ReservationModel }