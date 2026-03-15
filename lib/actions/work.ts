"use server"

import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { works } from "@/lib/db/schema"
import { workSchema } from "@/lib/validations/work"

export async function createWork(data: unknown) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("認証が必要です")

  const parsed = workSchema.parse(data)

  const [work] = await db
    .insert(works)
    .values({
      userId: session.user.id,
      title: parsed.title,
      url: parsed.url,
      githubUrl: parsed.githubUrl || null,
      imageKey: "", // TODO: R2 接続時に画像URLを設定
      techStack: parsed.techStack,
      description: parsed.description,
      authorName: session.user.name ?? "",
      duration: parsed.duration,
      course: parsed.course,
      cohort: parsed.cohort ?? null,
      highlight: parsed.highlight || null,
    })
    .returning()

  redirect(`/works/${work.id}`)
}

export async function updateWork(id: string, data: unknown) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("認証が必要です")

  // 権限チェック
  const [existing] = await db
    .select()
    .from(works)
    .where(eq(works.id, id))
    .limit(1)

  if (!existing) throw new Error("作品が見つかりません")
  if (existing.userId !== session.user.id) throw new Error("編集権限がありません")

  const parsed = workSchema.parse(data)

  await db
    .update(works)
    .set({
      title: parsed.title,
      url: parsed.url,
      githubUrl: parsed.githubUrl || null,
      techStack: parsed.techStack,
      description: parsed.description,
      duration: parsed.duration,
      course: parsed.course,
      cohort: parsed.cohort ?? null,
      highlight: parsed.highlight || null,
      updatedAt: new Date(),
    })
    .where(eq(works.id, id))

  redirect(`/works/${id}`)
}
