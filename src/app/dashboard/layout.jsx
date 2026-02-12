"use client";

import { useEffect, useState, useCallback } from "react";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { UserProvider } from "@/contexts/UserContext";
import DashboardHeader from "@/components/dashboard/header";
import BottomNav from "@/components/dashboard/bottom-nav";

export default function DashboardLayout({ children }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const fetchLoginExternal = useCallback(async () => {
    try {
      const responseLogin = await fetch(`/api/jinx/Login`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!responseLogin.ok) {
        throw new Error(`Error Login: ${responseLogin.status}`);
      }

      const responseUserAccess = await fetch(`/api/jinx/UserAccess`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!responseUserAccess.ok) {
        throw new Error(`Error UserAccess: ${responseUserAccess.status}`);
      }
    } catch (error) {
      console.error("Error al obtener datos:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos iniciales.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchLoginExternal();
  }, [fetchLoginExternal]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <UserProvider>
      <Toaster />
      <div className="min-h-screen bg-gray-50 pb-20">
        <DashboardHeader />
        <main className="max-w-md mx-auto px-4 py-4">
          {children}
        </main>
        <BottomNav />
      </div>
    </UserProvider>
  );
}
