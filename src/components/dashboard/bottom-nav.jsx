"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, ReceiptText, ShoppingBag, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Inicio' },
  { href: '/dashboard/tickets', icon: ReceiptText, label: 'Tickets' },
  { href: '/dashboard/pedidos', icon: ShoppingBag, label: 'Pedidos' },
  { href: '/dashboard/locales', icon: MapPin, label: 'Locales' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors min-w-[60px]",
                  isActive
                    ? "text-brand bg-brand/10"
                    : "text-gray-500 hover:text-brand hover:bg-gray-50"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive && "text-brand")} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
      {/* Safe area for iOS */}
      <div className="h-safe-area-inset-bottom bg-white" />
    </nav>
  );
}
