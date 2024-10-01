// app/page.tsx
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route"; // Asegúrate de que la ruta sea correcta
import { LoginButton } from "./components/login-button"; // Importa tu componente aquí
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"; // Asegúrate de que estos componentes existen

export default async function Home() {
  const session = await getServerSession(authOptions);

  // Si el usuario ya está logueado, redirige al tablero
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
          <LoginButton /> {/* Aquí es donde se usa el LoginButton */}
        </CardContent>
      </Card>
    </div>
  );
}
