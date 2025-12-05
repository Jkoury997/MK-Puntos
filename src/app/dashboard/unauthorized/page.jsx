import { AlertTriangle, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function AccesoNoPermitido() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
      <div className=" bg-brand text-white rounded-full p-3 inline-block mb-6">
          <AlertTriangle className="h-10 w-10" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso no permitido</h1>
        <p className="text-gray-600 mb-8">
          Lo sentimos, no tienes permiso para acceder a esta página. Si crees que esto es un error, por favor contacta al administrador.
        </p>
        <Button asChild className="w-full bg-brand">
          <Link href="/dashboard" className="inline-flex items-center justify-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Dashboard
          </Link>
        </Button>
      </div>
    </div>
  )
}

