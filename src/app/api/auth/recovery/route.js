import { NextResponse } from 'next/server';
import { validators } from '@/lib/validations';
import { otpRateLimit } from '@/lib/rate-limit';

const URL_API_AUTH = process.env.NEXT_PUBLIC_URL_API_AUTH;

export async function POST(request) {
  try {
    // Rate limiting para OTP
    const rateLimitResult = await otpRateLimit(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: rateLimitResult.message },
        { status: 429, headers: { 'Retry-After': String(rateLimitResult.resetInSeconds) } }
      );
    }

    const body = await request.json();

    // Validar email
    const emailVal = validators.email(body.email);
    if (!emailVal.valid) {
      return NextResponse.json({ error: emailVal.error }, { status: 400 });
    }

    const email = emailVal.value;

    const response = await fetch(`${URL_API_AUTH}/api/recovery/generate-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email})
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.message || 'Error al enviar el correo de recuperación' }, { status: response.status });
    }

    return NextResponse.json({ message: 'Correo de recuperación enviado' }, { status: 200 });
  } catch (error) {
    console.error('Error al enviar el correo de recuperación:', error);
    return NextResponse.json({ error: 'Error al enviar el correo de recuperación' }, { status: 500 });
  }
}
