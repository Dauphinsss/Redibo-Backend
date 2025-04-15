const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Obtener ciudades por ID de país
const getCiudades = async (idPais) => {
  return await prisma.ciudad.findMany({
    where: { id_pais: idPais },
    select: { id: true, nombre: true },
  });
};

// Obtener provincias por ID de ciudad
const getProvincias = async (idCiudad) => {
  return await prisma.provincia.findMany({
    where: { id_ciudad: idCiudad },
    select: { id: true, nombre: true },
  });
};

// Obtener todos los países
const getPaises = async () => {
  return await prisma.pais.findMany({
    select: { id: true, nombre: true },
  });
};

// Obtener dirección completa (ID, calle, número de casa) por ID del carro
const getDireccionByCarroId = async (idCarro) => {
  const direccion = await prisma.carro.findUnique({
    where: { id: idCarro },
    select: {
      direccion: {
        select: {
          id: true,
          calle: true,
          num_casa: true,
        },
      },
    },
  });

  if (!direccion || !direccion.direccion) {
    throw new Error(`No se encontró una dirección asociada al carro con ID ${idCarro}`);
  }

  return direccion.direccion;
};

// Obtener la ciudad actual y otras ciudades relacionadas por ID del carro
const getCiudadesPorCarroId = async (idCarro) => {
  const carro = await prisma.carro.findUnique({
    where: { id: idCarro },
    select: {
      direccion: {
        select: {
          ciudad: {
            select: {
              id: true,
              nombre: true,
              id_pais: true,
            },
          },
        },
      },
    },
  });

  if (!carro || !carro.direccion || !carro.direccion.ciudad) {
    throw new Error(`No se encontró una ciudad asociada al carro con ID ${idCarro}`);
  }

  const ciudadActual = carro.direccion.ciudad;

  const otrasCiudades = await prisma.ciudad.findMany({
    where: {
      id: { not: ciudadActual.id },
      id_pais: ciudadActual.id_pais,
    },
    select: { id: true, nombre: true },
  });

  return { ciudadActual, otrasCiudades };
};

// Obtener todos los datos del carro con respecto a la dirección
const getCarroConDireccion = async (idCarro) => {
  const carro = await prisma.carro.findUnique({
    where: { id: idCarro },
    select: {
      id: true,
      direccion: {
        select: {
          id: true,
          calle: true,
          num_casa: true,
          provincia: {
            select: {
              id: true,
              nombre: true,
              ciudad: {
                select: {
                  id: true,
                  nombre: true,
                  pais: {
                    select: {
                      id: true,
                      nombre: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!carro || !carro.direccion) {
    throw new Error(`No se encontró un carro con dirección asociada al ID ${idCarro}`);
  }

  return carro;
};

module.exports = {
  getCiudades,
  getProvincias,
  getPaises,
  getDireccionByCarroId,
  getCiudadesPorCarroId,
  getCarroConDireccion,
};
