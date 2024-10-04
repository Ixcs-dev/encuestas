// pages/api/encuestas/[id].ts
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  const encuestaId = Number(id);
  if (isNaN(encuestaId)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  if (req.method === 'PUT') {
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
      const encuesta = await prisma.encuesta.update({
        where: { id: String(encuestaId) },
        data: {
          rol, rolOtro, perteneceSemillero, tiempoSemillero, gestionProyectos,
          gestionProyectosOtro, satisfaccion, problemas, problemasOtro, caracteristicas,
          caracteristicasOtro, metodologiasAgiles, disposicionSoftware, probabilidadRecomendacion,
          funcionalidadesAdicionales, expectativas, comentarios
        }
      });
      res.status(200).json(encuesta);
    } catch (error) {
      res.status(500).json({ error: 'Error actualizando encuesta' });
    }
  } else if (req.method === 'DELETE') {
    await handleDelete(req, res, encuestaId);
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse, encuestaId: number) {
  try {
    await prisma.encuesta.delete({ where: { id: String(encuestaId) } });
    res.status(204).end(); // Sin contenido
  } catch (error) {
    res.status(500).json({ error: 'Error eliminando encuesta' });
  }
}
