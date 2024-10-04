"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { FaGoogle } from "react-icons/fa"

export function LoginButton() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <Button disabled>Cargando...</Button>
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src={session.user?.image ?? ""} alt={session.user?.name ?? ""} />
          <AvatarFallback>{session.user?.name?.[0] ?? "U"}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{session.user?.name}</p>
          <p className="text-xs text-gray-500">{session.user?.email}</p>
        </div>
        <Button onClick={() => signOut()}>
          Cerrar sesión
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={() => signIn("google")}>
      <FaGoogle className="mr-2 h-4 w-4" aria-hidden="true" />
      Iniciar sesión con Google
    </Button>
  )
}