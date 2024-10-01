"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { useRouter } from 'next/navigation'
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

export default function GraficasEncuesta() {
  const [respuestas, setRespuestas] = useState<Respuesta[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchEncuestas = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/encuesta')
        if (!response.ok) {
          throw new Error('Error al obtener las encuestas')
        }
        const data = await response.json()
        setRespuestas(data)
      } catch (error) {
        console.error('Error:', error)
        setError('Hubo un problema al cargar las encuestas. Por favor, intenta de nuevo más tarde.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchEncuestas()
  }, [])

  const contarRespuestas = (campo: keyof Respuesta) => {
    const conteo: { [key: string]: number } = {}
    respuestas.forEach(respuesta => {
      const valor = respuesta[campo]
      if (typeof valor === 'string') {
        const valores = valor.split(',')
        valores.forEach(v => {
          conteo[v.trim()] = (conteo[v.trim()] || 0) + 1
        })
      }
    })
    return conteo
  }

  const crearDatosGrafica = (campo: keyof Respuesta, titulo: string) => {
    const conteo = contarRespuestas(campo)
    return {
      labels: Object.keys(conteo),
      datasets: [
        {
          label: titulo,
          data: Object.values(conteo),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
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

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Cargando resultados...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Resultados de la Encuesta</h1>
      <Button 
        onClick={() => router.back()} 
        className="mb-4"
      >
        Regresar
      </Button>
      {respuestas.length === 0 ? (
        <p className="text-center">No hay respuestas disponibles aún.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Rol en la Universidad</CardTitle>
            </CardHeader>
            <CardContent>
              <Bar options={opcionesGrafica} data={crearDatosGrafica('rol', 'Rol')} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pertenencia a Semillero</CardTitle>
            </CardHeader>
            <CardContent>
              <Bar options={opcionesGrafica} data={crearDatosGrafica('perteneceSemillero', 'Pertenece a Semillero')} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Satisfacción con Gestión Actual</CardTitle>
            </CardHeader>
            <CardContent>
              <Bar options={opcionesGrafica} data={crearDatosGrafica('satisfaccion', 'Nivel de Satisfacción')} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Disposición a Usar Software Especializado</CardTitle>
            </CardHeader>
            <CardContent>
              <Bar options={opcionesGrafica} data={crearDatosGrafica('disposicionSoftware', 'Disposición')} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Proyectos Actual</CardTitle>
            </CardHeader>
            <CardContent>
              <Bar options={opcionesGrafica} data={crearDatosGrafica('gestionProyectos', 'Métodos de Gestión')} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Problemas en la Gestión de Proyectos</CardTitle>
            </CardHeader>
            <CardContent>
              <Bar options={opcionesGrafica} data={crearDatosGrafica('problemas', 'Problemas Identificados')} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Características Deseadas</CardTitle>
            </CardHeader>
            <CardContent>
              <Bar options={opcionesGrafica} data={crearDatosGrafica('caracteristicas', 'Características Preferidas')} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Opinión sobre Metodologías Ágiles</CardTitle>
            </CardHeader>
            <CardContent>
              <Bar options={opcionesGrafica} data={crearDatosGrafica('metodologiasAgiles', 'Opinión')} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Probabilidad de Recomendación</CardTitle>
            </CardHeader>
            <CardContent>
              <Bar options={opcionesGrafica} data={crearDatosGrafica('probabilidadRecomendacion', 'Probabilidad')} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
