const Router = require("express");
const { ReservationController } = require("../controllers/reservation");
const { authenticateToken } = require("../middlewares/authMiddleware");

const reservationRouter = Router()

reservationRouter.post('/reservations', ReservationController.createReservation)
reservationRouter.patch('/reservations/:id/state', ReservationController.updateReservationState)
reservationRouter.delete('/reservations/:id', ReservationController.deleteReservation)
// Verificar si un usuario hizo la reserva de un carro
reservationRouter.get('/reservations/verificar/:idUsuario/:idCarro', ReservationController.verificarReservaUsuario);
reservationRouter.post('/reservations/verify', authenticateToken, ReservationController.verficarReserva)
module.exports = { reservationRouter }