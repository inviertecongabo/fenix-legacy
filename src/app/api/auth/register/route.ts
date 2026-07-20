import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { Resend } from "resend"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  // Initialize inside handler so it only runs at request time, not build time
  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nombre, email y contraseña son requeridos" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "El email ya está registrado" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user (emailVerified is null by default)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    // Generate Verification Token
    const token = crypto.randomUUID()
    const expires = new Date(new Date().getTime() + 1000 * 60 * 60 * 24) // 24 hours

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    })

    // Send Verification Email
    const verificationUrl = `${request.nextUrl.origin}/verify-email?token=${token}`

    try {
      await resend.emails.send({
        from: "Fénix Legacy <onboarding@resend.dev>", // Change to your verified domain later
        to: email,
        subject: "Confirma tu correo electrónico - Fénix Legacy",
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>¡Hola ${name}!</h2>
            <p>Gracias por registrarte en Fénix Legacy.</p>
            <p>Por favor, confirma tu correo electrónico haciendo clic en el siguiente enlace:</p>
            <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 10px;">Confirmar Correo</a>
            <p style="margin-top: 20px; font-size: 12px; color: #666;">Si no creaste esta cuenta, puedes ignorar este correo.</p>
          </div>
        `,
      })
    } catch (emailError) {
      console.error("Error sending verification email:", emailError)
      // We don't fail the registration if email fails, but we should log it
    }

    return NextResponse.json(
      {
        message: "Usuario registrado. Por favor, revisa tu correo para confirmar tu cuenta.",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error registering user:", error)
    return NextResponse.json(
      { error: "Error al registrar usuario" },
      { status: 500 }
    )
  }
}
