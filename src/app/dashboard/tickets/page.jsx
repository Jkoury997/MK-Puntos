"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ReceiptText } from "lucide-react";
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
        <Skeleton className="h-10 w-40" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const ticketList = tickets?.Lista || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ReceiptText className="w-6 h-6 text-brand" />
        <h1 className="text-xl font-bold text-gray-800">Mis Tickets</h1>
      </div>

      {ticketList.length === 0 ? (
        <Card className="border-none shadow-sm">
          <CardContent className="py-12 text-center">
            <ReceiptText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No tienes tickets todavía</p>
            <p className="text-sm text-gray-400 mt-1">Tus compras aparecerán aquí</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {ticketList.map((ticket) => (
            <Dialog key={ticket.Numero}>
              <DialogTrigger asChild>
                <Card className="border-none shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="flex justify-between items-center p-4">
                    <div>
                      <h3 className="font-semibold text-gray-800">Ticket #{ticket.Numero}</h3>
                      <p className="text-sm text-gray-500">{ticket.Fecha}</p>
                      <p className="text-xs text-gray-400">{ticket.Tienda}</p>
                    </div>
                    <Badge className="bg-brand text-white">
                      {ticket.Monto.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
                    </Badge>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle>Ticket #{ticket.Numero}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">Tienda</p>
                      <p className="font-medium">{ticket.Tienda}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Fecha</p>
                      <p className="font-medium">{ticket.Fecha}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Total</p>
                      <p className="font-medium text-brand">
                        {ticket.Monto.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-500 mb-3 text-center">Código de cambio</p>
                    <div className="bg-white p-4 rounded-xl border flex flex-col items-center">
                      <QRCode value={ticket.TktCambio} size={140} />
                      <p className="text-xs text-gray-400 mt-2">{ticket.TktCambio}</p>
                    </div>
                  </div>
                </div>
                <DialogClose className="hidden" />
              </DialogContent>
            </Dialog>
          ))}
        </div>
      )}
    </div>
  );
}
