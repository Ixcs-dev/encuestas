/*
  Warnings:

  - The primary key for the `Encuesta` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Encuesta" DROP CONSTRAINT "Encuesta_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "tiempoSemillero" DROP NOT NULL,
ALTER COLUMN "gestionProyectos" SET NOT NULL,
ALTER COLUMN "gestionProyectos" SET DATA TYPE TEXT,
ALTER COLUMN "problemas" SET NOT NULL,
ALTER COLUMN "problemas" SET DATA TYPE TEXT,
ALTER COLUMN "caracteristicas" SET NOT NULL,
ALTER COLUMN "caracteristicas" SET DATA TYPE TEXT,
ADD CONSTRAINT "Encuesta_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Encuesta_id_seq";
