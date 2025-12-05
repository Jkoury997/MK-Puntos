import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const URL_API_AUTH = process.env.NEXT_PUBLIC_URL_API_AUTH;

export async function GET(req) {
    try {
        const cookieStore = cookies();
        const refreshToken = cookieStore.get('refreshToken');

        if (!refreshToken) {
            return NextResponse.json({ error: 'No refresh token found' }, { status: 401 });
        }

        // Enviar la solicitud de inicio de sesión al backend
        const response = await fetch(`${URL_API_AUTH}/api/auth/refresh-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refreshToken: refreshToken.value })
        });

        const responseData = await response.json();

        if (response.ok) {
            // Crear una nueva respuesta y agregar las cookies a la respuesta
            const newResponse = NextResponse.json(responseData);

            // Guardar el nuevo accessToken en las cookies
            newResponse.cookies.set('accessToken', responseData.accessToken, {
                path: '/',
            });

            return newResponse;
        } else {
            return NextResponse.json({ error: responseData.message }, { status: response.status });
        }
    } catch (error) {
        return NextResponse.json({ error: error.message || 'Error during token refresh' }, { status: 500 });
    }
}

