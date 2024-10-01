import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
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