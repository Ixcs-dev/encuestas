'use client'

import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await signOut({ redirect: false })
      router.push('/')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button 
          onClick={handleLogout} 
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Cerrando sesión...
            </>
          ) : (
            'Cerrar sesión'
          )}
        </Button>
      </div>
      {session?.user?.name && (
        <p className="text-lg mb-4">Bienvenido, {session.user.name}</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Encuesta de Investigación</CardTitle>
            <CardDescription>Participa en nuestra encuesta sobre gestión de proyectos de investigación</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/encuesta" passHref>
              <Button className="w-full">Ir a la Encuesta</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Resultados</CardTitle>
            <CardDescription>Ver los resultados actuales de la encuesta</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/graficas" passHref>
              <Button className="w-full">Ver Resultados</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}