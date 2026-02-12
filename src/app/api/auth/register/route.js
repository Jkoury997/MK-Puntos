// pages/api/register.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { validators } from '@/lib/validations';
import { authRateLimit } from '@/lib/rate-limit';

const URL_API_AUTH = process.env.NEXT_PUBLIC_URL_API_AUTH;

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

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

        // Validaciones
        const emailVal = validators.email(body.email);
        if (!emailVal.valid) return NextResponse.json({ error: emailVal.error }, { status: 400 });

        const passwordVal = validators.password(body.password, 6);
        if (!passwordVal.valid) return NextResponse.json({ error: passwordVal.error }, { status: 400 });

        const firstNameVal = validators.name(body.firstName, 'Nombre');
        if (!firstNameVal.valid) return NextResponse.json({ error: firstNameVal.error }, { status: 400 });

        const lastNameVal = validators.name(body.lastName, 'Apellido');
        if (!lastNameVal.valid) return NextResponse.json({ error: lastNameVal.error }, { status: 400 });

        const dniVal = validators.dni(body.dni);
        if (!dniVal.valid) return NextResponse.json({ error: dniVal.error }, { status: 400 });

        const phoneVal = validators.phone(body.mobile);
        if (!phoneVal.valid) return NextResponse.json({ error: phoneVal.error }, { status: 400 });

        // Transformar datos
        const firstName = capitalizeFirstLetter(firstNameVal.value);
        const lastName = capitalizeFirstLetter(lastNameVal.value);
        const dni = dniVal.value;
        const email = emailVal.value;
        const password = passwordVal.value;
        const mobile = phoneVal.value;
        const { sex, birthDate } = body;

        // Enviar la solicitud de registro al backend
        const response = await fetch(`${URL_API_AUTH}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName,
                lastName,
                dni: String(dni),
                email,
                password,
                sex,
                birthDate,
                mobile
            }),
        });

        const responseData = await response.json();

        if (response.ok) {
            cookieStore.set('userId', responseData.user._id, {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
            });
            return NextResponse.json(responseData, { status: 201 });
        } else {
            return NextResponse.json({ error: responseData.message }, { status: response.status });
        }
    } catch (error) {
        console.error('Error during registration:', error);
        return NextResponse.json(
            { error: error.message || 'Error during registration' },
            { status: 500 }
        );
    }
}
