'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Loader2 } from 'lucide-react'

export default function AgradecimientoPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await signOut({ redirect: false })
      router.push('/')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      setIsLoggingOut(false)
    }
  }

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto mt-10 p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Gracias por completar la encuesta</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6">
            Apreciamos tu tiempo y tus valiosas respuestas. Tus opiniones nos ayudarán a mejorar la gestión de proyectos de investigación.
          </p>
          {session?.user?.name && (
            <p className="text-lg font-semibold mb-4">
              ¡Hasta pronto, {session.user.name}!
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            onClick={handleLogout} 
            disabled={isLoggingOut}
            aria-label="Cerrar sesión"
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
        </CardFooter>
      </Card>
    </div>
  )
}