import { NextResponse } from 'next/server';

const URL_API_AUTH = process.env.NEXT_PUBLIC_URL_API_AUTH;

function toLowerCaseString(str) {
  return str ? str.toLowerCase() : '';
}

export async function POST(request) {

  try {
    let { email,otp } = await request.json();


    if (!email) {
      return NextResponse.json({ error: 'Correo electrónico es requerido' }, { status: 400 });
    }

    // Convertir email a minúsculas
    email = toLowerCaseString(email);

    const response = await fetch(`${URL_API_AUTH}/api/recovery/verify-otp-only`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email,otpCode:otp})
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.message || 'Error al verificar el código OTP' }, { status: response.status });
    }

    return NextResponse.json({ message: 'Código OTP verificado correctamente', data }, { status: 200 });
  } catch (error) {
    console.error('Error al enviar el correo de recuperación:', error);
    return NextResponse.json({ error: 'Error al enviar el correo de recuperación' }, { status: 500 });
  }
}
