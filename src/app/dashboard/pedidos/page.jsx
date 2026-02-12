"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

export default function PedidosPage() {
  const { userData } = useUser();
  const [loading, setLoading] = useState(true);
  const [pedidos, setPedidos] = useState(null);

  const fetchPedidos = useCallback(async (dni) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/nasus/cliente/compras?dni=${encodeURIComponent(dni)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setPedidos(data);
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userData?.dni) {
      fetchPedidos(userData.dni);
    }
  }, [userData?.dni, fetchPedidos]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-40" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const pedidosList = pedidos?.Lista || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ShoppingBag className="w-6 h-6 text-brand" />
        <h1 className="text-xl font-bold text-gray-800">Mis Pedidos</h1>
      </div>

      {pedidosList.length === 0 ? (
        <Card className="border-none shadow-sm">
          <CardContent className="py-12 text-center">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No tienes pedidos todavía</p>
            <p className="text-sm text-gray-400 mt-1">Tus pedidos aparecerán aquí</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {pedidosList.map((pedido) => (
            <Dialog key={pedido.Numero}>
              <DialogTrigger asChild>
                <Card className="border-none shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="flex justify-between items-center p-4">
                    <div>
                      <h3 className="font-semibold text-gray-800">Pedido #{pedido.Numero}</h3>
                      <p className="text-sm text-gray-500">{pedido.Fecha}</p>
                      <p className="text-xs text-gray-400">{pedido.Tienda || "Online"}</p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-700 mb-1">
                        {pedido.Estado || "Completado"}
                      </Badge>
                      <p className="text-sm font-semibold text-brand">
                        {pedido.Monto.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle>Pedido #{pedido.Numero}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-green-100 text-green-700">
                      {pedido.Estado || "Completado"}
                    </Badge>
                    <span className="text-sm text-gray-500">{pedido.Fecha}</span>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-2">Artículos</p>
                    <div className="space-y-2">
                      {pedido.Items?.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-700">{item.Articulo}</span>
                          <div className="flex gap-4">
                            <span className="text-gray-500">x{parseFloat(item.Cantidad)}</span>
                            <span className="font-medium">
                              {(item.Precio * parseFloat(item.Cantidad)).toLocaleString('es-AR', {
                                style: 'currency',
                                currency: 'ARS'
                              })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-lg text-brand">
                      {pedido.Monto.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
                    </span>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      )}
    </div>
  );
}
