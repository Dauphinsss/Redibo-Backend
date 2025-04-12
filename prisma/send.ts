import { PrismaClient, Genero } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1) Crear o recuperar el país "Bolivia"
  let bolivia = await prisma.pais.findFirst({
    where: { nombre: 'Bolivia' },
  });

  if (!bolivia) {
    bolivia = await prisma.pais.create({
      data: { nombre: 'Bolivia' },
    });
  }

  // 2) Crear departamentos si no existen
  const departamentosNombres = [
    'La Paz',
    'Cochabamba',
    'Santa Cruz',
    'Oruro',
    'Potosí',
    'Chuquisaca',
    'Tarija',
    'Beni',
    'Pando',
  ];

  for (const nombre of departamentosNombres) {
    const existente = await prisma.departamento.findFirst({
      where: { nombre },
    });
    if (!existente) {
      await prisma.departamento.create({
        data: {
          nombre,
          pais: { connect: { id: bolivia.id } },
        },
      });
    }
  }

  // 3) Leer departamentos para obtener sus IDs
  const departamentosBD = await prisma.departamento.findMany();

  // 4) Crear usuarios de prueba (si no existen ya)
  const usuariosSeed = [
    {
      nombre: 'Ana Pérez',
      genero: Genero.FEMENINO,
      fecha_nacimiento: new Date('1990-05-14'),
      contraseña: '1234',
      telefono: '78912345',
      id_departamento:
        departamentosBD.find((d) => d.nombre === 'La Paz')!.id,
    },
    {
      nombre: 'Carlos Gómez',
      genero: Genero.MASCULINO,
      fecha_nacimiento: new Date('1985-11-23'),
      contraseña: 'abcd',
      telefono: '71234567',
      id_departamento:
        departamentosBD.find((d) => d.nombre === 'Cochabamba')!.id,
    },
    {
      nombre: 'Luis Flores',
      genero: Genero.MASCULINO,
      fecha_nacimiento: new Date('1998-07-09'),
      contraseña: 'qwerty',
      telefono: '70123456',
      id_departamento:
        departamentosBD.find((d) => d.nombre === 'Santa Cruz')!.id,
    },
    {
      nombre: 'María Rojas',
      genero: Genero.FEMENINO,
      fecha_nacimiento: new Date('2000-01-01'),
      contraseña: 'pass',
      telefono: '76543210',
      id_departamento:
        departamentosBD.find((d) => d.nombre === 'Oruro')!.id,
    },
    {
      nombre: 'Patricia Díaz',
      genero: Genero.OTRO,
      fecha_nacimiento: new Date('1993-09-27'),
      contraseña: 'pat123',
      telefono: '73456789',
      id_departamento:
        departamentosBD.find((d) => d.nombre === 'Potosí')!.id,
    },
  ] as const;

  for (const u of usuariosSeed) {
    const existe = await prisma.usuario.findFirst({
      where: { nombre: u.nombre },
    });
    if (!existe) {
      await prisma.usuario.create({ data: u });
    }
  }

  console.log('🌱 Datos semilla insertados correctamente');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
