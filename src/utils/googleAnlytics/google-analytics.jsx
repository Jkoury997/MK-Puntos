'use client';

import { useEffect } from 'react';
import Script from 'next/script'; // Importa Script para manejar los scripts de terceros
import { usePathname } from 'next/navigation';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function GoogleAnalytics({ searchParams }) {
  const pathname = usePathname();

  useEffect(() => {
    const url = `${pathname}${searchParams ? '?' + searchParams.toString() : ''}`;
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', GA_MEASUREMENT_ID, { page_path: url });
    }
  }, [pathname, searchParams]);

  return (
    <>
      {/* Script de gtag.js */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive" // Asegura que el script se carga después de la interacción inicial
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive" // Asegura que el script se ejecuta después de que el DOM esté listo
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
