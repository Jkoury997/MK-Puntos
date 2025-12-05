"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Filter, Store, Globe, MessageCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function StoreFilters({ filters, onFiltersChange, totalStores }) {
  const activeFilterCount =
    (filters.type !== "all" ? 1 : 0) + (filters.hasWebsite ? 1 : 0) + (filters.hasWhatsapp ? 1 : 0)

  const handleClearFilters = () => {
    onFiltersChange({
      type: "all",
      hasWebsite: false,
      hasWhatsapp: false,
    })
  }

  return (
    <div className="flex flex-col gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 bg-card h-11 px-4 text-sm font-medium border-border/70 hover:border-[#c566a0] hover:bg-[#c566a0] hover:text-white rounded-full transition-all"
          >
            <Filter className="h-4 w-4 text-current" />

            {activeFilterCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-bold bg-primary text-white"
              >
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel className="text-sm font-semibold">Tipo de tienda</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={filters.type === "physical"}
            onCheckedChange={(checked) => onFiltersChange({ ...filters, type: checked ? "physical" : "all" })}
            className="py-2"
          >
            <Store className="h-4 w-4 mr-2" />
            <span className="text-sm font-light">Tienda física</span>
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.type === "online"}
            onCheckedChange={(checked) => onFiltersChange({ ...filters, type: checked ? "online" : "all" })}
            className="py-2"
          >
            <Globe className="h-4 w-4 mr-2" />
            <span className="text-sm font-light">Tienda online</span>
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-sm font-semibold">Servicios disponibles</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={filters.hasWebsite}
            onCheckedChange={(checked) => onFiltersChange({ ...filters, hasWebsite: checked })}
            className="py-2"
          >
            <Globe className="h-4 w-4 mr-2" />
            <span className="text-sm font-light">Con sitio web</span>
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.hasWhatsapp}
            onCheckedChange={(checked) => onFiltersChange({ ...filters, hasWhatsapp: checked })}
            className="py-2"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            <span className="text-sm font-light">Con WhatsApp</span>
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
