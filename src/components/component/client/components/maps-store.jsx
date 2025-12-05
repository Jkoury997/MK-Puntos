import React, { useState, useEffect } from "react";
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from "@vis.gl/react-google-maps";
import { Card } from "@/components/ui/card";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

function Mapastores({ onSelectStore }) {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [stores, setStores] = useState([]); // Estado para las stores

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
  

  // Cargar datos de stores desde el archivo JSON
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
            if (typeof store.location?.latitude === "number" && typeof store.location?.longitude === "number") {
              return {
                id: key,
                name: store.displayName.text || "Sin nombre",
                lat: store.location.latitude,
                lng: store.location.longitude,
                address: store.formattedAddress || "Sin dirección",
                addressShort:store.addressComponents,
                placeUri:store.googleMapsLinks.placeUri,
                writeReview:store.googleMapsLinks.writeAReviewUri
              };
            }
            return null; // Ignorar si lat o lng no son válidos
          })
          .filter((store) => store !== null); // Eliminar stores inválidas

        setStores(storesArray);
        
      } catch (error) {
        console.error("Error cargando stores:", error);
      }
    };

    loadStores();
  }, []);

  if (!currentPosition) {
    return <div>Cargando mapa...</div>;
  }

  const handleStoreSelect = (store) => {
    setSelectedStore(store);
    if (onSelectStore) {
      onSelectStore(store);
    }
  };

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} loading="lazy">
      
      <Map
        
        defaultZoom={10}
        disableDefaultUI={true}
        defaultCenter={currentPosition}
        zoomControl={true}
        gestureHandling="greedy"
        id="350058ab3cbd6ea4"
        mapId="350058ab3cbd6ea4"
      >
        {/* User's current position marker */}
        <AdvancedMarker position={currentPosition} title="Mi ubicación actual">
          <Pin background="#00acff" borderColor="#ffffff" glyphColor="#ffffff" />
        </AdvancedMarker>

        {/* Store markers */}
        {stores.map((store) => (
          <AdvancedMarker
            key={store.id}
            position={{ lat: store.lat, lng: store.lng }}
            onClick={() => handleStoreSelect(store)}
          >

              <Pin background="#df7eb2" borderColor="#ffffff" glyphColor="#ffffff" />
          </AdvancedMarker>
        ))}

      </Map>

    </APIProvider>
  );
}

export default Mapastores;
