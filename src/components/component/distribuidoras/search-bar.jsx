"use client"

import { useState } from "react"
import { Search, Loader2, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function SearchBar({ onSearch, onUseCurrentLocation, isLoadingLocation }) {
  const [address, setAddress] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSearch = () => {
    if (!address.trim()) return
    setLoading(true)
    onSearch(address)
    setTimeout(() => setLoading(false), 1000)
  }

  return (
    <div className="flex gap-2">
      <div className="flex-1 relative">
        <Input
          type="text"
          placeholder="Buscar por dirección..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          className="pr-10 h-11 text-sm bg-card border-border/70 rounded-full focus:border-primary transition-all font-light"
        />
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 hover:bg-[#c566a0] hover:text-white rounded-full text-primary transition-all"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </Button>
      </div>
      <Button
        size="icon"
        variant="outline"
        onClick={onUseCurrentLocation}
        disabled={isLoadingLocation}
        className="shrink-0 h-11 w-11 bg-card border-border/70 hover:border-[#c566a0] hover:bg-[#c566a0] hover:text-white rounded-full transition-all text-primary"
        title="Usar mi ubicación actual"
      >
        {isLoadingLocation ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
      </Button>
    </div>
  )
}
