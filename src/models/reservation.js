const prisma = require("../config/prisma");

class ReservationModel {
  static async createReservation({ userId, carId, starDate, endDate, estado }) {
    const start = new Date(starDate)
    const end = new Date(endDate)

    if (isNaN(start) || isNaN(end)) {
      throw new Error('Fechas inválidas')
    }

    if (start >= end) {
      throw new Error('La fecha de inicio debe ser menor que la fecha de fin')
    }

    const existingReservation = await prisma.reserva.findFirst({
      where: {
        id_carro: carId,
        id_usuario: userId,
      }
    })

    if (!existingReservation) {
      throw new Error('No se encontró una reserva existente para actualizar');
    }

    let expirationDate = null
    if (estado === 'EN_CURSO') {
      const now = new Date()
      const daysUntilReservation = (new Date(starDate) - now) / (1000 * 60 * 60 * 24)

      if (daysUntilReservation < 3) {
        throw new Error('No se puede hacer la reserva al 0% para fechas tan cercanas')
      }

      expirationDate = new Date()
      expirationDate.setDate(expirationDate.getDate() + 2)
    }

    const newReservation = await prisma.reserva.update({
      where: {
        id: existingReservation.id,
      },
      data: {
        estado: estado,
        Estado: estado,
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
        estado: 'PENDIENTE',
        Estado: 'PENDIENTE',
        fecha_expiracion: {
          lt: now,
        },
      },
    });

    for (const reservation of expiredReservations) {
      await prisma.reserva.update({
        where: { id: reservation.id },
        data: { estado: 'CANCELADA', Estado: 'CANCELADA' },
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

  static async verficarReserva({ userId, carId, starDate, endDate }) {
    const start = new Date(starDate)
    const end = new Date(endDate)

    if (isNaN(start) || isNaN(end)) {
      throw new Error('Fechas inválidas')
    }

    if (start >= end) {
      throw new Error('La fecha de inicio debe ser menor que la fecha de fin')
    }

    const overlappingReservations = await prisma.reserva.findMany({
      where: {
        id_carro: carId,
        Estado: {
          not: 'CANCELADA'
        },
        estado: {
          not: 'CANCELADA',
        },
        OR: [
          {
            fecha_inicio: {
              gte: start,
              lte: end,
            },
          },
          {
            fecha_fin: {
              gte: start,
              lte: end,
            },
          },
          {
            fecha_inicio: {
              lte: start,
            },
            fecha_fin: {
              gte: end,
            },
          },
        ],
      },
    })

    if (overlappingReservations.length > 0) {
      return {
        available: false,
        message: 'Ya existe una reserva activa para estas fechas',
      }
    }

    await prisma.reserva.create({
      data: {
        id_usuario: userId,
        id_carro: carId,
        fecha_inicio: start,
        fecha_fin: end,
        Estado: 'PENDIENTE',
        estado: 'PENDIENTE',
      },
    })

    return {
      available: true,
      message: 'Reservado con éxito',
    }
  }

}

module.exports = { ReservationModel }