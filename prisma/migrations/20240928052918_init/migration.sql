-- CreateTable
CREATE TABLE "Encuesta" (
    "id" SERIAL NOT NULL,
    "rol" TEXT NOT NULL,
    "rolOtro" TEXT,
    "perteneceSemillero" TEXT NOT NULL,
    "tiempoSemillero" TEXT NOT NULL,
    "gestionProyectos" TEXT[],
    "gestionProyectosOtro" TEXT,
    "satisfaccion" TEXT NOT NULL,
    "problemas" TEXT[],
    "problemasOtro" TEXT,
    "caracteristicas" TEXT[],
    "caracteristicasOtro" TEXT,
    "metodologiasAgiles" TEXT NOT NULL,
    "disposicionSoftware" TEXT NOT NULL,
    "probabilidadRecomendacion" TEXT NOT NULL,
    "funcionalidadesAdicionales" TEXT,
    "expectativas" TEXT,
    "comentarios" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Encuesta_pkey" PRIMARY KEY ("id")
);
