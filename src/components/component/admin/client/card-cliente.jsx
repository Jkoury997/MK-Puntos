"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Bell, Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog" 


export default function ClienteCard({ cliente, onEditar, onNotificar, onEliminar }) {
    return (
      <Card key={cliente.id} className="hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${cliente.firstName}`} alt={cliente.firstName} />
              <AvatarFallback>{cliente.firstName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">{cliente.firstName}</h2>
              <p className="text-sm text-gray-600">{cliente.email}</p>
              <p className="text-sm text-gray-600">{cliente.dni}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" /> Editar
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Editar Cliente</DialogTitle>
                  <DialogDescription>
                    Realiza cambios en los datos del cliente aquí. Haz clic en guardar cuando hayas terminado.
                  </DialogDescription>
                </DialogHeader>
                {/* Formulario de edición aquí */}
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="sm" onClick={() => onNotificar(cliente.id)}>
              <Bell className="h-4 w-4 mr-1" /> Notificar
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                  <Trash2 className="h-4 w-4 mr-1" /> Eliminar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Esto eliminará permanentemente los datos del cliente de nuestros servidores.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onEliminar(cliente.id)}>Eliminar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    );
  }
  