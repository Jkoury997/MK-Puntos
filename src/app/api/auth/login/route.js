import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { validators } from '@/lib/validations';
import { authRateLimit } from '@/lib/rate-limit';

const URL_API_AUTH = process.env.NEXT_PUBLIC_URL_API_AUTH;


export async function POST(req) {
    try {
        // Rate limiting
        const rateLimitResult = await authRateLimit(req);
        if (!rateLimitResult.success) {
            return NextResponse.json(
                { error: rateLimitResult.message },
                { status: 429, headers: { 'Retry-After': String(rateLimitResult.resetInSeconds) } }
            );
        }

        const body = await req.json();
        const cookieStore = cookies();

        // Validar email
        const emailValidation = validators.email(body.email);
        if (!emailValidation.valid) {
            return NextResponse.json({ error: emailValidation.error }, { status: 400 });
        }

        // Solo verificar que password no esté vacío
        if (!body.password) {
            return NextResponse.json({ error: 'Contraseña es requerida' }, { status: 400 });
        }

        const email = emailValidation.value;
        const password = body.password;

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
            // Guardar tokens en cookies con seguridad
            const cookieOptions = {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
            };
            cookieStore.set('accessToken', responseData.accessToken, cookieOptions);
            cookieStore.set('refreshToken', responseData.refreshToken, cookieOptions);
            cookieStore.set('userId', responseData.user._id, cookieOptions);
            

            return NextResponse.json(responseData);
        } else {
            return NextResponse.json({ error: responseData.message }, { status: response.status });
        }
    } catch (error) {

        return NextResponse.json({ error: error.message || 'Error during login' }, { status: 500 });
    }
}
