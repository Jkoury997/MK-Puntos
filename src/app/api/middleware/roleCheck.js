// /app/api/middleware/roleCheck.js

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function roleCheck(req, rolesAllowed) {
  const token = req.cookies.get('accessToken'); // Obtener el token de las cookies

  if (!token) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    // Decodificar el token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userRole = decoded.role;

    // Verificar si el rol del usuario está permitido para esta ruta
    if (!rolesAllowed.includes(userRole)) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    return NextResponse.next(); // Permitir acceso
  } catch (error) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }
}
