import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { works } from "@/lib/db/schema"
import { COURSES } from "@/lib/constants"

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
  }

  const body = await request.json()

  const { title, url, imageKey, techStack, description, authorName, duration, course, cohort, highlight } = body

  // バリデーション
  if (!title || !url || !imageKey || !techStack?.length || !description || !authorName || !duration || !course) {
    return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 })
  }

  if (!COURSES.includes(course)) {
    return NextResponse.json({ error: "無効なコースです" }, { status: 400 })
  }

  const [work] = await db
    .insert(works)
    .values({
      userId: session.user.id,
      title,
      url,
      imageKey,
      techStack,
      description,
      authorName,
      duration,
      course,
      cohort: cohort ?? null,
      highlight: highlight ?? null,
    })
    .returning()

  return NextResponse.json(work, { status: 201 })
}
