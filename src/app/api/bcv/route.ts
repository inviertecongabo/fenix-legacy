import { NextResponse } from "next/server"

// Cache the rate for 1 hour
export const revalidate = 3600

export async function GET() {
  try {
    // We add an AbortController to not hang forever if BCV is slow
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000)

    const response = await fetch("https://www.bcv.org.ve/", {
      next: { revalidate: 3600 },
      signal: controller.signal,
      headers: {
        // Mock a standard browser user-agent to prevent basic blocks
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3"
      }
    })
    
    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Failed to fetch BCV: ${response.status}`)
    }

    const html = await response.text()
    
    // Look for the dollar rate in the HTML
    // Example: <div id="dolar">...<strong> 36,45000000 </strong>
    const match = html.match(/<div\s+id="dolar"[\s\S]*?<strong>\s*([\d,.]+)\s*<\/strong>/)
    
    if (!match) {
      throw new Error("Could not find dollar rate in BCV HTML")
    }

    // Parse the matched string (e.g. "36,45000000") to a float
    const rateString = match[1].replace(',', '.')
    const rate = parseFloat(rateString)

    if (isNaN(rate)) {
      throw new Error("Parsed rate is NaN")
    }

    return NextResponse.json({ rate, source: "bcv" })
  } catch (error) {
    console.error("BCV Fetch Error:", error)
    // Return a fallback or error
    return NextResponse.json(
      { error: "Failed to fetch BCV rate", rate: null },
      { status: 500 }
    )
  }
}
