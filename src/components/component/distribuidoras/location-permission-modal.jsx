"use client"

import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LocationPermissionModal({ onRequestPermission, onUseManualMode }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
            <MapPin className="w-10 h-10 text-primary" />
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-light tracking-wide text-foreground">Necesitamos tu ubicación</h2>
            <p className="text-sm text-muted-foreground leading-relaxed font-light">
              Para mostrarte las tiendas Marcela Koury más cercanas, necesitamos acceder a tu ubicación actual.
            </p>
          </div>

          <div className="w-full space-y-3 pt-2">
            <Button
              onClick={onRequestPermission}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-full font-light tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Permitir ubicación
            </Button>

            <Button
              onClick={onUseManualMode}
              variant="outline"
              className="w-full h-12 border-border/70 hover:bg-muted/50 rounded-full font-light tracking-wide transition-all bg-transparent"
            >
              Usar modo manual
            </Button>
          </div>

          <p className="text-xs text-muted-foreground/60 font-light">
            Tu privacidad es importante. Solo usamos tu ubicación para encontrar tiendas cercanas.
          </p>
        </div>
      </div>
    </div>
  )
}
