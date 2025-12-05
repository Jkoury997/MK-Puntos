import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const URL_API_AUTH = process.env.NEXT_PUBLIC_URL_API_AUTH;


export async function POST(req) {
    try {
        const body = await req.json();
        const cookieStore = cookies();
        
        // Supongamos que el cuerpo de la solicitud incluye el email y password
        const { email, password } = body;
        // Enviar la solicitud de inicio de sesión al backend
        const response = await fetch(`${URL_API_AUTH}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password})
        });

        const responseData = await response.json();

        if (response.ok) {
            // Guardar tokens en cookies
            cookieStore.set('accessToken', responseData.accessToken, { path: '/' });
            cookieStore.set('refreshToken', responseData.refreshToken, { path: '/' });
            cookieStore.set('userId', responseData.user._id, { path: '/' });
            

            return NextResponse.json(responseData);
        } else {
            return NextResponse.json({ error: responseData.message }, { status: response.status });
        }
    } catch (error) {

        return NextResponse.json({ error: error.message || 'Error during login' }, { status: 500 });
    }
}
