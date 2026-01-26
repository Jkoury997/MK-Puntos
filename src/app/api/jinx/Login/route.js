import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Server-side only - no exponer al cliente
const URL_API_JINX = process.env.URL_API_JINX || process.env.NEXT_PUBLIC_URL_API_JINX;
const EMAIL_NASUS = process.env.EMAIL_NASUS;
const PASSWORD_NASUS = process.env.PASSWORD_NASUS;

export async function GET(req) {
    try {
        const cookieStore = cookies();
        const accessKeyCookie = cookieStore.get('AccessKey');

        // Verificar si la cookie existe y no está vencida
        if (accessKeyCookie) {
            return NextResponse.json({ message: 'AccessKey is still valid' });
        }

        // Enviar la solicitud de inicio de sesión al backend
        const response = await fetch(`${URL_API_JINX}/api/Login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Usuario: EMAIL_NASUS, Password: PASSWORD_NASUS }),
        });

        const responseData = await response.json();

        if (responseData.Estado) {
            // Guardar tokens en cookies solo si Estado es true
            cookieStore.set('AccessKey', responseData.AccessKey, {
                path: '/',
                maxAge: 21600, // 6 horas en segundos
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
            });
            return NextResponse.json(responseData);
        } else {
            // Manejo de errores específicos de la API
            return NextResponse.json({ error: responseData.Mensaje }, { status: 401 });
        }
    } catch (error) {
        // Manejo de errores generales
        return NextResponse.json({ error: error.message || 'Error during login' }, { status: 500 });
    }
}