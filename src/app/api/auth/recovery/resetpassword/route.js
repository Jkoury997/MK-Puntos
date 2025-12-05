import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const URL_API_AUTH = process.env.NEXT_PUBLIC_URL_API_AUTH;

export async function POST(request) {
  const cookieStore = cookies();
  const token = cookieStore.get('accessToken'); // Assume the token is stored in a cookie named 'accessToken'

  try {
    const { email,otp,password } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Correo electrónico es requerido' }, { status: 400 });
    }

    const response = await fetch(`${URL_API_AUTH}/api/recovery/password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token?.value}` // Access the value of the token
      },
      body: JSON.stringify({email,otpCode:otp,newPassword:password})
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      return NextResponse.json({ error: errorDetails.message || 'Error al enviar el correo de recuperación' }, { status: response.status });
    }

    const data =  await response.json();

    return NextResponse.json({data}, { status: 200 });
  } catch (error) {
    console.error('Error al enviar el correo de recuperación:', error);
    return NextResponse.json({ error: 'Error al enviar el correo de recuperación' }, { status: 500 });
  }
}
