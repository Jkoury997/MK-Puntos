import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Cache en memoria
let storesCache = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hora en millisegundos

function loadStoresFromFile() {
  const filePath = path.join(process.cwd(), 'public', 'places-details.json');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

function transformStores(data) {
  return Object.keys(data)
    .map((key) => {
      const store = data[key];
      if (
        typeof store.location?.latitude === 'number' &&
        typeof store.location?.longitude === 'number'
      ) {
        return {
          id: key,
          name: store.displayName?.text || 'Sin nombre',
          lat: store.location.latitude,
          lng: store.location.longitude,
          address: store.formattedAddress || 'Sin dirección',
          addressShort: store.addressComponents || [],
          phone: store.nationalPhoneNumber || null,
          rating: store.rating || null,
          placeUri: store.googleMapsLinks?.placeUri || store.googleMapsUri,
          writeReviewUri: store.googleMapsLinks?.writeAReviewUri || null,
          websiteUri: store.websiteUri || null,
          openingHours: store.regularOpeningHours || null,
        };
      }
      return null;
    })
    .filter(Boolean);
}

export async function GET(request) {
  try {
    const now = Date.now();

    // Verificar si el caché es válido
    if (storesCache && (now - cacheTimestamp) < CACHE_DURATION) {
      return NextResponse.json(storesCache, {
        headers: {
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
          'X-Cache': 'HIT',
        },
      });
    }

    // Cargar y transformar datos
    const rawData = loadStoresFromFile();
    storesCache = transformStores(rawData);
    cacheTimestamp = now;

    return NextResponse.json(storesCache, {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        'X-Cache': 'MISS',
      },
    });
  } catch (error) {
    console.error('Error loading stores:', error);
    return NextResponse.json(
      { error: 'Error al cargar las tiendas' },
      { status: 500 }
    );
  }
}
