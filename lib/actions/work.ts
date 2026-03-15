"use server"

import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { works } from "@/lib/db/schema"
import { r2, R2_BUCKET_NAME, R2_PUBLIC_URL } from "@/lib/r2"
import { workSchema } from "@/lib/validations/work"

async function uploadImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "png"
  const key = `works/${crypto.randomUUID()}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  await r2.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    })
  )

  return `${R2_PUBLIC_URL}/${key}`
}

export async function createWork(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("認証が必要です")

  const data = {
    title: formData.get("title"),
    url: formData.get("url"),
    githubUrl: formData.get("githubUrl"),
    course: formData.get("course"),
    cohort: Number(formData.get("cohort")) || undefined,
    duration: formData.get("duration"),
    techStack: JSON.parse(formData.get("techStack") as string),
    description: formData.get("description"),
    highlight: formData.get("highlight"),
  }

  const parsed = workSchema.parse(data)

  // 画像アップロード
  const imageFile = formData.get("image") as File | null
  let imageKey = ""
  if (imageFile && imageFile.size > 0) {
    imageKey = await uploadImage(imageFile)
  }

  const [work] = await db
    .insert(works)
    .values({
      userId: session.user.id,
      title: parsed.title,
      url: parsed.url,
      githubUrl: parsed.githubUrl || null,
      imageKey,
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

export async function updateWork(id: string, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("認証が必要です")

  const [existing] = await db
    .select()
    .from(works)
    .where(eq(works.id, id))
    .limit(1)

  if (!existing) throw new Error("作品が見つかりません")
  if (existing.userId !== session.user.id) throw new Error("編集権限がありません")

  const data = {
    title: formData.get("title"),
    url: formData.get("url"),
    githubUrl: formData.get("githubUrl"),
    course: formData.get("course"),
    cohort: Number(formData.get("cohort")) || undefined,
    duration: formData.get("duration"),
    techStack: JSON.parse(formData.get("techStack") as string),
    description: formData.get("description"),
    highlight: formData.get("highlight"),
  }

  const parsed = workSchema.parse(data)

  // 新しい画像があればアップロード
  const imageFile = formData.get("image") as File | null
  let imageKey = existing.imageKey
  if (imageFile && imageFile.size > 0) {
    imageKey = await uploadImage(imageFile)
  }

  await db
    .update(works)
    .set({
      title: parsed.title,
      url: parsed.url,
      githubUrl: parsed.githubUrl || null,
      imageKey,
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
