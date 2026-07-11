import { NextResponse } from "next/server"

// Cache the rate for 24 hours (86400 seconds) since BCV updates daily at 4:00 PM
export const revalidate = 86400

export async function GET() {
  try {
    const response = await fetch("https://ve.dolarapi.com/v1/dolares/oficial", {
      next: { revalidate: 86400 }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch BCV via DolarApi: ${response.status}`)
    }

    const data = await response.json()
    const rate = data.promedio

    if (!rate || isNaN(rate)) {
      throw new Error("Parsed rate is invalid")
    }

    return NextResponse.json({ rate, source: "bcv" })
  } catch (error) {
    console.error("BCV Fetch Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch BCV rate", rate: null },
      { status: 500 }
    )
  }
}
