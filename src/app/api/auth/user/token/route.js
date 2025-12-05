import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  try {
    const cookieStore = cookies();
    const accessTokenCookie = cookieStore.get("accessToken");

    if (!accessTokenCookie) {
      // Si no hay token, redirige al dashboard
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    const accessToken = accessTokenCookie.value;

    try {
      // Verificar el accessToken
      const { payload } = await jwtVerify(
        accessToken,
        new TextEncoder().encode(JWT_SECRET)
      );

      if (payload.role !== 'admin') {
        // Si el usuario no es admin, redirige al dashboard
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }

      // Permitir el acceso y devolver el payload
      return NextResponse.json(payload);
    } catch (error) {
      // Si falla la verificación del token, redirige al dashboard
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  } catch (error) {
    // En cualquier otro error, redirige al dashboard
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
}
