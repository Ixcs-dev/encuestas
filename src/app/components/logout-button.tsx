"use client"; // Marca este archivo como un Client Component

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";

export const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' }); // Redirige a la página principal
  };

  return (
    <Button onClick={handleLogout}>
      Cerrar sesión
    </Button>
  );
};
