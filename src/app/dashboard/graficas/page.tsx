"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
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
import React from 'react'

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
  const router = useRouter()

  useEffect(() => {
    const fetchEncuestas = async () => {
      try {
        const response = await fetch('/api/encuesta')
        if (response.ok) {
          const data = await response.json()
          setRespuestas(data)
        } else {
          throw new Error('Error al obtener las encuestas')
        }
      } catch (error) {
        console.error('Error:', error)
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
          conteo[v] = (conteo[v] || 0) + 1
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Resultados de la Encuesta</h1>
      <Button 
        onClick={() => router.back()} 
        className="mb-4"
      >
        Regresar
      </Button>
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
      </div>
    </div>
  )
}