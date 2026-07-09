import { NextRequest, NextResponse } from "next/server"
import { writeFileSync, mkdirSync, existsSync } from "fs"
import { join } from "path"
import { put, del } from "@vercel/blob"
import { cloudinary } from "@/lib/cloudinary"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json(
        { error: "No se proporcionó ningún archivo" },
        { status: 400 }
      )
    }

    // Validar tipo de archivo
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de archivo no válido. Solo se permiten imágenes (JPG, PNG, WebP, GIF)" },
        { status: 400 }
      )
    }

    // Validar tamaño (máx 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "El archivo es demasiado grande. Máximo 5MB" },
        { status: 400 }
      )
    }

    // ── OPTION A: Vercel Blob Storage (Preferred on Vercel) ──
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`
      const blob = await put(filename, file, { access: "public" })
      return NextResponse.json({
        url: blob.url,
        publicId: blob.url, // Use the URL as identifier for deletion
      })
    }

    // ── OPTION B: Cloudinary (If credentials are set) ──
    const hasCloudinary =
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_KEY !== "placeholder_key"

    if (hasCloudinary) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const result = await new Promise<{ secure_url: string; public_id: string }>(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder: "basictech/products",
                resource_type: "image",
                transformation: [
                  { width: 1200, height: 1200, crop: "limit" },
                  { quality: "auto" },
                  { fetch_format: "auto" },
                ],
              },
              (error, result) => {
                if (error) reject(error)
                else resolve(result as { secure_url: string; public_id: string })
              }
            )
            .end(buffer)
        }
      )

      return NextResponse.json({
        url: result.secure_url,
        publicId: result.public_id,
      })
    }

    // ── OPTION C: Local Filesystem Fallback (For local dev without Cloudinary/Vercel) ──
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadDir = join(process.cwd(), "public", "uploads")
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true })
    }

    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`
    const filePath = join(uploadDir, filename)
    writeFileSync(filePath, buffer)

    const fileUrl = `/uploads/${filename}`
    return NextResponse.json({
      url: fileUrl,
      publicId: `local:${filename}`, // prefix to identify local deletions
    })
  } catch (error) {
    console.error("Error uploading image:", error)
    return NextResponse.json(
      { error: "Error al subir la imagen" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const publicId = searchParams.get("publicId")

    if (!publicId) {
      return NextResponse.json(
        { error: "Se requiere el publicId" },
        { status: 400 }
      )
    }

    // ── Option A: Vercel Blob deletion ──
    if (publicId.startsWith("http")) {
      await del(publicId)
      return NextResponse.json({ success: true })
    }

    // ── Option C: Local deletion ──
    if (publicId.startsWith("local:")) {
      // Local deletions can be skipped or implemented if needed, but not critical for dev
      return NextResponse.json({ success: true })
    }

    // ── Option B: Cloudinary deletion ──
    await cloudinary.uploader.destroy(publicId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting image:", error)
    return NextResponse.json(
      { error: "Error al eliminar la imagen" },
      { status: 500 }
    )
  }
}
