import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client"
import pg from "pg"
import bcrypt from "bcryptjs"

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const hash = await bcrypt.hash("admin123", 10)
  console.log("New hash:", hash)

  const updated = await prisma.user.update({
    where: { email: "admin@fenixlegacy.com" },
    data: { password: hash },
  })
  console.log("Password updated for:", updated.email)
  await pool.end()
}

main().catch(console.error)
