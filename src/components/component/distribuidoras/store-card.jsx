"use client"

import { MapPin, ExternalLink, Globe, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function StoreCard({ store, onClick }) {
  const getStoreTypeLabel = (type) => {
    switch (type) {
      case "physical":
        return "Tienda Física"
      case "online":
        return "Tienda Online"
      case "both":
        return "Física + Online"
    }
  }

  const getStoreTypeColor = (type) => {
    switch (type) {
      case "physical":
        return "bg-primary/20 text-primary border border-primary/30"
      case "online":
        return "bg-primary/10 text-primary border border-primary/20"
      case "both":
        return "bg-primary text-white"
    }
  }

  const getTodayHours = () => {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const today = days[new Date().getDay()]
    return store.hours[today]
  }

  return (
    <Card
      className="w-full rounded-lg border border-border/50 p-6 cursor-pointer transition-all hover:shadow-lg hover:border-[#c566a0] active:scale-[0.99] my-3 bg-card animate-fade-in"
      onClick={onClick}
    >
      <div className="space-y-4">
        <div className="space-y-3">
          <h3 className="font-semibold text-xl text-foreground leading-tight tracking-tight">{store.name}</h3>
          <div>
            <Badge className={`${getStoreTypeColor(store.type)} text-xs px-3 py-1 font-medium rounded-full`}>
              {getStoreTypeLabel(store.type)}
            </Badge>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
            <span className="leading-relaxed font-light">{store.address}</span>
          </div>

          {store.type !== "online" && (
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 shrink-0 text-primary" />
              <span className="leading-relaxed font-light">Hoy: {getTodayHours()}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 pt-3">
          {store.whatsapp && (
            <Button
              size="lg"
              className="flex-1 min-w-[140px] h-11 text-sm font-medium bg-green-600 hover:bg-green-700 text-white rounded-full transition-all"
              onClick={(e) => {
                e.stopPropagation()
                window.open(`https://wa.me/${store.whatsapp.replace(/[^0-9]/g, "")}`, "_blank")
              }}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
          )}

          {store.website && (
            <Button
              size="lg"
              variant="outline"
              className="flex-1 min-w-[140px] h-11 text-sm font-medium bg-transparent border-primary/30 text-primary hover:border-[#c566a0] hover:bg-[#c566a0] hover:text-white rounded-full transition-all"
              onClick={(e) => {
                e.stopPropagation()
                window.open(store.website, "_blank")
              }}
            >
              <Globe className="h-4 w-4 mr-2" />
              Sitio Web
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
