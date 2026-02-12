"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ReceiptText, Calendar, Store, ChevronRight, Ticket } from "lucide-react";
import QRCode from "react-qr-code";
import { useUser } from "@/contexts/UserContext";

export default function TicketsPage() {
  const { userData } = useUser();
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState(null);

  const fetchTickets = useCallback(async (dni) => {
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
      setTickets(data);
    } catch (error) {
      console.error("Error al obtener tickets:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userData?.dni) {
      fetchTickets(userData.dni);
    }
  }, [userData?.dni, fetchTickets]);

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
  const ticketList = (tickets?.Lista || []).sort((a, b) => {
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

  const totalCompras = ticketList.reduce((acc, t) => acc + (t.Monto || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header con resumen */}
      <div className="bg-gradient-to-r from-brand to-pink-400 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-xl">
            <ReceiptText className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Mis Tickets</h1>
            <p className="text-white/80 text-sm">
              {ticketList.length} {ticketList.length === 1 ? 'compra realizada' : 'compras realizadas'}
            </p>
          </div>
        </div>
        {ticketList.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <p className="text-white/70 text-xs uppercase tracking-wide">Total acumulado</p>
            <p className="text-2xl font-bold">
              {totalCompras.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
            </p>
          </div>
        )}
      </div>

      {/* Lista de tickets */}
      {ticketList.length === 0 ? (
        <Card className="border-none shadow-sm bg-gray-50">
          <CardContent className="py-16 text-center">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Ticket className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">No tienes tickets todavía</p>
            <p className="text-sm text-gray-400 mt-1">Tus compras aparecerán aquí</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {ticketList.map((ticket, index) => (
            <Dialog key={ticket.Numero}>
              <DialogTrigger asChild>
                <Card className="border-none shadow-sm cursor-pointer hover:shadow-lg transition-all duration-200 active:scale-[0.98] overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex">
                      {/* Barra de color lateral */}
                      <div className="w-1.5 bg-gradient-to-b from-brand to-pink-400" />

                      <div className="flex-1 p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-brand bg-brand/10 px-2 py-0.5 rounded-full">
                                #{ticket.Numero}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{ticket.Fecha}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                              <Store className="w-3.5 h-3.5" />
                              <span className="truncate">{ticket.Tienda}</span>
                            </div>
                          </div>

                          <div className="text-right flex flex-col items-end">
                            <p className="text-lg font-bold text-gray-800">
                              {ticket.Monto.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
                            </p>
                            <ChevronRight className="w-5 h-5 text-gray-300 mt-2" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[380px] p-0 overflow-hidden">
                {/* Header del modal */}
                <div className="bg-gradient-to-r from-brand to-pink-400 p-6 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-white text-center">
                      <span className="text-white/70 text-sm font-normal block mb-1">Ticket</span>
                      <span className="text-2xl">#{ticket.Numero}</span>
                    </DialogTitle>
                  </DialogHeader>
                  <div className="text-center mt-4">
                    <p className="text-3xl font-bold">
                      {ticket.Monto.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
                    </p>
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-6 space-y-6">
                  {/* Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 text-gray-400 mb-1">
                        <Store className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-wide">Tienda</span>
                      </div>
                      <p className="font-medium text-gray-800 text-sm">{ticket.Tienda}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 text-gray-400 mb-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-wide">Fecha</span>
                      </div>
                      <p className="font-medium text-gray-800 text-sm">{ticket.Fecha}</p>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="text-center">
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Código de cambio</p>
                    <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-gray-200 inline-block">
                      <QRCode value={ticket.TktCambio || ticket.Numero.toString()} size={140} />
                    </div>
                    <p className="text-xs text-gray-400 mt-3 font-mono">{ticket.TktCambio}</p>
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
