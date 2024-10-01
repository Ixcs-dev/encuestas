'use server'

import prisma from '@/lib/prisma';

export async function submitEncuesta(data: any) {
  try {
    console.log('Attempting to save survey:', JSON.stringify(data, null, 2));

    // Validar los datos
    if (!data.rol || !data.perteneceSemillero) {
      throw new Error('Datos incompletos');
    }

    // Asegurarse de que los arrays se unan como cadenas
    const encuestaData = {
      ...data,
      gestionProyectos: Array.isArray(data.gestionProyectos) ? data.gestionProyectos.join(',') : data.gestionProyectos,
      problemas: Array.isArray(data.problemas) ? data.problemas.join(',') : data.problemas,
      caracteristicas: Array.isArray(data.caracteristicas) ? data.caracteristicas.join(',') : data.caracteristicas,
    };

    const encuesta = await prisma.encuesta.create({
      data: encuestaData,
    });

    console.log('Encuesta guardada:', encuesta);

    return { success: true, encuesta };
  } catch (error) {
    console.error('Detailed error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack available');
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido al guardar la encuesta' };
  } finally {
    await prisma.$disconnect(); // Asegúrate de desconectar el cliente
  }
}
