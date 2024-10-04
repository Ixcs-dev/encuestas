import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const data = req.body;
      const encuesta = await prisma.encuesta.create({
        data: {
          ...data,
        },
      });
      res.status(200).json(encuesta);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al guardar la encuesta' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}
