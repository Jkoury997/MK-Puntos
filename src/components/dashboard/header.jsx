"use client";

import { useUser } from '@/contexts/UserContext';
import { Coins, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardHeader() {
  const { userData, userPoints, loading } = useUser();

  if (loading) {
    return (
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </header>
    );
  }

  const points = userPoints?.Puntos || 0;
  const formattedPoints = points.toLocaleString('es-AR');

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand/10 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-brand" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">
                {userData?.firstName || 'Usuario'} {userData?.lastName || ''}
              </p>
              <Badge variant="secondary" className="bg-brand/10 text-brand text-xs px-2 py-0">
                {userData?.tier || 'Cliente'}
              </Badge>
            </div>
          </div>

          {/* Points */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-brand/10 to-pink-100 px-3 py-2 rounded-full">
            <Coins className="w-5 h-5 text-brand" />
            <div className="text-right">
              <p className="font-bold text-brand text-lg leading-none">{formattedPoints}</p>
              <p className="text-[10px] text-gray-500">puntos</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
