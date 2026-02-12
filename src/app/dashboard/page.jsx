"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/contexts/UserContext";
import QRCode from "react-qr-code";
import { QrCode, Star, ExternalLink } from "lucide-react";
import MapaStores from "@/components/component/client/components/maps-store";

export default function DashboardPage() {
  const { userData, loading } = useUser();
  const [store, setStore] = useState(null);
  const [qr, setQr] = useState(null);
  const storeInfoRef = useRef(null);

  useEffect(() => {
    if (userData?.dni) {
      setQr(`Id${userData.dni}Id`);
    }
  }, [userData]);

  const handleStoreSelection = (selectedStore) => {
    setStore(selectedStore);

    // Cleanup: use ref instead of setTimeout
    const scrollTimeout = setTimeout(() => {
      if (storeInfoRef.current) {
        storeInfoRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);

    return () => clearTimeout(scrollTimeout);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* QR Code Card */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2 text-center">
          <CardTitle className="text-lg">Tu Código QR</CardTitle>
          <CardDescription>Mostralo en tiendas para acumular puntos</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-6">
          {qr ? (
            <div className="bg-white p-4 rounded-2xl shadow-inner border">
              <QRCode size={160} value={qr} level="H" bgColor="#fff" />
            </div>
          ) : (
            <div className="bg-gray-100 p-8 rounded-2xl">
              <QrCode className="w-24 h-24 text-gray-400" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Nearby Stores Card */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Locales Cercanos</CardTitle>
          <CardDescription>Encuentra tiendas cerca de ti</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="aspect-video relative rounded-lg overflow-hidden border">
            <MapaStores onSelectStore={handleStoreSelection} />
          </div>

          {store && (
            <Card className="border bg-gray-50" ref={storeInfoRef}>
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-base">{store.name}</CardTitle>
                <CardDescription className="text-sm">
                  {store.addressShort?.[1]?.shortText || ''}{' '}
                  {store.addressShort?.[0]?.shortText || ''},{' '}
                  {store.addressShort?.[2]?.shortText || ''},{' '}
                  {store.addressShort?.[3]?.shortText || ''}
                </CardDescription>
              </CardHeader>
              <CardFooter className="pb-4 flex gap-2">
                <Button
                  className="flex-1 bg-brand hover:bg-brand/90"
                  onClick={() => window.open(store.placeUri, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ver en Maps
                </Button>
                {store.writeReviewUri && (
                  <Button
                    variant="outline"
                    className="flex-1 border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                    onClick={() => window.open(store.writeReviewUri, '_blank')}
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Recomendar
                  </Button>
                )}
              </CardFooter>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
