"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Navigation, Search, ExternalLink, Star, MessageSquarePlus } from "lucide-react";

export default function LocalesPage() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Get user location
  useEffect(() => {
    let isMounted = true;

    const getLocation = async () => {
      try {
        const permission = await navigator.permissions.query({ name: "geolocation" });

        if (permission.state === "granted" || permission.state === "prompt") {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              if (isMounted) {
                setCurrentPosition({
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                });
              }
            },
            () => {
              if (isMounted) {
                setCurrentPosition({ lat: -34.64039930091608, lng: -58.52714949271773 });
              }
            }
          );
        } else {
          if (isMounted) {
            setCurrentPosition({ lat: -34.64039930091608, lng: -58.52714949271773 });
          }
        }
      } catch {
        if (isMounted) {
          setCurrentPosition({ lat: -34.64039930091608, lng: -58.52714949271773 });
        }
      }
    };

    getLocation();
    return () => { isMounted = false; };
  }, []);

  // Load stores from API with cache
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadStores = async () => {
      try {
        const response = await fetch("/api/stores", { signal: controller.signal });
        if (!response.ok) throw new Error("Error loading stores");

        const data = await response.json();

        if (isMounted) {
          setStores(data);
          setLoading(false);
        }
      } catch (error) {
        if (error.name !== 'AbortError' && isMounted) {
          console.error("Error loading stores:", error);
          setLoading(false);
        }
      }
    };

    loadStores();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  // Calculate distance (Haversine)
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const toRadians = (deg) => (deg * Math.PI) / 180;
    const R = 6371;
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  // Filter and sort stores
  const filteredStores = useMemo(() => {
    let result = [...stores];

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (store) =>
          store.name.toLowerCase().includes(query) ||
          store.address.toLowerCase().includes(query)
      );
    }

    // Sort by distance
    if (currentPosition) {
      result.sort(
        (a, b) =>
          calculateDistance(currentPosition.lat, currentPosition.lng, a.lat, a.lng) -
          calculateDistance(currentPosition.lat, currentPosition.lng, b.lat, b.lng)
      );
    }

    return result;
  }, [stores, searchQuery, currentPosition]);

  const formatAddress = (addressShort) => {
    if (!addressShort || addressShort.length < 4) {
      return "Dirección no disponible";
    }
    return `${addressShort[1]?.shortText || ''} ${addressShort[0]?.shortText || ''}, ${addressShort[2]?.shortText || ''}, ${addressShort[3]?.shortText || ''}`;
  };

  const getDistance = (store) => {
    if (!currentPosition) return null;
    const dist = calculateDistance(currentPosition.lat, currentPosition.lng, store.lat, store.lng);
    return dist < 1 ? `${Math.round(dist * 1000)}m` : `${dist.toFixed(1)}km`;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full rounded-lg" />
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Buscar local..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white border-none shadow-sm"
        />
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500">
        {filteredStores.length} {filteredStores.length === 1 ? 'local encontrado' : 'locales encontrados'}
      </p>

      {/* Stores list */}
      {filteredStores.length === 0 ? (
        <Card className="border-none shadow-sm">
          <CardContent className="py-12 text-center">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No se encontraron locales</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredStores.map((store) => (
            <Card key={store.id} className="border-none shadow-sm overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate">{store.name}</h3>
                    <div className="flex items-start gap-1 mt-1">
                      <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {formatAddress(store.addressShort)}
                      </p>
                    </div>
                    {/* Rating */}
                    {store.rating && (
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium text-gray-700">{store.rating}</span>
                      </div>
                    )}
                  </div>
                  {getDistance(store) && (
                    <div className="flex items-center gap-1 text-sm text-brand bg-brand/10 px-2 py-1 rounded-full">
                      <Navigation className="w-3 h-3" />
                      <span>{getDistance(store)}</span>
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-2 mt-3">
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
