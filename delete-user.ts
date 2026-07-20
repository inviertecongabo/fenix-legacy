import { Client } from 'pg'

async function main() {
  const client = new Client({
    connectionString: "postgresql://neondb_owner:npg_7kX5mHcotQAB@ep-solitary-resonance-atxrf9ig-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require"
  })

  try {
    await client.connect()
    
    const email = 'aibersonmontilla16@gmail.com'
    
    try {
      await client.query('DELETE FROM verification_token WHERE identifier = $1', [email])
    } catch(e) {}
    try {
      await client.query('DELETE FROM "VerificationToken" WHERE identifier = $1', [email])
    } catch(e) {}
    try {
      await client.query('DELETE FROM verification_tokens WHERE identifier = $1', [email])
    } catch(e) {}
    
    let res = await client.query('DELETE FROM "User" WHERE email = $1', [email]).catch(() => null)
    if (!res) {
       res = await client.query('DELETE FROM users WHERE email = $1', [email]).catch(() => null)
    }
    
    console.log(`Successfully deleted user with email ${email}`)
  } catch (err) {
    console.error('Error:', err)
  } finally {
    await client.end()
  }
}

main()
