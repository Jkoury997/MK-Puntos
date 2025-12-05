import { TerminalSquare, Bot, LifeBuoy, Send, Frame, PieChart, Map, Store } from "lucide-react";

export const navComercio = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Inicio",
      url: "/comercio",
      icon: TerminalSquare,
      isActive: true,
      roles: ["admin", "comercio"], // Roles permitidos
      items: [
        {
          title: "Métricas",
          url: "/admin/metrics",
          roles: ["admin"], // Roles permitidos para el sublink
        },
      ],
    },
    {
      title: "Tienda",
      url: "#",
      icon: Store,
      roles: ["admin"], // Solo para admin
      items: [
        {
          title: "Lista",
          url: "/comercio/tienda/list",
          roles: ["admin"],
        },
        {
          title: "Crear",
          url: "/comercio/tienda/crear",
          roles: ["admin"],
        },
      ],
    },
  ],
};
