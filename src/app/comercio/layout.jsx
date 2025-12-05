"use client";

import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SideBarLinks from "@/components/component/sidebar/sidebar-links";
import { initializeSocket, disconnectSocket } from "@/hooks/useSocket";
import Cookies from "js-cookie"; 
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast"; 
import { navComercio } from "@/app/comercio/data/comercio"

export default function DashboardLayout({ children }) {
  const { toast } = useToast();
  const [userInteracted, setUserInteracted] = useState(false);
  const name = "Comercio"


  return (
    <SidebarProvider>
      <SideBarLinks name={name} navLinks={navComercio} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 " />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
        </header>
        <Toaster />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
