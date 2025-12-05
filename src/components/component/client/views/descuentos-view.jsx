"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Image from "next/image"
import { MapPin, MapPinned, Phone } from "lucide-react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"

// Datos de ejemplo actualizados para las tarjetas de descuento
const discountCards = [
  {
    id: 1,
    title: "10% de descuento",
    description: "En todas las compras",
    category: "general",
    code: "FIDELIDAD10",
    address: "Calle Principal 123, Ciudad",
    googleMapsUrl: "https://goo.gl/maps/example1",
    whatsapp: "+1234567890",
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 2,
    title: "15% de descuento",
    description: "En productos de tecnología",
    category: "tecnologia",
    code: "TECH15",
    address: "Avenida Tecnológica 456, Ciudad",
    googleMapsUrl: "https://goo.gl/maps/example2",
    whatsapp: "+0987654321",
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 3,
    title: "20% de descuento",
    description: "En ropa y accesorios",
    category: "moda",
    code: "MODA20",
    address: "Plaza de la Moda 789, Ciudad",
    googleMapsUrl: "https://goo.gl/maps/example3",
    whatsapp: "+1122334455",
    image: "/images/pelu.jpg?height=400&width=300",
  },
  {
    id: 4,
    title: "5% de descuento",
    description: "En supermercados",
    category: "alimentacion",
    code: "SUPER5",
    address: "Avenida de los Alimentos 101, Ciudad",
    googleMapsUrl: "https://goo.gl/maps/example4",
    whatsapp: "+5544332211",
    image: "/placeholder.svg?height=400&width=300",
  },
]

const categories = [
  { value: "all", label: "Todas las categorías" },
  { value: "general", label: "General" },
  { value: "tecnologia", label: "Tecnología" },
  { value: "moda", label: "Moda" },
  { value: "alimentacion", label: "Alimentación" },
]

export default function DiscountCards() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [activeQR, setActiveQR] = useState(null)
  const [emblaRef, emblaApi] = useEmblaCarousel()
  const [selectedIndex, setSelectedIndex] = useState(0)

  const filteredCards =
    selectedCategory === "all"
      ? discountCards
      : discountCards.filter((card) => card.category === selectedCategory)

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on("select", () => {
        setSelectedIndex(emblaApi.selectedScrollSnap())
      })
    }
  }, [emblaApi])

  return (
    <div className="container max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold  mb-8">Comunidad MK</h1>
      <div className="mb-6">
        <Select onValueChange={setSelectedCategory} defaultValue={selectedCategory}>
          <SelectTrigger className="w-full sm:w-[280px]">
            <SelectValue placeholder="Selecciona una categoría" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Carousel ref={emblaRef} className="w-full max-w-lg mx-auto" plugins={[
        Autoplay({
          delay: 2000,
        }),
      ]}>
        <CarouselContent>
          {filteredCards.map((card) => (
            <CarouselItem key={card.id}>
              <div className="p-1">
                <Card className="relative overflow-hidden h-[500px]">
                  <Image
                    src={card.image || "/placeholder.svg"}
                    alt={`Imagen de ${card.title}`}
                    layout="fill"
                    objectFit="cover"
                    className="absolute inset-0 z-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                  <div className="relative z-20 h-full flex flex-col justify-between">
                    <CardHeader>
                      <CardTitle className="text-white">{card.title}</CardTitle>
                      <CardDescription className="text-gray-200">{card.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="bg-black/50 pt-2">
                      <Badge variant="secondary" className="mb-2">
                        {categories.find((c) => c.value === card.category)?.label}
                      </Badge>

                      <div className="space-y-2 text-white ">
                        <p className="flex items-center gap-2" onClick={() => window.open(card.googleMapsUrl, "_blank")}>
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{card.address}</span>
                          
                        </p>
                        <p className="flex items-center gap-2" onClick={() => window.open(`https://wa.me/${card.whatsapp}`, "_blank")}>
                          <Phone className="w-4 h-4" />
                          <span className="text-sm">{card.whatsapp}</span>
                        </p>
                      </div>

                      {activeQR === card.id && (
                        <div className="mt-4 flex flex-col items-center bg-white/80 p-2 rounded">
                          <Image
                            src="/placeholder.svg?height=100&width=100"
                            alt="Código QR"
                            width={100}
                            height={100}
                            className="mb-2"
                          />
                          <span className="font-mono text-sm text-black">{card.code}</span>
                        </div>
                      )}
<div className="flex flex-col gap-2 pt-2">
  <Button
    className="w-full bg-brand text-white hover:bg-brand" 
    onClick={() => setActiveQR(activeQR === card.id ? null : card.id)}
  >
    {activeQR === card.id ? "Ocultar código" : "Mostrar código QR"}
  </Button>
</div>

                    </CardContent>
                  </div>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious  className="ms-5"/>
        <CarouselNext className="me-5" />
      </Carousel>


    </div>
  )
}
