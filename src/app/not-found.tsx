import Link from 'next/link'
import { Button } from './components/ui/button'

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4 text-center">404 - Página no encontrada</h1>
      <p className="text-xl mb-4 text-center">La página que estás buscando no existe.</p>
      <Link href="/dashboard" passHref>
        <Button className="px-6 py-2 text-lg">
          Volver al Dashboard
        </Button>
      </Link>
    </div>
  )
}