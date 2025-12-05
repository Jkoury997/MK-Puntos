"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { MapPin, Clock, ExternalLink, Navigation, MessageCircle } from "lucide-react"
import Image from "next/image"

export function StoreDetailsModal({ store, onClose }) {
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
        return "bg-secondary text-secondary-foreground"
      case "online":
        return "bg-accent text-accent-foreground"
      case "both":
        return "bg-primary text-primary-foreground"
    }
  }

  const days = [
    { key: "monday", label: "Lunes" },
    { key: "tuesday", label: "Martes" },
    { key: "wednesday", label: "Miércoles" },
    { key: "thursday", label: "Jueves" },
    { key: "friday", label: "Viernes" },
    { key: "saturday", label: "Sábado" },
    { key: "sunday", label: "Domingo" },
  ]

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${store.location.lat},${store.location.lng}`
    window.open(url, "_blank")
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3 pb-2">
            <DialogTitle className="text-2xl font-semibold text-foreground pr-8 tracking-tight">
              {store.name}
            </DialogTitle>
            <Badge className={`${getStoreTypeColor(store.type)} shrink-0 mt-1 rounded-full px-3 py-1 font-medium`}>
              {getStoreTypeLabel(store.type)}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Store Image */}
          {store.image && (
            <div className="relative w-full h-48 rounded-xl overflow-hidden">
              <Image src={store.image || "/placeholder.svg"} alt={store.name} fill className="object-cover" />
            </div>
          )}

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed font-light text-sm">{store.description}</p>

          {/* Using acordeón para organizar mejor la información */}
          <Accordion type="single" collapsible className="w-full">
            {/* Address Accordion Item */}
            <AccordionItem value="address" className="border-border/50">
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex items-center gap-2 text-foreground font-medium text-sm">
                  <MapPin className="h-4 w-4" style={{ color: "#df7eb2" }} />
                  <span>Dirección</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-1">
                <p className="text-muted-foreground font-light text-sm mb-3">{store.address}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-border/70 hover:border-[#df7eb2] hover:bg-[#df7eb2]/5 rounded-full"
                  onClick={openGoogleMaps}
                >
                  <Navigation className="h-3 w-3 mr-2" />
                  Cómo llegar
                </Button>
              </AccordionContent>
            </AccordionItem>

            {/* Hours Accordion Item */}
            <AccordionItem value="hours" className="border-border/50">
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex items-center gap-2 text-foreground font-medium text-sm">
                  <Clock className="h-4 w-4" style={{ color: "#df7eb2" }} />
                  <span>Horarios de Atención</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-1">
                <div className="space-y-2">
                  {days.map(({ key, label }) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-muted-foreground font-light">{label}</span>
                      <span className="text-foreground font-medium">{store.hours[key]}</span>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Contact Accordion Item */}
            <AccordionItem value="contact" className="border-border/50">
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex items-center gap-2 text-foreground font-medium text-sm">
                  <MessageCircle className="h-4 w-4" style={{ color: "#df7eb2" }} />
                  <span>Contacto</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-1">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground font-light">WhatsApp</span>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-green-600 font-medium"
                      onClick={() => window.open(`https://wa.me/${store.whatsapp.replace(/[^0-9]/g, "")}`, "_blank")}
                    >
                      {store.whatsapp}
                    </Button>
                  </div>
                  {store.website && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground font-light">Sitio Web</span>
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0 font-medium"
                        style={{ color: "#df7eb2" }}
                        onClick={() => window.open(store.website, "_blank")}
                      >
                        Visitar sitio
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  )}
                  {store.instagram && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground font-light">Instagram</span>
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0 font-medium"
                        style={{ color: "#df7eb2" }}
                        onClick={() => window.open(store.instagram, "_blank")}
                      >
                        Seguir en Instagram
                      </Button>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="space-y-2 pt-2">
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full h-11 font-medium transition-all shadow-sm"
              onClick={() => window.open(`https://wa.me/${store.whatsapp.replace(/[^0-9]/g, "")}`, "_blank")}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Contactar por WhatsApp
            </Button>

            <div className="grid grid-cols-2 gap-2">
              {store.website && (
                <Button
                  className="w-full rounded-full h-11 font-medium transition-all shadow-sm text-sm"
                  style={{ backgroundColor: "#df7eb2", color: "white" }}
                  onClick={() => window.open(store.website, "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Sitio Web
                </Button>
              )}

              {store.instagram && (
                <Button
                  variant="outline"
                  className="w-full rounded-full h-11 font-medium transition-all border-2 hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 hover:text-white hover:border-transparent bg-transparent text-sm"
                  style={{ borderColor: "#df7eb2", color: "#df7eb2" }}
                  onClick={() => window.open(store.instagram, "_blank")}
                >
                  <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  Instagram
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
