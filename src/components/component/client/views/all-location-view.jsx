import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, ChevronLeft, Star } from "lucide-react";

export default function AllLocationsView({ setShowAllLocations }) {
  const [stores, setStores] = useState([]); // Estado para las tiendas
  const [currentPosition, setCurrentPosition] = useState(null);

  // Obtener la ubicación del usuario
  useEffect(() => {
    const getLocation = async () => {
      try {
        const permission = await navigator.permissions.query({ name: "geolocation" });
        if (permission.state === "granted") {
          navigator.geolocation.getCurrentPosition((position) => {
            setCurrentPosition({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          });
        } else if (permission.state === "prompt") {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setCurrentPosition({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
            },
            (error) => {
              console.error("Error obteniendo la ubicación:", error);
              setCurrentPosition({ lat: -34.64039930091608, lng: -58.52714949271773 });
            }
          );
        } else {
          console.error("Permiso de ubicación denegado");
          setCurrentPosition({ lat: -34.64039930091608, lng: -58.52714949271773 });
        }
      } catch (error) {
        console.error("Error verificando permisos:", error);
        setCurrentPosition({ lat: -34.64039930091608, lng: -58.52714949271773 });
      }
    };

    getLocation();
  }, []);

  // Cargar datos de tiendas desde el archivo JSON
  useEffect(() => {
    const loadStores = async () => {
      try {
        const response = await fetch("/places-details.json");
        if (!response.ok) {
          throw new Error(`Error al cargar el archivo JSON: ${response.statusText}`);
        }
        const data = await response.json();

        const storesArray = Object.keys(data)
          .map((key) => {
            const store = data[key];
            if (
              typeof store.location?.latitude === "number" &&
              typeof store.location?.longitude === "number"
            ) {
              return {
                id: key,
                name: store.displayName.text || "Sin nombre",
                lat: store.location.latitude,
                lng: store.location.longitude,
                address: store.formattedAddress || "Sin dirección",
                addressShort:store.addressComponents,
                placeUri: store.googleMapsLinks.placeUri,
                writeReview: store.googleMapsLinks.writeAReviewUri,
              };
            }
            return null; // Ignorar si lat o lng no son válidos
          })
          .filter((store) => store !== null); // Eliminar tiendas inválidas

        setStores(storesArray);
      } catch (error) {
        console.error("Error cargando tiendas:", error);
      }
    };

    loadStores();
  }, []);

  // Función para calcular la distancia entre dos puntos (Haversine)
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const toRadians = (degrees) => (degrees * Math.PI) / 180;
    const R = 6371; // Radio de la Tierra en kilómetros
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distancia en kilómetros
  };

  // Ordenar las tiendas por cercanía
  const sortedStores = currentPosition
    ? stores.sort(
        (a, b) =>
          calculateDistance(currentPosition.lat, currentPosition.lng, a.lat, a.lng) -
          calculateDistance(currentPosition.lat, currentPosition.lng, b.lat, b.lng)
      )
    : stores;

  return (
    <Card className="w-full max-w-md border-none shadow-none bg-transparent">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-gray-800">Todos los Locales</CardTitle>
        <Button variant="ghost" onClick={() => setShowAllLocations(false)}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Volver
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="rounded-md border p-4">
          {sortedStores.map((store) => (
            <Card key={store.id} className="mb-4 last:mb-0">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2">{store.name}</h3>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <MapPin className="w-6 h-6 mr-2" />
                  <span>{store.addressShort[1].shortText + " "+store.addressShort[0].shortText+ ", "+store.addressShort[2].shortText + ", " +store.addressShort[3].shortText}</span>
                  
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-2 bg-white text-gray border-none hidden"
                  onClick={() => window.open(store.writeReview)}
                >
                  <Star />
                  <Star />
                  <Star />
                  <Star />
                  <Star />
                </Button>
                <Button
                  variant="outline"
                  className="w-full mt-2 bg-brand text-white"
                  onClick={() => window.open(store.placeUri)}
                >
                  Ver en Mapa
                </Button>
              </CardContent>
            </Card>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
