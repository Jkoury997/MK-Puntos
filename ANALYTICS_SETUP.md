# Configuración de Google Analytics 4 con Datos Reales

## Variables de Entorno Necesarias

Para conectar datos reales de Google Analytics, necesitas configurar:

### 1. NEXT_PUBLIC_GA_MEASUREMENT_ID (Ya configurado)
- Formato: `G-XXXXXXXXXX`
- Se usa para enviar eventos desde el navegador
- Ya está implementado en la aplicación

### 2. GA_PROPERTY_ID (Nuevo - para leer datos)
- Formato: `properties/123456789`
- Se usa para leer datos del dashboard
- **Cómo obtenerlo:**
  1. Ve a [Google Analytics](https://analytics.google.com)
  2. Selecciona tu propiedad
  3. Ve a Admin → Property Settings
  4. Copia el Property ID (solo los números)
  5. Agrégalo como: `properties/TU_NUMERO`

### 3. GOOGLE_APPLICATION_CREDENTIALS (Opcional - para producción)
Para datos reales en producción necesitas autenticación con Service Account:

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un Service Account
3. Descarga el archivo JSON de credenciales
4. Dale permisos de "Viewer" en Google Analytics
5. Agrega las credenciales como variable de entorno

## Instalación de Dependencias para Datos Reales

Si quieres usar datos 100% reales, instala:

\`\`\`bash
npm install @google-analytics/data
\`\`\`

## Implementación Actual

**Estado actual:** La aplicación usa datos simulados que se actualizan dinámicamente para demostrar la funcionalidad del dashboard.

**Para datos reales:** Necesitas agregar `GA_PROPERTY_ID` y configurar autenticación con Service Account.

## Eventos que se Están Rastreando

La app ya está enviando estos eventos a Google Analytics:
- ✅ Vistas de página
- ✅ Búsquedas de tiendas
- ✅ Clicks en tiendas
- ✅ Clicks en WhatsApp
- ✅ Clicks en sitios web
- ✅ Solicitudes de ubicación
- ✅ Aplicación de filtros

Estos eventos se pueden ver en:
**Google Analytics → Reports → Engagement → Events**
