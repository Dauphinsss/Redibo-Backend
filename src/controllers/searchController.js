import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// POST search-history
const saveSearch = async (req, res) => {
    const {criterio, id_usuario } = req.body;

    if (!criterio || !id_usuario) {
        return res.status(400).json({ error: 'Faltan datos: criterio o id_usuario' });
    }

    try {
        const existing = await prisma.busqueda.findFirst({
            where: {
                criterio: criterio.trim(),
                id_usuario
            }
        })

        if (existing) {
            const updated = await prisma.busqueda.update({
                where: { id: existing.id },
                data: { fecha_creacion: new Date() }
            });
            return res.status(200).json(updated);
        }

        const newSearch = await prisma.busqueda.create({
            data: {
                criterio: criterio.trim(),
                id_usuario
            }
        });

        res.status(201).json(newSearch);
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar búsqueda' });
    }
};

//GET /search-history/:userId
const getUserSearches = async (req, res) => {
    const { userId } = req.params;

    try {
        const searches = await prisma.busqueda.findMany({
            where: { id_usuario: parseInt(userId) },
            orderBy: { fecha_creacion: 'desc' }
        });

        res.json(searches);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener búsquedas' });
    }
}

// DELETE /search-history/:id
const deleteSearchById = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.busqueda.delete({
            where: { id: parseInt(id) }
        });

        res.json({ message: 'Búsqueda eliminada' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar búsqueda' });
    }
};

// GET /all
const getAllSearches = async (req, res) => {
    try {
        const allSearches = await prisma.busqueda.findMany();
        res.json(allSearches);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener todas las búsquedas' });
    }
  };
  

export default {
    saveSearch,
    getUserSearches,
    deleteSearchById,
    getAllSearches
};