
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Loader2 } from 'lucide-react'



export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchRefreshToken = async () => {
      try {
        const response = await fetch("/api/auth/refreshtoken");
        if (!response.ok) {
          throw new Error('Error al obtener el refresh token');
        }
        const data = await response.json();
        console.log('Refresh token fetched:', data);
        router.push("/dashboard")
      } catch (error) {
        console.error('Error fetching refresh token:', error);
      }
    };

    fetchRefreshToken(); // Ejecutar la función dentro del useEffect
  }, []); 

  // Limpiar el estado del error y error de dispositivo al intentar de nuevo
  const resetError = () => {
    setShowError(false);
    setError("");
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    resetError(); // Limpiar cualquier error previo

    try {
        // Paso 1: Autenticación del usuario
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });

        // Verifica si la respuesta es correcta, de lo contrario arroja un error
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error en el login");
        }

        // Paso 2: Obtener los datos de la respuesta (ej. tokens)
        const data = await response.json();

        // Paso 3: Verificación y redirección
        if (data.accessToken) {
            router.push("/dashboard"); // Redirigir al dashboard si la autenticación es exitosa
        } else {
            throw new Error("Token de acceso no disponible.");
        }
    } catch (error) {
        console.error("Error en el login:", error);
        setError(error.message || "Error al iniciar sesión");
        setShowError(true);
    } finally {
        setLoading(false);
    }
};



return (
  <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4">
          <div className=" rounded-full overflow-hidden bg-white shadow-md flex items-center justify-center">
            <img
              src="https://http2.mlstatic.com/D_NQ_NP_631094-MLA79804429381_102024-O.webp"
              alt="Logo de la marca"
              className="w-20 h-20 object-cover"
            />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center">Iniciar Sesión</CardTitle>
        <CardDescription className="text-center">
          Ingresa tu credenciales para acceder a tu cuenta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignIn}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="Introduzca su email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                inputMode="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  placeholder="Introduzca su contraseña"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  autoCapitalize="none"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>
            {error && (
              <p className="text-sm text-red-500 mt-2">{error}</p>
            )}
            <Button className="w-full bg-brand hover:bg-black" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ingresando a la cuenta...
                </>
              ) : (
                "Ingresar"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
      <Link href="/auth/recovery">
        <Button variant="link" className="text-sm text-brand hover:text-pink-700">
          ¿Olvidaste tu contraseña?
        </Button>
        </Link>
        <p className="text-sm text-gray-600 text-center">
          ¿No tienes una cuenta?{" "}
          <Link href="/auth/register">
          <Button variant="link" className="text-brand hover:text-pink-700 p-0">
            Regístrate
          </Button>
          </Link>
        </p>
      </CardFooter>
    </Card>
  </div>
)
}

