import { useState,useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

import { Skeleton } from "@/components/ui/skeleton";
import QRCode from "react-qr-code";
import { driver } from "driver.js";
import { DialogClose } from "@radix-ui/react-dialog"

export default function TicketsView({userData}) {
  const [loading, setLoading] = useState(false);
  const [userCompras, setUserCompras] = useState(null);
  const [isTutorialCompletedTickets, setIsTutorialCompletedTickets] = useState(false)

  useEffect(() => {
    if (userData?.dni) {
      fetchCompras(userData.dni);
    }
  }, []);

  const startTourTickets = () => {
    const driverObj = driver({
      popoverClass: 'driverjs-theme',
      nextBtnText: "Siguiente",
      prevBtnText: "Volver",
      doneBtnText: "Terminar",
      animate: true, // Animaciones entre pasos
      allowClose: false,
      steps: [
        {
          element: "#buttomTickets",
          popover: {
            title: "Bienvenido a Mis Tickets",
            description: "Aquí podrás acceder a todas las funcionalidades relacionadas con tus compras.",
            position: "top",
          },
        },
        {
          element: "#TICKETS",
          popover: {
            title: "Listado de Compras",
            description: "En esta sección encontrarás un resumen detallado de todas tus compras realizadas.",
            position: "top",
          },
        },
        {
          element: "#TICKET-0",
          popover: {
            title: "Detalles del Ticket",
            description: "Haz clic para ver más información sobre los puntos acumulados y el contenido del ticket.",
            position: "top",
            onNextClick: () => {
              const dialogTrigger = document.querySelector(`#TICKET-0`);
              if (dialogTrigger) {
                dialogTrigger.click(); // Abre el diálogo
              } else {
                console.error("No se encontró el disparador del diálogo");
              }
              setTimeout(() => {
                driverObj.moveNext(); // Avanza al siguiente paso
              }, 300); // Tiempo de espera para que el diálogo se abra
            },
          },
        },
        {
          element: "#TICKET-INFO",
          popover: {
            title: "Información del Ticket",
            description: "Consulta los detalles de la compra, como tienda, fecha, monto y más.",
            position: "top",
            onPrevClick: () => {
              const dialogTrigger = document.querySelector(`#TICKET-INFO-CLOSE`);
              if (dialogTrigger) {
                dialogTrigger.click(); // Cierra el diálogo
              } else {
                console.error("No se encontró el disparador del diálogo");
              }
              setTimeout(() => {
                driverObj.movePrevious(); // Regresa al paso anterior
              }, 300); // Tiempo de espera para que el diálogo se cierre
            },
          },
        },
        {
          element: "#TICKET-CAMBIO",
          popover: {
            title: "Código QR del Ticket",
            description: "Aquí puedes encontrar el código QR asociado al ticket para usarlo en nuestras tiendas afiliadas.",
            position: "top",
            onNextClick: () => {
              if (driverObj.isLastStep()) {
                localStorage.setItem("tutorialCompletedTickets", "true");
                setIsTutorialCompletedTickets(true);
              }
              const dialogTrigger = document.querySelector(`#TICKET-INFO-CLOSE`);
              if (dialogTrigger) {
                dialogTrigger.click(); // Cierra el diálogo
              } else {
                console.error("No se encontró el disparador del diálogo");
              }
              setTimeout(() => {
                driverObj.movePrevious(); // Regresa al paso anterior
              }, 300); // Tiempo de espera para que el diálogo se cierre
              driverObj.moveNext();
            },
          },
        },
      ],
   

  });

    driverObj.drive();
  };

  useEffect(() => {
    // Verifica si el tutorial ya fue completado al cargar la página
    const tutorialCompletedTickets = localStorage.getItem("tutorialCompletedTickets");
    setIsTutorialCompletedTickets(tutorialCompletedTickets);

    if (!loading && userCompras && userCompras.Lista?.length > 0 && !isTutorialCompletedTickets) {
      console.log("Iniciando el tour con Lista de longitud:", userCompras.Lista.length);
      startTourTickets();
    }
  }, [loading, userCompras, isTutorialCompletedTickets]);


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
        <CardTitle className="text-gray-800">Mis Tickets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4" id="TICKETS">
  {userCompras.Lista?.length > 0 ? (
    userCompras.Lista.map((ticket, index) => (
      <Dialog key={ticket.Numero}>
        <DialogTrigger asChild>
          <Card className="bg-white cursor-pointer hover:bg-gray-50 transition-colors shadow-sm" id={`TICKET-${index}`}>
            <CardContent className="flex justify-between items-center p-4">
              <div>
                <h3 className="font-semibold text-gray-800">Ticket #{ticket.Numero}</h3>
                <p className="text-sm text-gray-500">Fecha: {ticket.Fecha}</p>
              </div>
              <Badge variant="secondary" className="bg-brand text-white">
                {ticket.Monto.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
              </Badge>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]" id="TICKET-INFO">
          
          <DialogHeader>
            <DialogTitle className="text-gray-800">Detalles del Ticket #{ticket.Numero}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-700">Información de Compra</h4>
              <p>Tienda: {ticket.Tienda}</p>
              <p>Fecha: {ticket.Fecha}</p>
              <p>Total: {ticket.Monto.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</p>
              <p>Artículos: 3</p>
            </div>
            <div id="TICKET-CAMBIO">
              <h4 className="font-semibold text-gray-700">Ticket de Cambio</h4>
              <div className="mt-2 p-4 bg-white border border-gray-200 rounded-lg">
                <QRCode value={ticket.TktCambio} size={150} className="w-full"></QRCode>
                <p className="text-center mt-2 text-sm text-gray-600">Código: {ticket.TktCambio}</p>
              </div>
            </div>
            <Button className="w-full bg-pink-100 text-pink-700 hover:bg-pink-200 hidden">Descargar Ticket</Button>
          </div>
          <DialogClose id="TICKET-INFO-CLOSE" className="hidden"></DialogClose>
        </DialogContent>
      </Dialog>
    ))
  ) : (
    <p className="text-gray-500 text-center">No hay compras realizadas.</p>
  )}
</CardContent>

    </Card>
  )
}
