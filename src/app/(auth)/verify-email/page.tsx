"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("Verificando tu correo electrónico...")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("Token de verificación no encontrado en el enlace.")
      return
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        })

        const data = await res.json()

        if (res.ok) {
          setStatus("success")
          setMessage("¡Tu correo ha sido verificado con éxito! Ya puedes iniciar sesión.")
        } else {
          setStatus("error")
          setMessage(data.error || "Hubo un error al verificar tu correo.")
        }
      } catch (error) {
        setStatus("error")
        setMessage("Error de conexión al verificar el correo.")
      }
    }

    verifyEmail()
  }, [token])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-xl border bg-card p-8 text-center shadow-lg">
        <div className="mb-6 flex justify-center">
          {status === "loading" && <Loader2 className="h-16 w-16 animate-spin text-primary" />}
          {status === "success" && <CheckCircle2 className="h-16 w-16 text-green-500" />}
          {status === "error" && <XCircle className="h-16 w-16 text-destructive" />}
        </div>
        
        <h1 className="mb-4 text-2xl font-bold tracking-tight">
          {status === "loading" && "Verificando..."}
          {status === "success" && "¡Correo Verificado!"}
          {status === "error" && "Error de Verificación"}
        </h1>
        
        <p className="mb-8 text-muted-foreground">{message}</p>
        
        {status === "success" && (
          <Button asChild className="w-full">
            <Link href="/login">Ir a Iniciar Sesión</Link>
          </Button>
        )}
        
        {status === "error" && (
          <Button asChild variant="outline" className="w-full">
            <Link href="/register">Volver a Registrarse</Link>
          </Button>
        )}
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}
