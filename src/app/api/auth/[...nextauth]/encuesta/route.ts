import { NextResponse } from 'next/server'
import prisma  from '@/lib/prisma'
import z  from 'zod'

// Define a schema for the encuesta data
const EncuestaSchema = z.object({
  rol: z.string(),
  rolOtro: z.string().optional(),
  perteneceSemillero: z.string(),
  tiempoSemillero: z.string().optional(),
  gestionProyectos: z.array(z.string()),
  gestionProyectosOtro: z.string().optional(),
  satisfaccion: z.string(),
  problemas: z.array(z.string()),
  problemasOtro: z.string().optional(),
  caracteristicas: z.array(z.string()),
  caracteristicasOtro: z.string().optional(),
  metodologiasAgiles: z.string(),
  disposicionSoftware: z.string(),
  probabilidadRecomendacion: z.string(),
  funcionalidadesAdicionales: z.string().optional(),
  expectativas: z.string().optional(),
  comentarios: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Validate the incoming data
    const validatedData = EncuestaSchema.parse(data)

    // Process array fields
    const processedData = {
      ...validatedData,
      gestionProyectos: validatedData.gestionProyectos.join(','),
      problemas: validatedData.problemas.join(','),
      caracteristicas: validatedData.caracteristicas.join(','),
    }

    const encuesta = await prisma.encuesta.create({
      data: processedData
    })

    return NextResponse.json({ success: true, data: encuesta }, { status: 201 })
  } catch (error) {
    console.error('Error al guardar la encuesta:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Datos de encuesta inválidos', 
        details: error.errors 
      }, { status: 400 })
    }
    
    return NextResponse.json({ 
      success: false, 
      error: 'Error al guardar la encuesta' 
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const encuestas = await prisma.encuesta.findMany()
    return NextResponse.json({ success: true, data: encuestas })
  } catch (error) {
    console.error('Error al obtener las encuestas:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Error al obtener las encuestas' 
    }, { status: 500 })
  }
}