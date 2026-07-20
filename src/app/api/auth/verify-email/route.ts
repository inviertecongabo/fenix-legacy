import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Token no proporcionado" }, { status: 400 })
    }

    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    })

    if (!verificationToken) {
      return NextResponse.json({ error: "Token inválido o expirado" }, { status: 400 })
    }

    if (new Date() > verificationToken.expires) {
      // Borrar el token expirado
      await prisma.verificationToken.delete({
        where: { token },
      })
      return NextResponse.json({ error: "El token ha expirado. Por favor, regístrate nuevamente." }, { status: 400 })
    }

    // Actualizar el usuario
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
    })

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    await prisma.user.update({
      where: { email: user.email },
      data: {
        emailVerified: new Date(),
      },
    })

    // Borrar el token ya usado
    await prisma.verificationToken.delete({
      where: { token },
    })

    return NextResponse.json({ success: true, message: "Correo verificado exitosamente" })
  } catch (error) {
    console.error("Error al verificar correo:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
