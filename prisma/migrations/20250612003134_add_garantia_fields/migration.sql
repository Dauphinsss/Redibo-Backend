-- CreateEnum
CREATE TYPE "EstadoGarantia" AS ENUM ('PENDIENTE', 'ACTIVA', 'RETENIDA', 'LIBERADA', 'REEMBOLSADA');

-- AlterTable
ALTER TABLE "OrdenPago" ADD COLUMN     "estado_garantia" "EstadoGarantia" DEFAULT 'PENDIENTE',
ADD COLUMN     "monto_garantia" DOUBLE PRECISION;
