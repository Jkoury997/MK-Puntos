import React, { useState, useEffect } from "react";


const withAdminAuth = (WrappedComponent) => {
  return (props) => {
    const [isAdmin, setIsAdmin] = useState(null); // null indica estado de carga

    useEffect(() => {
      const checkRole = async () => {
        try {

          // Opción 2: Realizar una llamada a la API para validar el token/rol
           const res = await fetch("/api/auth/user/token");
           const data = await res.json();

           const role = data.role;
           console.log(role)

          if (role === "admin") {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          setIsAdmin(false);
        }
      };

      checkRole();
    }, []);

    if (isAdmin === null) {
      // Mientras se verifica el rol, se puede mostrar un indicador de carga
      return <div>Cargando...</div>;
    }

    if (!isAdmin) {
      // No se renderiza nada o se puede redirigir a otra página
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAdminAuth;
