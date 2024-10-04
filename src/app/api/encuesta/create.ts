// pages/api/encuestas/create.ts
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const {
      rol, rolOtro, perteneceSemillero, tiempoSemillero, gestionProyectos,
      gestionProyectosOtro, satisfaccion, problemas, problemasOtro, caracteristicas,
      caracteristicasOtro, metodologiasAgiles, disposicionSoftware, probabilidadRecomendacion,
      funcionalidadesAdicionales, expectativas, comentarios
    } = req.body;

    // Validaciones de datos
    if (!rol) {
      return res.status(400).json({ error: 'El rol es requerido' });
    }

    try {
      const encuesta = await prisma.encuesta.create({
        data: {
          rol, rolOtro, perteneceSemillero, tiempoSemillero, gestionProyectos,
          gestionProyectosOtro, satisfaccion, problemas, problemasOtro, caracteristicas,
          caracteristicasOtro, metodologiasAgiles, disposicionSoftware, probabilidadRecomendacion,
          funcionalidadesAdicionales, expectativas, comentarios
        }
      });
      res.status(201).json(encuesta);
    } catch (error) {
      res.status(500).json({ error: 'Error creando encuesta' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
