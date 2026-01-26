// pages/api/register.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const URL_API_NASUS = process.env.NEXT_PUBLIC_URL_API_NASUS;

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Función para normalizar el DNI quitando puntos
function normalizeDni(dni) {
    return dni.replace(/\./g, ''); // Remueve todos los puntos
}

// Función para formatear la fecha de nacimiento
function formatBirthDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses en JavaScript comienzan desde 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

export async function POST(req) {
    try {
        const body = await req.json();
        let { firstName, lastName, dni, email, birthDate,mobile} = body;
        const cookieStore = cookies();
        const Token = cookieStore.get("Token");

        if (!Token?.value) {
            return NextResponse.json({ error: 'Token no encontrado. Por favor inicie sesión.' }, { status: 401 });
        }

        // Transformar a primera letra en mayúscula
        firstName = capitalizeFirstLetter(firstName);
        lastName = capitalizeFirstLetter(lastName);

        // Normalizar el DNI
        dni = normalizeDni(dni);

        // Enviar la solicitud de registro al backend
        const response = await fetch(`${URL_API_NASUS}/api/Tiendas/AltaCliente`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Token': Token.value
            },
            body: JSON.stringify({
                Nombre:firstName,
                Apellido:lastName,
                Id: String(dni),
                email,
                Telefono: String(mobile),
                FechaNacimiento:formatBirthDate(birthDate),
            }),
        });

        const responseData = await response.json();

        if (response.ok && responseData.Estado) {
            return NextResponse.json(responseData, { status: 201 });
        } else {
            return NextResponse.json({ error: responseData.Mensaje || responseData.message || 'Error al registrar cliente' }, { status: response.status || 400 });
        }
    } catch (error) {
        console.error('Error during registration:', error);
        return NextResponse.json(
            { error: error.message || 'Error during registration' },
            { status: 500 }
        );
    }
}
