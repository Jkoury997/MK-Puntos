"use client";

import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

export default function DashboardLayout({ children }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true); // Estado de carga

  const fetchLoginExternal = async () => {
    try {
      // Primera solicitud al endpoint `Login`
      const responseLogin = await fetch(`/api/jinx/Login`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!responseLogin.ok) {
        throw new Error(`Error en la solicitud Login: ${responseLogin.status} ${responseLogin.statusText}`);
      }

      // Segunda solicitud al endpoint `UserAccess`
      const responseUserAccess = await fetch(`/api/jinx/UserAccess`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!responseUserAccess.ok) {
        throw new Error(`Error en la solicitud UserAccess: ${responseUserAccess.status} ${responseUserAccess.statusText}`);
      }

      // Simular retraso (opcional, solo para pruebas visuales)
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Error al obtener datos:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos iniciales.",
        variant: "destructive",
      });
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  };

  useEffect(() => {
    fetchLoginExternal();
  }, []); // Se ejecuta al montar el componente

  if (loading) {
    // Mostrar indicador de carga mientras se obtienen los datos
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-lg font-semibold">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <div>{children}</div>
    </>
  );
}
