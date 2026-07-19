import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { role, status } = body

    if (!role && !status) {
      return NextResponse.json(
        { error: "Se requiere un rol o estado para actualizar." },
        { status: 400 }
      )
    }

    const dataToUpdate: any = {}
    if (role) dataToUpdate.role = role
    if (status) dataToUpdate.status = status

    const user = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      { error: "Error al actualizar el usuario" },
      { status: 500 }
    )
  }
}
