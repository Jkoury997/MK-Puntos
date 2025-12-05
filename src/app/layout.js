import { Inter } from "next/font/google";
import "driver.js/dist/driver.css";
import "./globals.css";

const APP_NAME = "MK Puntos";
const APP_DEFAULT_TITLE = "Marcela Koury by Make You S.R.L. App";
const APP_TITLE_TEMPLATE = "MK Puntos";
const APP_DESCRIPTION = "Marcela Koury Puntos";

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
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
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
