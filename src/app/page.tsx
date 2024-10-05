import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { LoginButton } from "../app/components/login-button";
import { Card, CardContent, CardHeader, CardTitle } from "../app/components/ui/card";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Bienvenido a la Encuesta de Investigación</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Por favor, inicia sesión para continuar.</p>
          <LoginButton />
        </CardContent>
      </Card>
    </div>
  );
}