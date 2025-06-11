const Router = require("express");
const { ReservationController } = require("../controllers/reservation");

const reservationRouter = Router()

reservationRouter.post('/', ReservationController.createReservation)
reservationRouter.patch('/:id/state', ReservationController.updateReservationState)
reservationRouter.delete('/:id', ReservationController.deleteReservation)
// Verificar si un usuario hizo la reserva de un carro
reservationRouter.get('/verificar/:idUsuario/:idCarro', ReservationController.verificarReservaUsuario);
module.exports = { reservationRouter }