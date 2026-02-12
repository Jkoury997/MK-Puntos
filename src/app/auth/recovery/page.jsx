"use client";
import { useState,useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Loader2,ArrowLeft,Eye,EyeOff } from 'lucide-react'
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert,AlertTitle,AlertDescription } from "@/components/ui/alert";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import Link from "next/link";


export default function Page( { searchParams }) {

  const router = useRouter();
  const emailParam = searchParams?.email || "";
  const otpParam = searchParams?.otp || "";

  const [email, setEmail] = useState(emailParam || "");
  const [otp, setOtp] = useState(otpParam || "");
  const [step, setStep] = useState(1)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);



  useEffect(() => {
    if (emailParam) {
      setStep(otpParam ? 3 : 2); // Si hay OTP, pasa directamente al paso 3
    }
    if(otpParam) {
      handleVerifyOtp()
    }
  }, [emailParam, otpParam]);


  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setSuccess(false)

    if (!email) {
      setError("Por favor, ingresa tu correo electrónico")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/recovery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setStep(2)
      } else {
        const data = await response.json();
        setError(data.error || "Error al enviar el código de restablecimiento.");
      }
    } catch (error) {
      setError("Error al enviar el código de restablecimiento.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setLoading(true);
    setSuccess(false)

    if (!otp) {
      setError("Por favor, ingresa tu otp")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/recovery/verifyotp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email,otp })
      });

      if (response.ok) {
        setStep(3)
      } else {
        const data = await response.json();
        setError(data.message || "El codigo no es correcto o ya se uso.");
      }
    } catch (error) {
      setError("El codigo no es correcto o ya se uso.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/recovery/resetpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          otp: otp,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al restablecer la contraseña.");
      }
    setSuccess(true)
    // Manejar respuesta exitosa
      router.push("/auth/login");
    
    } catch (err) {
      setError("Ocurrió un error al restablecer la contraseña")
    } finally {
      setLoading(false)
    }
  }

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
        <CardTitle className="text-2xl font-bold text-center">Restablecer Contraseña</CardTitle>
        <CardDescription className="text-center">
          {step === 1 && "Ingresa tu correo electrónico para recibir el código OTP"}
          {step === 2 && "Ingresa el código OTP que recibiste por correo electrónico"}
          {step === 3 && "Ingresa tu nueva contraseña"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <Alert className="bg-green-100 border-green-500 text-green-700">
            <AlertTitle>Contraseña restablecida</AlertTitle>
            <AlertDescription>
              Tu contraseña ha sido restablecida exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {step === 1 && (
              <form onSubmit={handleSendCode}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@ejemplo.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                  <Button className="w-full bg-brand hover:bg-black" type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      "Enviar código OTP"
                    )}
                  </Button>
                </div>
              </form>
            )}
            {step === 2 && (
              <form onSubmit={handleVerifyOtp}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    

<div className="flex justify-center items-center">
<InputOTP maxLength={6} value={otp}
                      onChange={setOtp} autoComplete="one-time-code">
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
  </InputOTPGroup>
  <InputOTPSeparator />
  <InputOTPGroup>
    <InputOTPSlot index={3} />
    <InputOTPSlot index={4} />
    <InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>
</div>
                  </div>
                  {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                  <Button className="w-full bg-brand hover:bg-black" type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verificando...
                      </>
                    ) : (
                      "Verificar código OTP"
                    )}
                  </Button>
                </div>
              </form>
            )}
            {step === 3 && (
              <form onSubmit={handleResetPassword}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Nueva contraseña</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Introduzca su contraseña"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoCapitalize="none"
                        autoComplete="current-password"
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
                    <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirme su contraseña"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoCapitalize="none"
                        autoComplete="current-password"
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
                  {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                  <Button className="w-full bg-brand hover:bg-black" type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Restableciendo...
                      </>
                    ) : (
                      "Restablecer contraseña"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link href={`/auth/login`}>
        
        <Button variant="link" className="text-brand hover:text-pink-700 p-0" onClick={() => setStep(1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al inicio
        </Button>
        </Link>
      </CardFooter>
    </Card>
  </div>

)
}
