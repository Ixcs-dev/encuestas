import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import EncuestaInvestigacion from "../../components/encuesta-investigacion"

export default async function EncuestaPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Encuesta de Investigación</h1>
      <EncuestaInvestigacion />
    </div>
  )
}