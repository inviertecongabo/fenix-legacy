import { NextResponse } from "next/server"
import https from "https"

// Cache the rate for 24 hours (86400 seconds) since BCV updates daily at 4:00 PM
export const revalidate = 86400

export async function GET() {
  try {
    const rate = await new Promise<number>((resolve, reject) => {
      const options = {
        hostname: 'www.bcv.org.ve',
        port: 443,
        path: '/',
        method: 'GET',
        rejectUnauthorized: false, // Bypass strict SSL issues from BCV
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3"
        }
      }

      const req = https.request(options, (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => {
          if (res.statusCode !== 200) {
            reject(new Error(`Failed to fetch BCV: ${res.statusCode}`))
            return
          }
          
          const match = data.match(/<div\s+id="dolar"[\s\S]*?<strong>\s*([\d,.]+)\s*<\/strong>/)
          
          if (!match) {
            reject(new Error("Could not find dollar rate in BCV HTML"))
            return
          }

          const rateString = match[1].replace(',', '.')
          const parsedRate = parseFloat(rateString)

          if (isNaN(parsedRate)) {
            reject(new Error("Parsed rate is NaN"))
            return
          }

          resolve(parsedRate)
        })
      })

      req.on('error', (err) => {
        reject(err)
      })
      
      req.setTimeout(10000, () => {
        req.destroy()
        reject(new Error("Timeout fetching BCV"))
      })

      req.end()
    })

    return NextResponse.json({ rate, source: "bcv" })
  } catch (error) {
    console.error("BCV Fetch Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch BCV rate", rate: null },
      { status: 500 }
    )
  }
}
