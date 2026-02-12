// hooks/useGeolocation.js
import { useState, useEffect } from 'react';

export default function useGeolocation() {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("La geolocalización no está soportada en este navegador.");
            return;
        }

        // Intentar obtener la ubicación del usuario, pero no bloquear si falla
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                console.log(latitude,longitude)
                setLocation({ latitude, longitude });
            },
            (error) => {
                console.warn("No se obtuvo la ubicación, continuando sin ella.");
                setError("No se pudo obtener la ubicación. Asegúrate de tener los permisos activados.");
            }
        );
    }, []);

    return { location, errorLocation: error, error };
}
