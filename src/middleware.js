import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const URL_API_AUTH = process.env.NEXT_PUBLIC_URL_API_AUTH;
const JWT_SECRET = process.env.JWT_SECRET;

export async function middleware(request) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  const { pathname } = request.nextUrl;

  // Si no hay refreshToken, redirigir al login
  if (!refreshToken) {
    return redirectToLogin(request);
  }

  // Si no hay accessToken, intentar renovarlo
  if (!accessToken) {
    return await refreshAccessToken(refreshToken, request);
  }

  try {
    // Verificar el accessToken
    const { payload } = await jwtVerify(
      accessToken,
      new TextEncoder().encode(JWT_SECRET)
    );

    // Verificar roles según la ruta
    if (pathname.startsWith('/admin')) {
      // Rutas de administrador: solo "admin"
      if (payload.role !== 'admin') {
        return redirectToUnauthorized(request);
      }
    } else if (pathname.startsWith('/comercio')) {
      // Rutas de comercio: permitir "comercio" y "admin"
      if (!['comercio', 'admin'].includes(payload.role)) {
        return redirectToUnauthorized(request);
      }
    } else if (pathname.startsWith('/dashboard')) {
      // Rutas de dashboard: permitir "usuario", "comercio" y "admin"
      if (!['usuario', 'comercio', 'admin'].includes(payload.role)) {
        return redirectToUnauthorized(request);
      }
    }

    // Permitir el acceso
    return NextResponse.next();
  } catch (error) {
    // Si el token es inválido, intentar renovarlo
    return await refreshAccessToken(refreshToken, request);
  }
}

async function refreshAccessToken(refreshToken, request) {
  try {
    const response = await fetch(`${URL_API_AUTH}/api/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      return redirectToLogin(request);
    }

    const { accessToken } = await response.json();

    // Establecer el nuevo accessToken en las cookies con seguridad
    const newResponse = NextResponse.next();
    newResponse.cookies.set("accessToken", accessToken, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    return newResponse;
  } catch (error) {
    console.error('Error al refrescar el accessToken:', error);
    return redirectToLogin(request);
  }
}

function redirectToLogin(request) {
  const newResponse = NextResponse.redirect(new URL('/auth/login', request.url));
  newResponse.cookies.delete("accessToken");
  newResponse.cookies.delete("refreshToken");
  return newResponse;
}

function redirectToUnauthorized(request) {
  return NextResponse.redirect(new URL('/dashboard/unauthorized', request.url));
}

export const config = {
  matcher: [
    '/admin/:path*',     // Rutas de administración
    '/dashboard/:path*', // Rutas de dashboard
    '/comercio/:path*',   // Rutas de comercio
  ],
};
