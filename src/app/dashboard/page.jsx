"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Ticket, ShoppingBag, Percent, ReceiptText, ArrowBigLeft, PercentDiamond } from "lucide-react";

import HomeView from "@/components/component/client/views/home-view";
import TicketsView from "@/components/component/client/views/tickets-view";
import PedidosView from "@/components/component/client/views/pedidos-view";
import AllLocationsView from "@/components/component/client/views/all-location-view";
import DescuentosView from "@/components/component/client/views/descuentos-view";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { driver } from "driver.js";



export default function Page() {
  const [userData, setUserData] = useState(null);
  const [activeView, setActiveView] = useState("home");
  const [showAllLocations, setShowAllLocations] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isTutorialCompletedInicio, setIsTutorialCompletedInicio] = useState(false)
  const generateFingerprint = async () => {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    return result.visitorId;
  };



  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/auth/user/info`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Error en la solicitud: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Datos del usuario:", data);

      setUserData(data);
    } catch (error) {
      console.error("Error al obtener los datos del cliente:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();

    // Forzar scroll al inicio de la página
    const mainElement = document.getElementById("mainContainer");
    if (mainElement) {
      mainElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);


    const startTourInicio = () => {

      
      const driverObj = driver({
        popoverClass: 'driverjs-theme',
        nextBtnText: "Siguiente",
        prevBtnText: "Volver",
        doneBtnText: "Terminar",
        animate: true, // Animaciones entre pasos
        allowClose: false,
        steps: [
          {
            popover: {
              title: "¡Bienvenido a MK!",
              description: "Te guiaremos en un breve recorrido para que descubras todas las funcionalidades.",
              onNextClick: () => {
                setTimeout(() => {
                  const element = document.getElementById("HomeBar");
                  if (element) {
                    console.log("Elemento encontrado:", element);
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                  } else {
                    console.error("Elemento no encontrado: HomeBar");
                  }
                }, 100);
                driverObj.moveNext()
              },
            },
          },
          {
            element: "#buttomHome",
            popover: {
              title: "Inicio",
              description: "Aquí encontrarás un resumen de las principales opciones disponibles.",
              position: "top",
            },
          },
          {
            element: "#QR",
            popover: {
              title: "Código QR",
              description: "Accede a tu código QR para utilizarlo en nuestras tiendas afiliadas.",
              position: "top",
            },
          },
          {
            element: "#PUNTOS",
            popover: {
              title: "Puntos MK",
              description: "Consulta aquí la cantidad de puntos que has acumulado por tus compras.",
              position: "top",
            },
          },
          {
            element: "#TIENDAS",
            popover: {
              title: "Tiendas Cercanas",
              description: "Explora las tiendas más cercanas a tu ubicación y sus beneficios.",
              position: "top",
            },
          },
        ],
        
        onNextClick:() => {
            if(driverObj.isLastStep()){
              console.log("Hola")
                localStorage.setItem("tutorialCompletedInicio", "true");
                setIsTutorialCompletedInicio(true);
            }
            driverObj.moveNext()
        }
     

    });
  
      driverObj.drive();
    };
    useEffect(() => {
      const tutorialCompletedInicio = localStorage.getItem("tutorialCompletedInicio");
      setIsTutorialCompletedInicio(tutorialCompletedInicio);
    
      if (!tutorialCompletedInicio && !loading ) {
        setTimeout(() => {
          startTourInicio();
        }, 1000); // Espera 500ms para asegurarte de que el DOM está listo
      }
    }, [loading]);
    
  return (
    <div className="flex justify-center min-h-screen bg-gray-50 p-4 overflow-auto" id="mainContainer">
      <div className="w-full max-w-md space-y-4">
        {showAllLocations ? (
          <AllLocationsView setShowAllLocations={setShowAllLocations} />
        ) : (
          <>

            <Tabs
              value={activeView}
              onValueChange={setActiveView}
              className="w-full"
              
            >
              <TabsList className="grid w-full grid-cols-3 bg-white" id="HomeBar">
                <TabsTrigger
                  id="buttomHome"
                  value="home"
                  className="data-[state=active]:bg-brand data-[state=active]:text-white"
                >
                  <Home className="w-5 h-5" />
                </TabsTrigger>
                <TabsTrigger
                  id="buttomTickets"
                  value="tickets"
                  className="data-[state=active]:bg-brand data-[state=active]:text-white"
                >
                  <ReceiptText className="w-5 h-5" />
                </TabsTrigger>
                <TabsTrigger
                  id="buttomPedidos"
                  value="pedidos"
                  className="data-[state=active]:bg-brand data-[state=active]:text-white"
                >
                  <ShoppingBag className="w-5 h-5" />
                </TabsTrigger>
                <TabsTrigger
                  id="buttomDescuentos"
                  value="descuentos"
                  className="data-[state=active]:bg-brand data-[state=active]:text-white hidden"
                >
                  <PercentDiamond className="w-5 h-5" />
                </TabsTrigger>
              </TabsList>
              <TabsContent value="home">
                <HomeView
                  setShowAllLocations={setShowAllLocations}
                  userData={userData}
                />
              </TabsContent>
              <TabsContent value="tickets">
                <TicketsView userData={userData} />
              </TabsContent>
              <TabsContent value="pedidos">
                <PedidosView userData={userData} />
              </TabsContent>
              <TabsContent value="descuentos">
                <DescuentosView userData={userData} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
