"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Eye, EyeOff } from "lucide-react";

import FingerprintJS from "@fingerprintjs/fingerprintjs";

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fingerprint, setFingerprint] = useState(null);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dni: "",
    email: "",
    birthDate: "",
    password: "",
    confirmPassword: "",
    sex: "",
    mobile:""
  });

  const router = useRouter();

  // Generar fingerprint consistente
  const generateAverageFingerprint = async () => {
    const fingerprints = [];
    const fp = await FingerprintJS.load();
    
    for (let i = 0; i < 10; i++) {
      const result = await fp.get();
      fingerprints.push(result.visitorId);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    
    const commonFingerprint = fingerprints.reduce((acc, f) => {
      acc[f] = (acc[f] || 0) + 1;
      return acc;
    }, {});
    
    const consistentFingerprint = Object.keys(commonFingerprint).reduce((a, b) =>
      commonFingerprint[a] > commonFingerprint[b] ? a : b
    );
    
    setFingerprint(consistentFingerprint);
  };

  useEffect(() => {
    generateAverageFingerprint();
    fetchLoginExternal()
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSexChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      sex: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setShowError(false);
    setErrorMessage("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden");
      setShowError(true);
      setIsLoading(false);
      return;
    }

    if (!acceptTerms) {
      setErrorMessage("Debes aceptar los términos y condiciones");
      setShowError(true);
      setIsLoading(false);
      return;
    }

    try {

      await handleAlta()

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      

      console.log("Registration successful:", data);

      // Enviar el fingerprint a la API
      await fetch('/api/auth/trustdevice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fingerprint })
      });

      
      await handleSignIn(formData.email,formData.password)
      
      router.push("/auth/login");
    } catch (error) {
      console.error("Error durante el registro:", error);
      setErrorMessage(error.message || "Error en el registro");
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };




  const handleAlta = async () => {
    setIsLoading(true);
    setShowError(false);
    setErrorMessage("");

    try {

      const response = await fetch('/api/nasus/cliente/alta', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      

      console.log("Registration successful:", data);

    } catch (error) {
      console.error("Error durante el registro:", error);
      setErrorMessage(error.message || "Error en el registro");
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLoginExternal = async () => {
    setIsLoading(true);
    try {
      // Primera solicitud al endpoint `Login`
      const responseLogin = await fetch(`/api/jinx/Login`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!responseLogin.ok) {
        throw new Error(`Error en la solicitud Login: ${responseLogin.status} ${responseLogin.statusText}`);
      }

      // Segunda solicitud al endpoint `UserAccess`
      const responseUserAccess = await fetch(`/api/jinx/UserAccess`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!responseUserAccess.ok) {
        throw new Error(`Error en la solicitud UserAccess: ${responseUserAccess.status} ${responseUserAccess.statusText}`);
      }

      // Simular retraso (opcional, solo para pruebas visuales)
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Error al obtener datos:", error);
    } finally {
      setIsLoading(false); // Finaliza el estado de carga
    }
  };


  const handleSignIn = async (email,password) => {
    
    setIsLoading(true);
    setErrorMessage("")
    setShowError(false)

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
        setErrorMessage(error.message || "Error al iniciar sesión");
        setShowError(true);
    } finally {
      setIsLoading(false);
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
          <CardTitle className="text-2xl font-bold text-center">Crear Cuenta</CardTitle>
          <CardDescription className="text-center">
            Ingresa tus datos para crear una nueva cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister}>
            <div className="space-y-4">

              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre</Label>
                <Input
                  id="firstName"
                  placeholder="Juan"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido</Label>
                <Input
                  id="lastName"
                  placeholder="Pérez"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@ejemplo.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate">Fecha de nacimiento</Label>
                <Input
                  id="birthDate"
                  type="date"
                  required
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dni">Documento de identidad</Label>
                <Input
                  id="dni"
                  type="number"
                  inputMode="numeric"
                  placeholder="Número de documento"
                  required
                  value={formData.dni}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sex">Sexo</Label>
                <Select value={formData.sex} onValueChange={handleSexChange}>
                  <SelectTrigger id="sex">
                    <SelectValue placeholder="Selecciona tu sexo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Masculino</SelectItem>
                    <SelectItem value="Female">Femenino</SelectItem>
                    <SelectItem value="Other">No Binario</SelectItem>

                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile">Telefono</Label>
                <Input
                  id="mobile"
                  type="number"
                  inputMode="numeric"
                  placeholder="Número de telefono"
                  required
                  value={formData.mobile}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
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
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(!!checked)}
                />
                <Label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Acepto los términos y condiciones
                </Label>
              </div>
              {showError && errorMessage && (
                <p className="text-sm text-red-500 mt-2">{errorMessage}</p>
              )}
              <Button className="w-full bg-brand hover:bg-black" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando cuenta...
                  </>
                ) : (
                  "Crear cuenta"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600 text-center">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/auth/login">
              <Button variant="link" className="text-brand hover:text-pink-700 p-0">
                Inicia sesión
              </Button>
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
