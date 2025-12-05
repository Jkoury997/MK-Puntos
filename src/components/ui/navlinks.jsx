'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from 'clsx';
import { HomeIcon, UserRound, ChevronDown } from "lucide-react";
import { decode } from 'jsonwebtoken';
import Cookies from 'js-cookie';

// Definir enlaces comunes para todos los usuarios
const usuarioLinks = [
  { 
    name: 'Inicio', 
    href: '/dashboard', 
    icon: HomeIcon 
  },
];

// Definir enlaces para recursos humanos
const recursosHumanosLinks = [
  { 
    name: 'Inicio', 
    href: '/dashboard', 
    icon: HomeIcon 
  },
  { 
    name: 'Personal', 
    href: '/dashboard/recursoshumanos', 
    icon: UserRound,
    subLinks: [
      { 
        name: 'Lista', 
        href: '/dashboard/recursoshumanos/employed/list' 
      },
      { 
        name: 'Modificar asistencia', 
        href: '/dashboard/recursoshumanos/employed/attendance/modify' 
      },
    ] 
  },
];

// Definir enlaces para admin (incluye los enlaces de recursos humanos)
const adminLinks = [
  ...recursosHumanosLinks,  // Usar spread operator para incluir enlaces de recursos humanos
  { 
    name: 'Admin', 
    href: '/dashboard/admin', 
    icon: UserRound,
    subLinks: [
      { 
        name: 'Zona', 
        href: '/dashboard/admin/zone' 
      },
      { 
        name: 'Crear zona', 
        href: '/dashboard/admin/zone/create' 
      },
    ] 
  },
];

// Definir enlaces según el rol
const linksByRole = {
  recursos_humanos: recursosHumanosLinks,
  admin: adminLinks,
  usuario: usuarioLinks,
};

export function NavLinks() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState({});
  const [role, setRole] = useState(null); // Estado para el rol

  useEffect(() => {
    // Leer el token de las cookies
    const token = Cookies.get('accessToken');
    if (token) {
      // Decodificar el token para extraer el rol
      const decodedToken = decode(token);
      setRole(decodedToken?.role);
    }
  }, []);

  const toggleMenu = (name) => {
    setOpenMenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  if (!role) {
    return null; // Mostrar un loader o algo similar mientras se obtiene el rol
  }

  // Obtener los enlaces correspondientes al rol
  const links = linksByRole[role] || [];

  return (
    <>
      {links.map((link, index) => {
        const LinkIcon = link.icon;
        const isActive = pathname === link.href || link.subLinks?.some(subLink => pathname === subLink.href);
        return (
          <div key={`${link.name}-${index}`}>
            {link.subLinks && link.subLinks.length > 0 ? (
              <>
                <div
                  className={clsx(
                    'flex items-center justify-between gap-3 rounded-lg px-3 py-2 transition-all cursor-pointer',
                    {
                      'text-gray-500 hover:text-gray-900': !isActive,
                      'bg-gray-100 text-gray-900 hover:text-gray-900': isActive,
                    }
                  )}
                  onClick={() => toggleMenu(link.name)}
                >
                  <div className="flex items-center gap-3">
                    <LinkIcon className="h-4 w-4" />
                    {link.name}
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openMenus[link.name] ? 'rotate-180' : ''}`} />
                </div>
                {openMenus[link.name] && (
                  <div className="pl-6">
                    {link.subLinks.map((subLink, subIndex) => (
                      <Link
                        key={`${subLink.name}-${subIndex}`}
                        href={subLink.href}
                        className={clsx(
                          'flex items-center gap-3 rounded-lg px-3 py-2 transition-all mt-1',
                          {
                            'text-gray-500 hover:text-gray-900': pathname !== subLink.href,
                            'bg-gray-100 text-gray-900 hover:text-gray-900': pathname === subLink.href,
                          }
                        )}
                      >
                        {subLink.name}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                href={link.href}
                className={clsx(
                  'flex items-center gap-3 rounded-lg px-3 py-2 transition-all',
                  {
                    'text-gray-500 hover:text-gray-900': pathname !== link.href,
                    'bg-gray-100 text-gray-900 hover:text-gray-900': pathname === link.href,
                  }
                )}
              >
                <div className="flex items-center gap-3">
                  <LinkIcon className="h-4 w-4" />
                  {link.name}
                </div>
              </Link>
            )}
          </div>
        );
      })}
    </>
  );
}
