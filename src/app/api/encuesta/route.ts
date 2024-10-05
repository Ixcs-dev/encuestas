import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const AUTHORIZED_EMAIL = 'ixcsgm@gmail.com'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.email !== AUTHORIZED_EMAIL) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  try {
    const encuestas = await prisma.encuesta.findMany()
    return NextResponse.json(encuestas)
  } catch (error) {
    console.error('Error al obtener las encuestas:', error)
    return NextResponse.json({ error: 'Error al obtener las encuestas' }, { status: 500 })
  }
}

// ... (POST method remains unchanged)