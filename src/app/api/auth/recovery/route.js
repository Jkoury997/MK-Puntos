import { NextResponse } from 'next/server';

const URL_API_AUTH = process.env.NEXT_PUBLIC_URL_API_AUTH;

function toLowerCaseString(str) {
  return str ? str.toLowerCase() : '';
}

export async function POST(request) {

  try {
    let { email } = await request.json();


    if (!email) {
      return NextResponse.json({ error: 'Correo electrónico es requerido' }, { status: 400 });
    }

    // Convertir email a minúsculas
    email = toLowerCaseString(email);

    const response = await fetch(`${URL_API_AUTH}/api/recovery/generate-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email})
    });

    const data = await response.json()
    console.log(data)

    if (!response.ok) {
      const errorDetails = await response.json();
      return NextResponse.json({ error: errorDetails.message || 'Error al enviar el correo de recuperación' }, { status: response.status });
    }


    return NextResponse.json({ message: 'Correo de recuperación enviado' }, { status: 200 });
  } catch (error) {
    console.error('Error al enviar el correo de recuperación:', error);
    return NextResponse.json({ error: 'Error al enviar el correo de recuperación' }, { status: 500 });
  }
}
