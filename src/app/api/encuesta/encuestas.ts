import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { Toast } from '@radix-ui/react-toast'
import { useRouter } from 'next/router'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const data = req.body
      const encuesta = await prisma.encuesta.create({
        data: {
          ...data
        }
      })
      res.status(200).json(encuesta)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error al guardar la encuesta' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Método ${req.method} no permitido`)
  }
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const respuestas = {}; // Define the respuestas variable here
    const router = useRouter(); // Initialize the router

    if (!validateAllResponses()) {
      Toast({
        title: "Error",
        typeof: "Por favor, responda todas las preguntas obligatorias.",
        // variant: "destructive",
      })
      return
    }
  
    try {
      const response = await fetch('/api/encuesta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(respuestas),
      })
      
      if (response.ok) {
        // Elimina la encuesta en progreso y redirige al agradecimiento
        localStorage.removeItem('encuestaEnProgreso')
        router.push('/dashboard/agradecimiento')
      } else {
        Toast({
          title: "Error",
          content: "No se pudo enviar la encuesta, intente nuevamente.",
          // variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al enviar la encuesta", error)
      Toast({
        title: "Error",
        content: "Ocurrió un error al enviar la encuesta.",
        //variant: "destructive",
      })
    }
  } }

function validateAllResponses(): boolean {
    // Implement your validation logic here
    // Return true if all responses are valid, otherwise return false
    return true; // Placeholder implementation
}
  