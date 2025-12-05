import { DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuContent, DropdownMenu } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { CircleUserIcon } from "lucide-react";

export function UserDropMenu() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout');
      const data = await response.json();
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleProfileRedirect = () => {
    const useruuid = Cookies.get('useruuid'); // Asegúrate de que 'useruuid' es el nombre de tu cookie
    if (useruuid) {
      router.push(`/dashboard/profile?useruuid=${useruuid}`);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
      <Button className="rounded-full" size="icon" variant="ghost">
      <CircleUserIcon  className="h-8 w-8" />
      <span className="sr-only">Toggle user menu</span>
    </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleProfileRedirect}>Mi Perfil</DropdownMenuItem>
        <DropdownMenuItem className="hidden">Configuración</DropdownMenuItem>
        <DropdownMenuItem className="hidden">Ayuda</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Cerrar sesión</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
