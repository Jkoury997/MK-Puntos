"use client"

import { useEffect, useRef } from "react"

export function MapView({ center, stores, onStoreClick, hoveredStoreId, userLocation, searchedAddress }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef(new Map())
  const userMarkerRef = useRef(null)
  const searchMarkerRef = useRef(null)
  const googleRef = useRef(null)

  useEffect(() => {
    const initMap = async () => {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

      if (!apiKey) {
        console.error("[v0] No API Key found - Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to environment variables")
        return
      }

      console.log("[v0] Starting map initialization...")

      if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
        const script = document.createElement("script")
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly&libraries=marker`
        script.async = true
        script.defer = true

        await new Promise((resolve, reject) => {
          script.onload = resolve
          script.onerror = () => reject(new Error("Error loading Google Maps"))
          document.head.appendChild(script)
        })
      }

      await new Promise((resolve) => {
        const checkGoogleMaps = setInterval(() => {
          if (window.google?.maps?.Map) {
            clearInterval(checkGoogleMaps)
            resolve()
          }
        }, 100)
      })

      googleRef.current = window.google
      const google = googleRef.current

      if (mapRef.current && !mapInstanceRef.current) {
        console.log("[v0] Creating map instance with", stores?.length, "stores")

        mapInstanceRef.current = new google.maps.Map(mapRef.current, {
          center,
          zoom: 13,
          mapId: "STORE_LOCATOR_MAP",
          // ❌ Saca el control de cambiar tipo de mapa (satellite/terrain)
  mapTypeControl: false,

  // ❌ Saca Street View
  streetViewControl: false,

  // ❌ Saca fullscreen
  fullscreenControl: false,

  // ❌ Saca zoom +
  zoomControl: false,

  // ❌ Saca el control de rotación
  rotateControl: false,

  // ❌ Saca el control de escala
  scaleControl: false,

  // Dejá solo el mapa limpio
  gestureHandling: "greedy",
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        })

        userMarkerRef.current = new google.maps.Marker({
          position: center,
          map: mapInstanceRef.current,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#3B82F6",
            fillOpacity: 1,
            strokeColor: "#FFFFFF",
            strokeWeight: 2,
          },
          title: "Tu ubicación",
        })

        if (stores && stores.length > 0) {
          console.log("[v0] Creating initial store markers...")
          stores.forEach((store) => {
            const marker = new google.maps.Marker({
              position: store.location,
              map: mapInstanceRef.current,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: "#df7eb2",
                fillOpacity: 1,
                strokeColor: "#FFFFFF",
                strokeWeight: 2,
              },

              title: store.name,
            })

            marker.addListener("click", () => {
              onStoreClick(store)
            })

            markersRef.current.set(store.id, marker)
          })
          console.log("[v0] Initial markers created:", markersRef.current.size)
        }
      }
    }

    initMap()
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current || !googleRef.current) return

    const google = googleRef.current

    // Limpiar marcadores anteriores
    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current.clear()

    // Crear nuevos marcadores
    if (stores && stores.length > 0) {
      stores.forEach((store) => {
        const isHovered = hoveredStoreId === store.id

        const marker = new google.maps.Marker({
          position: store.location,
          map: mapInstanceRef.current,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: isHovered ? 12 : 10,
            fillColor: "#df7eb2",
            fillOpacity: 1,
            strokeColor: "#FFFFFF",
            strokeWeight: 2,
          },
          title: store.name,
          animation: isHovered ? google.maps.Animation.BOUNCE : null,
        })

        marker.addListener("click", () => {
          onStoreClick(store)
        })

        markersRef.current.set(store.id, marker)
      })
    }
  }, [stores, onStoreClick, hoveredStoreId])

  useEffect(() => {
    if (!mapInstanceRef.current || !googleRef.current) return

    if (userLocation && userMarkerRef.current) {
      userMarkerRef.current.setPosition(userLocation)
      userMarkerRef.current.setVisible(true)
    } else if (userMarkerRef.current) {
      userMarkerRef.current.setVisible(false)
    }
  }, [userLocation])

  useEffect(() => {
    if (!mapInstanceRef.current || !googleRef.current) return

    const google = googleRef.current

    if (searchedAddress) {
      if (!searchMarkerRef.current) {
        searchMarkerRef.current = new google.maps.Marker({
          position: searchedAddress,
          map: mapInstanceRef.current,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#10B981",
            fillOpacity: 1,
            strokeColor: "#FFFFFF",
            strokeWeight: 3,
          },
          title: "Ubicación buscada",
          zIndex: 1000,
        })
      } else {
        searchMarkerRef.current.setPosition(searchedAddress)
        searchMarkerRef.current.setVisible(true)
      }
    } else if (searchMarkerRef.current) {
      searchMarkerRef.current.setVisible(false)
    }
  }, [searchedAddress])

  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.setCenter(center)
    }
  }, [center])

  return <div ref={mapRef} className="w-full h-full" />
}
