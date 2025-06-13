const prisma = require('../../config/prisma');

const carService = {
  async findById(id_carro) {
    try {
      const comentariosPadres = await prisma.comentarioCarro.findMany({
        where: {
          id_carro: id_carro,
        },
        select: {
          id: true,
          comentario: true,
          fecha_creacion: true,
          calificacion:true,
          Usuario: {
            select: {
              nombre: true,
            },
          },
        },
      });

      return comentariosPadres;
    } catch (error) {
      console.error('Error al obtener los comentarios del carro:', error);
      throw error;
    }
  },
};

module.exports = carService;