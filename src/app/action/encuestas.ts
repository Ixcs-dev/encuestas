'use server'

import { prisma } from '@/lib/prisma';

type EncuestaData = {
  rol: string;
  rolOtro: string;
  perteneceSemillero: string;
  tiempoSemillero: string;
  gestionProyectos: string[];
  gestionProyectosOtro: string;
  satisfaccion: string;
  problemas: string[];
  problemasOtro: string;
  caracteristicas: string[];
  caracteristicasOtro: string;
  metodologiasAgiles: string;
  disposicionSoftware: string;
  probabilidadRecomendacion: string;
  funcionalidadesAdicionales: string;
  expectativas: string;
  comentarios: string;
}

export async function submitEncuesta(data: EncuestaData) {
  console.log('Received data:', JSON.stringify(data, null, 2))

  try {
    // Validate required fields
    const requiredFields: (keyof EncuestaData)[] = [
      'rol', 'perteneceSemillero', 'gestionProyectos', 'satisfaccion', 
      'problemas', 'caracteristicas', 'metodologiasAgiles', 
      'disposicionSoftware', 'probabilidadRecomendacion'
    ]
    
    for (const field of requiredFields) {
      if (!data[field]) {
        throw new Error(`Campo requerido faltante: ${field}`)
      }
    }

    // Prepare data for database insertion
    const encuestaData = {
      rol: data.rol,
      rolOtro: data.rolOtro,
      perteneceSemillero: data.perteneceSemillero,
      tiempoSemillero: data.tiempoSemillero,
      gestionProyectos: data.gestionProyectos.join(','),
      gestionProyectosOtro: data.gestionProyectosOtro,
      satisfaccion: data.satisfaccion,
      problemas: data.problemas.join(','),
      problemasOtro: data.problemasOtro,
      caracteristicas: data.caracteristicas.join(','),
      caracteristicasOtro: data.caracteristicasOtro,
      metodologiasAgiles: data.metodologiasAgiles,
      disposicionSoftware: data.disposicionSoftware,
      probabilidadRecomendacion: data.probabilidadRecomendacion,
      funcionalidadesAdicionales: data.funcionalidadesAdicionales,
      expectativas: data.expectativas,
      comentarios: data.comentarios,
    }

    // Insert data into database
    const encuesta = await prisma.encuesta.create({
      data: encuestaData,
    })

    console.log('Encuesta guardada:', encuesta)
    return { success: true, encuesta }
  } catch (error) {
    console.error('Error al guardar la encuesta:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido al guardar la encuesta' 
    }
  }
}