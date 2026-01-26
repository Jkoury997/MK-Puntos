import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const URL_API_AUTH = process.env.NEXT_PUBLIC_URL_API_AUTH;

export async function POST(req) {
    try {
        const body = await req.json();
        const cookieStore = cookies();
        
        // Obtener userId desde las cookies
        const userIdCookie = cookieStore.get("userId");
        const userId = userIdCookie ? userIdCookie.value : null;

        if (!userId) {
            return NextResponse.json({ error: 'User ID is missing in cookies' }, { status: 400 });
        }

        // Obtener el fingerprint desde el cuerpo de la solicitud
        const { fingerprint } = body;

        // Enviar la solicitud de registro del dispositivo de confianza al backend
        const response = await fetch(`${URL_API_AUTH}/api/trust-device/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, fingerprint })
        });

        const responseData = await response.json();

        if (response.ok) {
            // Crear una nueva respuesta y agregar la cookie del fingerprint
            cookieStore.set('fingerprint', responseData.trustedDevice.fingerprint, {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
            });
            const res = NextResponse.json(responseData);
            return res;
        } else {
            return NextResponse.json({ error: responseData.message }, { status: response.status });
        }
    } catch (error) {
        return NextResponse.json({ error: error.message || 'Error during register' }, { status: 500 });
    }
}
