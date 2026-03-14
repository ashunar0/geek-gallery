import { config } from "dotenv"
config({ path: ".env.local" })

import { neon } from "@neondatabase/serverless"

async function main() {
  const sql = neon(process.env.DATABASE_URL!)
  await sql`DROP TABLE IF EXISTS works CASCADE`
  await sql`DROP TABLE IF EXISTS users CASCADE`
  await sql`DROP TABLE IF EXISTS accounts CASCADE`
  await sql`DROP TABLE IF EXISTS sessions CASCADE`
  await sql`DROP TABLE IF EXISTS "verificationTokens" CASCADE`
  console.log("All tables dropped")
}

main()
