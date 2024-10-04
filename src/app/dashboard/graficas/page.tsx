"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

type Respuesta = {
  rol: string
  perteneceSemillero: string
  tiempoSemillero: string
  gestionProyectos: string
  satisfaccion: string
  problemas: string
  caracteristicas: string
  metodologiasAgiles: string
  disposicionSoftware: string
  probabilidadRecomendacion: string
}

const colorPalette = [
  'rgba(255, 99, 132, 0.6)',
  'rgba(54, 162, 235, 0.6)',
  'rgba(255, 206, 86, 0.6)',
  'rgba(75, 192, 192, 0.6)',
  'rgba(153, 102, 255, 0.6)',
  'rgba(255, 159, 64, 0.6)',
  'rgba(199, 199, 199, 0.6)',
  'rgba(83, 102, 255, 0.6)',
  'rgba(40, 159, 64, 0.6)',
  'rgba(210, 199, 199, 0.6)',
]

const AUTHORIZED_EMAIL = 'ixcsgm@gmail.com'

export default function GraficasEncuesta() {
  const [respuestas, setRespuestas] = useState<Respuesta[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated' && session?.user?.email !== AUTHORIZED_EMAIL) {
      setError('No tienes permiso para ver esta página.')
      setIsLoading(false)
    } else if (status === 'authenticated' && session?.user?.email === AUTHORIZED_EMAIL) {
      fetchEncuestas()
    }
  }, [status, session, router])

  const fetchEncuestas = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/encuesta')
      if (!response.ok) {
        throw new Error('Error al obtener las encuestas')
      }
      const data = await response.json()
      if (Array.isArray(data)) {
        setRespuestas(data)
      } else {
        throw new Error('Los datos recibidos no son un array')
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Hubo un problema al cargar las encuestas. Por favor, intenta de nuevo más tarde.')
    } finally {
      setIsLoading(false)
    }
  }

  const contarRespuestas = (campo: keyof Respuesta) => {
    const conteo: { [key: string]: number } = {}
    respuestas.forEach(respuesta => {
      const valor = respuesta[campo]
      if (typeof valor === 'string') {
        const valores = valor.split(',')
        valores.forEach(v => {
          const trimmedValue = v.trim()
          conteo[trimmedValue] = (conteo[trimmedValue] || 0) + 1
        })
      }
    })
    return conteo
  }

  const crearDatosGrafica = (campo: keyof Respuesta, titulo: string) => {
    const conteo = contarRespuestas(campo)
    const labels = Object.keys(conteo)
    return {
      labels,
      datasets: [
        {
          label: titulo,
          data: Object.values(conteo),
          backgroundColor: labels.map((_, index) => colorPalette[index % colorPalette.length]),
        },
      ],
    }
  }

  const opcionesGrafica = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Resultados de la Encuesta',
      },
    },
  }

  if (status === 'loading' || isLoading) {
    return <div className="flex justify-center items-center h-screen">Cargando resultados...</div>
  }

  if (error || (status === 'authenticated' && session?.user?.email !== AUTHORIZED_EMAIL)) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-red-500 mb-4">{error || 'No tienes permiso para ver esta página.'}</p>
        <Button onClick={() => router.push('/dashboard')}>Volver al Dashboard</Button>
      </div>
    )
  }

  const graficas = [
    { campo: 'rol' as keyof Respuesta, titulo: 'Rol en la Universidad' },
    { campo: 'perteneceSemillero' as keyof Respuesta, titulo: 'Pertenencia a Semillero' },
    { campo: 'satisfaccion' as keyof Respuesta, titulo: 'Satisfacción con Gestión Actual' },
    { campo: 'disposicionSoftware' as keyof Respuesta, titulo: 'Disposición a Usar Software Especializado' },
    { campo: 'gestionProyectos' as keyof Respuesta, titulo: 'Gestión de Proyectos Actual' },
    { campo: 'problemas' as keyof Respuesta, titulo: 'Problemas en la Gestión de Proyectos' },
    { campo: 'caracteristicas' as keyof Respuesta, titulo: 'Características Deseadas' },
    { campo: 'metodologiasAgiles' as keyof Respuesta, titulo: 'Opinión sobre Metodologías Ágiles' },
    { campo: 'probabilidadRecomendacion' as keyof Respuesta, titulo: 'Probabilidad de Recomendación' },
  ]

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Resultados de la Encuesta</h1>
      <Button 
        onClick={() => router.push('/dashboard')} 
        className="mb-4"
      >
        Volver al Dashboard
      </Button>
      {respuestas.length === 0 ? (
        <p className="text-center">No hay respuestas disponibles aún.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {graficas.map((grafica, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{grafica.titulo}</CardTitle>
              </CardHeader>
              <CardContent>
                <Bar options={opcionesGrafica} data={crearDatosGrafica(grafica.campo, grafica.titulo)} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}