import { Card,CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function SearchClient({ busqueda, onBusqueda }) {
    return (
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 " />
            <Input
              type="text"
              placeholder="Buscar clientes..."
              value={busqueda}
              onChange={(e) => onBusqueda(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </CardContent>
      </Card>
    )
  }