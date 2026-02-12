"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBag, Calendar, Store, ChevronRight, Package, Hash } from "lucide-react";
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
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div>
            <Skeleton className="h-6 w-32 mb-1" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-28 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  // Ordenar del más nuevo al más viejo
  const pedidosList = (pedidos?.Lista || []).sort((a, b) => {
    const parseDate = (dateStr) => {
      if (!dateStr) return 0;
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        return new Date(parts[2], parts[1] - 1, parts[0]).getTime();
      }
      return new Date(dateStr).getTime();
    };
    return parseDate(b.Fecha) - parseDate(a.Fecha);
  });

  const totalPedidos = pedidosList.reduce((acc, p) => acc + (p.Monto || 0), 0);
  const cantidadItems = pedidosList.reduce((acc, p) => acc + (p.Items?.length || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header con resumen */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-400 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-xl">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Mis Pedidos</h1>
            <p className="text-white/80 text-sm">
              {pedidosList.length} {pedidosList.length === 1 ? 'pedido' : 'pedidos'} • {cantidadItems} artículos
            </p>
          </div>
        </div>
        {pedidosList.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <p className="text-white/70 text-xs uppercase tracking-wide">Total en pedidos</p>
            <p className="text-2xl font-bold">
              {totalPedidos.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
            </p>
          </div>
        )}
      </div>

      {/* Lista de pedidos */}
      {pedidosList.length === 0 ? (
        <Card className="border-none shadow-sm bg-gray-50">
          <CardContent className="py-16 text-center">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">No tienes pedidos todavía</p>
            <p className="text-sm text-gray-400 mt-1">Tus pedidos aparecerán aquí</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {pedidosList.map((pedido) => (
            <Dialog key={pedido.Numero}>
              <DialogTrigger asChild>
                <Card className="border-none shadow-sm cursor-pointer hover:shadow-lg transition-all duration-200 active:scale-[0.98] overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex">
                      {/* Barra de color lateral */}
                      <div className="w-1.5 bg-gradient-to-b from-emerald-500 to-teal-400" />

                      <div className="flex-1 p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                #{pedido.Numero}
                              </span>
                              <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                                {pedido.Estado || "Completado"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{pedido.Fecha}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                              <Store className="w-3.5 h-3.5" />
                              <span className="truncate">{pedido.Tienda || "Online"}</span>
                            </div>
                          </div>

                          <div className="text-right flex flex-col items-end">
                            <p className="text-lg font-bold text-gray-800">
                              {pedido.Monto.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {pedido.Items?.length || 0} artículos
                            </p>
                            <ChevronRight className="w-5 h-5 text-gray-300 mt-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden max-h-[90vh]">
                {/* Header del modal */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-400 p-6 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-white text-center">
                      <span className="text-white/70 text-sm font-normal block mb-1">Pedido</span>
                      <span className="text-2xl">#{pedido.Numero}</span>
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex justify-center mt-3">
                    <Badge className="bg-white/20 text-white border-0">
                      {pedido.Estado || "Completado"}
                    </Badge>
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-3xl font-bold">
                      {pedido.Monto.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
                    </p>
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-6 space-y-6 overflow-y-auto max-h-[50vh]">
                  {/* Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 text-gray-400 mb-1">
                        <Store className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-wide">Tienda</span>
                      </div>
                      <p className="font-medium text-gray-800 text-sm">{pedido.Tienda || "Online"}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 text-gray-400 mb-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-wide">Fecha</span>
                      </div>
                      <p className="font-medium text-gray-800 text-sm">{pedido.Fecha}</p>
                    </div>
                  </div>

                  {/* Artículos */}
                  {pedido.Items && pedido.Items.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">
                        Artículos ({pedido.Items.length})
                      </p>
                      <div className="space-y-2">
                        {pedido.Items.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center bg-gray-50 rounded-xl p-3"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-800 text-sm truncate">
                                {item.Articulo}
                              </p>
                              <p className="text-xs text-gray-400">
                                Cantidad: {parseFloat(item.Cantidad)}
                              </p>
                            </div>
                            <p className="font-semibold text-gray-800 ml-3">
                              {(item.Precio * parseFloat(item.Cantidad)).toLocaleString('es-AR', {
                                style: 'currency',
                                currency: 'ARS'
                              })}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Total */}
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                        <span className="font-semibold text-gray-600">Total</span>
                        <span className="text-xl font-bold text-emerald-600">
                          {pedido.Monto.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      )}
    </div>
  );
}
