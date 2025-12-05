import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Package, Truck, Home, Calendar, StoreIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function PedidosView({ userData }) {
  const [loading, setLoading] = useState(false);
  const [userCompras, setUserCompras] = useState(null);

  useEffect(() => {

    if (userData?.dni) {
      fetchCompras(userData.dni);
    }

  }, []);

  const fetchCompras = async (dni) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/nasus/cliente/compras?dni=${dni}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Compras del usuario:", data);

      setUserCompras(data);
    } catch (error) {
      console.error("Error al obtener las compras del cliente:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!userCompras || loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md border-none shadow-none bg-transparent">
      <CardHeader>
        <CardTitle className="text-gray-800">Mis Pedidos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
      {userCompras.Lista?.length > 0 ? (
        userCompras.Lista.map((pedido) => (
          <Dialog key={pedido.Numero}>
            <DialogTrigger asChild>
              <Card className="bg-white cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
                <CardContent className="flex justify-between items-center p-4">
                  <div>
                    <h3 className="font-semibold text-gray-800">Pedido #{pedido.Numero}</h3>
                    <p className="text-sm text-gray-500">Tienda: {pedido.Tienda || "Web"}</p>
                  </div>
                  <Badge variant="secondary" className="bg-brand text-white">
                    Ver detalles
                  </Badge>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-gray-800">Detalles del Pedido #{pedido.Numero}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-white border-brand  bg-brand">{pedido.Estado || "Terminado"}</Badge>
                  <span className="text-sm text-gray-500">Pedido el: {pedido.Fecha}</span>
                </div>
                <div>
                <h4 className="font-semibold text-gray-700 mb-2">Artículos</h4>
<ul className="space-y-2">
  {pedido.Items.map((item, index) => (
    <li
      key={index}
      className="grid grid-cols-3 gap-4 items-center text-sm"
    >
      <span className="text-gray-800">{item.Articulo}</span>
      <span className="text-gray-600 text-center">x {parseFloat(item.Cantidad)}</span>
      <span className="text-gray-600 text-right">
        {(item.Precio * parseFloat(item.Cantidad)).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
      </span>
    </li>
  ))}
</ul>
                </div>
                <Separator></Separator>
                <div className="flex justify-between items-center font-semibold">
                  <span>Total</span>
                  <span>
                    {pedido.Monto.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}
                  </span>
                </div>
                <div className="space-y-2 hidden">
                  <h4 className="font-semibold text-gray-700">Seguimiento del Pedido</h4>
                  <div className="flex items-center text-sm text-gray-600">
                    <Package className="w-4 h-4 mr-2" />
                    <span>Pedido recibido</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Truck className="w-4 h-4 mr-2" />
                    <span>En camino</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <Home className="w-4 h-4 mr-2" />
                    <span>Entregado</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 hidden">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Fecha estimada de entrega</span>
                  </div>
                  <span>{new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))
      ) : (
        <p className="text-gray-500 text-center">No hay pedidos realizadas.</p>
      )}
      </CardContent>
    </Card>
  );
}
