import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { works } from "@/lib/db/schema"

type Params = { params: Promise<{ id: string }> }

export async function PUT(request: Request, { params }: Params) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
  }

  const { id } = await params

  // 既存の作品を取得して権限チェック
  const [existing] = await db
    .select()
    .from(works)
    .where(eq(works.id, id))
    .limit(1)

  if (!existing) {
    return NextResponse.json({ error: "作品が見つかりません" }, { status: 404 })
  }

  if (existing.userId !== session.user.id) {
    return NextResponse.json({ error: "編集権限がありません" }, { status: 403 })
  }

  const body = await request.json()

  const [updated] = await db
    .update(works)
    .set({
      ...body,
      updatedAt: new Date(),
    })
    .where(eq(works.id, id))
    .returning()

  return NextResponse.json(updated)
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
  }

  const { id } = await params

  const [existing] = await db
    .select()
    .from(works)
    .where(eq(works.id, id))
    .limit(1)

  if (!existing) {
    return NextResponse.json({ error: "作品が見つかりません" }, { status: 404 })
  }

  if (existing.userId !== session.user.id) {
    return NextResponse.json({ error: "削除権限がありません" }, { status: 403 })
  }

  await db.delete(works).where(eq(works.id, id))

  return NextResponse.json({ success: true })
}
