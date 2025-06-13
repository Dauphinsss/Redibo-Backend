const traerControlarComentario = require('./comments.controller');
const traerServicioComentario = require('./comments.service');

module.exports = {
    controller: traerControlarComentario,
    service: traerServicioComentario,
}