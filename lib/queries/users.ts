import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import type { User } from "@/lib/types"

/** ユーザー詳細（ID指定） */
export async function getUserById(id: string): Promise<User | null> {
  const rows = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1)

  return rows[0] ?? null
}
