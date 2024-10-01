// pages/api/encuestas/index.ts
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const encuestas = await prisma.encuesta.findMany();
      res.status(200).json(encuestas);
    } catch (error) {
      res.status(500).json({ error: 'Error obteniendo encuestas' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
