const prisma = require('../../config/prisma');

const carService = {
  async findById(id_carro) {
    try {
      const comentariosPadres = await prisma.comentarios.findMany({
        where: {
          id_carro: id_carro,
          id_comentariorespondido: null
        },
        select: {
          id: true,
          contenido: true,
          comentado_en: true, 
          Calificacion:{
            select:{
                calf_carro:true,
            }
          },
          likes:true,
          dont_likes:true,
          Usuario: {
            select: {
              nombre: true
            }
          },
          other_comentarios: {
            select: {
              id: true,
              contenido: true,
              comentado_en: true, 
              Usuario: {
                select: {
                  nombre: true
                }
              }
            }
          }

        }
      });

      // RESPUESTAS 
      const comentariosConRespuestas = comentariosPadres.map(comentario => ({
        ...comentario,
        respuestas: comentario.other_comentarios,
        other_comentarios: undefined
      }));

      return comentariosConRespuestas;
    } catch (error) {
      console.error('Error al obtener los comentarios del carro:', error);
      return [];
    }
  }
};

module.exports = carService;


