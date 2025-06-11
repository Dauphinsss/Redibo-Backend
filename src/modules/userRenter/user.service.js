const prisma = require('../../config/prisma');

const findAll = async (renterId) => {
    try {
        return await prisma.usuario.findMany({
            where: {id : renterId},
            select : {
                id : true,
                nombre: true,
                correo: true
            }
        })
    } catch (error) {
        throw error;
    }
}

module.exports = {findAll}