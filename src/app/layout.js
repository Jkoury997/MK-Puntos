import { Inter } from "next/font/google";
import "driver.js/dist/driver.css";
import "./globals.css";

const APP_NAME = "MK Puntos";
const APP_DEFAULT_TITLE = "MK Puntos - Programa de Fidelidad Marcela Koury";
const APP_TITLE_TEMPLATE = "%s | MK Puntos";
const APP_DESCRIPTION = "Acumula puntos en tus compras, encuentra tiendas cercanas y accede a beneficios exclusivos con MK Puntos de Marcela Koury.";

const inter = Inter({ subsets: ["latin"] });

// API de Metadata de Next.js
export const metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  keywords: ["Marcela Koury", "MK Puntos", "programa de fidelidad", "puntos", "descuentos", "lencería"],
  authors: [{ name: "Marcela Koury" }],
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    locale: "es_AR",
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { GoogleAnalytics } from "@/utils/googleAnlytics/google-analytics";





export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <GoogleAnalytics></GoogleAnalytics>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
