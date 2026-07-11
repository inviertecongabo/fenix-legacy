import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { name } = body

    if (!name || typeof name !== "string") {
      return new NextResponse("Invalid name", { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { name },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("[PROFILE_PATCH]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
