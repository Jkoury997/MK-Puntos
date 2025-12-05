export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

// Página vista
export const pageview = (url) => {
  if (typeof window !== "undefined" && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    })
  }
}

// Evento personalizado
export const event = ({ action, category, label, value }) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Eventos específicos para el localizador de tiendas
export const trackStoreSearch = (address) => {
  event({
    action: "store_search",
    category: "engagement",
    label: address,
  })
}

export const trackStoreClick = (storeName) => {
  event({
    action: "store_click",
    category: "engagement",
    label: storeName,
  })
}

export const trackWhatsAppClick = (storeName) => {
  event({
    action: "whatsapp_click",
    category: "conversion",
    label: storeName,
  })
}

export const trackWebsiteClick = (storeName) => {
  event({
    action: "website_click",
    category: "conversion",
    label: storeName,
  })
}

export const trackLocationRequest = (granted) => {
  event({
    action: "location_request",
    category: "permission",
    label: granted ? "granted" : "denied",
    value: granted ? 1 : 0,
  })
}

export const trackFilterApplied = (filterType, filterValue) => {
  event({
    action: "filter_applied",
    category: "engagement",
    label: `${filterType}:${filterValue}`,
  })
}
