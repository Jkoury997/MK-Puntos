import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Server-side only - no exponer al cliente
const URL_API_JINX = process.env.URL_API_JINX || process.env.NEXT_PUBLIC_URL_API_JINX;
const Empresa = process.env.EMPRESA || process.env.NEXT_PUBLIC_EMPRESA;

export async function GET(req) {
    
    try {
        const cookieStore = cookies();
        const AccessKey = cookieStore.get("AccessKey");
        const TokenCookie = cookieStore.get("Token");
        

        // Verificar si la cookie existe y no está vencida
        if (TokenCookie) {
            return NextResponse.json({ message: 'Token is still valid' });
        }


        // Verificar que AccessKey existe antes de usar
        if (!AccessKey?.value) {
            return NextResponse.json({ error: 'AccessKey no encontrado' }, { status: 401 });
        }

        // Enviar la solicitud de acceso al backend
        const response = await fetch(`${URL_API_JINX}/api/UserAccess`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Empresa: Empresa, AccessKey: AccessKey.value })
        });

        const responseData = await response.json();

        if (responseData.Estado) {
            // Guardar tokens en cookies solo si Estado es true
            cookieStore.set('Token', responseData.Token, {
                path: '/',
                maxAge: 21600,
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
        return NextResponse.json({ error: error.message || 'Error during access validation' }, { status: 500 });
    }
}
