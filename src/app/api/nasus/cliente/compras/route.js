import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const URL_API_NASUS = process.env.NEXT_PUBLIC_URL_API_NASUS;

export async function GET(req) {
    try {
        // Extraer los parámetros de la URL
        const { searchParams } = new URL(req.url);
        const dni = searchParams.get('dni');
        
        const cookieStore = cookies();
        const Token = cookieStore.get("Token");
       

        if (!dni || dni.trim() === '') {
            return NextResponse.json({ error: 'DNI es requerido' }, { status: 400 });
        }

        // Enviar la solicitud de consulta al backend
        const response = await fetch(`${URL_API_NASUS}/api/Tiendas/ConsultarCompras/${dni}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Token': Token.value
            },
        });

        // Manejo de respuesta del backend
        if (!response.ok) {
            const errorMessage = await response.text(); // Manejar texto si no es JSON
            return NextResponse.json({ error: errorMessage || 'Error en el backend' }, { status: response.status });
        }

        const responseData = await response.json();
        
        return NextResponse.json(responseData);
    } catch (error) {
        // Manejo de errores generales
        return NextResponse.json({ error: error.message || 'Error durante la consulta' }, { status: 500 });
    }
}
