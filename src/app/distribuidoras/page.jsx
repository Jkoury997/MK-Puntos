"use client"

import { useState, useEffect } from "react"
import { MapView } from "@/components/component/distribuidoras/map-view"
import { SearchBar } from "@/components/component/distribuidoras/search-bar"
import { StoreList } from "@/components/component/distribuidoras/store-list"
import { StoreDetailsModal } from "@/components/component/distribuidoras/store-details-modal"
import { StoreFilters } from "@/components/component/distribuidoras/store-filters"
import { LocationPermissionModal } from "@/components/component/distribuidoras/location-permission-modal"
import { mockStores } from "@/lib/mock-data"
import DynamicHeader from "@/components/component/distribuidoras/dynamic-header"

export default function Home() {
  const [showLocationPermission, setShowLocationPermission] = useState(false)
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false)
  const [manualMode, setManualMode] = useState(false)
  const [userLocation, setUserLocation] = useState(null)
  const [searchedAddress, setSearchedAddress] = useState(null)
  const [selectedStore, setSelectedStore] = useState(null)
  const [searchLocation, setSearchLocation] = useState(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [stores, setStores] = useState(mockStores)
  const [filteredStores, setFilteredStores] = useState(mockStores)
  const [hoveredStoreId, setHoveredStoreId] = useState(null)
  const [activeFilters, setActiveFilters] = useState({
    type: "all",
    hasWebsite: false,
    hasWhatsapp: false,
  })

  useEffect(() => {
    const checkLocationPermission = async () => {
      if (!navigator.permissions) {
        setShowLocationPermission(true)
        return
      }

      try {
        const result = await navigator.permissions.query({ name: "geolocation" })

        if (result.state === "granted") {
          requestLocationPermission()
        } else if (result.state === "prompt") {
          setShowLocationPermission(true)
        } else {
          setShowLocationPermission(true)
        }
      } catch (error) {
        setShowLocationPermission(true)
      }
    }

    checkLocationPermission()
  }, [])

  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      setIsLoadingLocation(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setUserLocation(location)
          setSearchLocation(location)
          setLocationPermissionGranted(true)
          setShowLocationPermission(false)
          setIsLoadingLocation(false)
        },
        (error) => {
          console.error("Error obteniendo ubicación:", error)
          const defaultLocation = { lat: -34.6037, lng: -58.3816 }
          setUserLocation(defaultLocation)
          setSearchLocation(defaultLocation)
          setShowLocationPermission(false)
          setIsLoadingLocation(false)
        },
      )
    }
  }

  const useManualMode = () => {
    setManualMode(true)
    setLocationPermissionGranted(false)
    setShowLocationPermission(false)
    const defaultLocation = { lat: -34.6037, lng: -58.3816 }
    setSearchLocation(defaultLocation)
  }

  useEffect(() => {
    if (searchLocation) {
      const storesWithDistance = mockStores.map((store) => {
        const distance = calculateDistance(
          searchLocation.lat,
          searchLocation.lng,
          store.location.lat,
          store.location.lng,
        )
        return { ...store, distance }
      })
      storesWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0))
      setStores(storesWithDistance)
    }
  }, [searchLocation])

  useEffect(() => {
    let filtered = [...stores]

    if (activeFilters.type !== "all") {
      filtered = filtered.filter((store) => {
        if (activeFilters.type === "physical") {
          return store.type === "physical" || store.type === "both"
        }
        if (activeFilters.type === "online") {
          return store.type === "online" || store.type === "both"
        }
        return store.type === activeFilters.type
      })
    }

    if (activeFilters.hasWebsite) {
      filtered = filtered.filter((store) => store.website)
    }

    if (activeFilters.hasWhatsapp) {
      filtered = filtered.filter((store) => store.whatsapp)
    }

    setFilteredStores(filtered)
  }, [stores, activeFilters])

  const handleLocationSearch = async (address) => {
    console.log("[v0] Buscando dirección:", address)
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) return

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`,
      )
      const data = await response.json()

      console.log("[v0] Respuesta de geocoding:", data)

      if (data.results && data.results.length > 0) {
        const location = {
          lat: data.results[0].geometry.location.lat,
          lng: data.results[0].geometry.location.lng,
        }
        console.log("[v0] Nueva ubicación de búsqueda:", location)
        setSearchedAddress(location)
        setSearchLocation(location)
      }
    } catch (error) {
      console.error("Error buscando dirección:", error)
    }
  }

  const handleUseCurrentLocation = () => {
    if (locationPermissionGranted && userLocation) {
      setSearchedAddress(null)
      setSearchLocation(userLocation)
    } else {
      setShowLocationPermission(true)
    }
  }

  if (showLocationPermission) {
    return <LocationPermissionModal onRequestPermission={requestLocationPermission} onUseManualMode={useManualMode} />
  }

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <DynamicHeader 
  title="Marcela Koury"
  subtitle="Panel Mayorista"
  className="bg-MarcelaKoury text-white"
/>


      <div className="bg-card border-b border-border/50 shadow-sm">
        <div className="p-4 flex gap-3 items-start">
          <div className="shrink-0">
            <StoreFilters
              filters={activeFilters}
              onFiltersChange={setActiveFilters}
              totalStores={filteredStores.length}
            />
          </div>
          <div className="flex-1">
            <SearchBar
              onSearch={handleLocationSearch}
              onUseCurrentLocation={handleUseCurrentLocation}
              isLoadingLocation={isLoadingLocation}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-80 md:h-96 relative border-b border-border/50 flex-shrink-0">
          {searchLocation ? (
            <MapView
              center={searchLocation}
              stores={filteredStores}
              onStoreClick={setSelectedStore}
              hoveredStoreId={hoveredStoreId}
              userLocation={userLocation}
              searchedAddress={searchedAddress}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-muted/30">
              <div className="text-center p-6">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-solid border-secondary border-r-transparent mb-3" />
                <p className="text-sm text-muted-foreground font-light">Cargando ubicación...</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto bg-background">
          <StoreList stores={filteredStores} onStoreClick={setSelectedStore} onStoreHover={setHoveredStoreId} />
        </div>
      </div>

      {selectedStore && <StoreDetailsModal store={selectedStore} onClose={() => setSelectedStore(null)} />}
    </main>
  )
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

