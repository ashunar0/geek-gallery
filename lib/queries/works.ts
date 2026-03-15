import { desc, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { works, users } from "@/lib/db/schema"
import type { WorkWithUser } from "@/lib/types"

/** 作品一覧（新着順、コース別フィルタ対応） */
export async function getWorks(course?: string): Promise<WorkWithUser[]> {
  const rows = await db
    .select({
      work: works,
      user: {
        id: users.id,
        name: users.name,
        image: users.image,
        githubUsername: users.githubUsername,
      },
    })
    .from(works)
    .innerJoin(users, eq(works.userId, users.id))
    .where(course ? eq(works.course, course) : undefined)
    .orderBy(desc(works.createdAt))

  return rows.map((row) => ({
    ...row.work,
    user: row.user,
  }))
}

/** 作品詳細（ID指定） */
export async function getWorkById(
  id: string,
): Promise<WorkWithUser | null> {
  const rows = await db
    .select({
      work: works,
      user: {
        id: users.id,
        name: users.name,
        image: users.image,
        githubUsername: users.githubUsername,
      },
    })
    .from(works)
    .innerJoin(users, eq(works.userId, users.id))
    .where(eq(works.id, id))
    .limit(1)

  if (rows.length === 0) return null

  return {
    ...rows[0].work,
    user: rows[0].user,
  }
}

/** ユーザー別の作品一覧 */
export async function getWorksByUserId(
  userId: string,
): Promise<WorkWithUser[]> {
  const rows = await db
    .select({
      work: works,
      user: {
        id: users.id,
        name: users.name,
        image: users.image,
        githubUsername: users.githubUsername,
      },
    })
    .from(works)
    .innerJoin(users, eq(works.userId, users.id))
    .where(eq(works.userId, userId))
    .orderBy(desc(works.createdAt))

  return rows.map((row) => ({
    ...row.work,
    user: row.user,
  }))
}
