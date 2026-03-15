"use server"

import { eq } from "drizzle-orm"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { revalidatePath } from "next/cache"

export async function updateProfile(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("認証が必要です")

  const name = (formData.get("name") as string)?.trim()
  if (!name) throw new Error("表示名は必須です")

  await db
    .update(users)
    .set({
      name,
      bio: (formData.get("bio") as string)?.trim() || null,
      githubUsername: (formData.get("githubUsername") as string)?.trim() || null,
      xUsername: (formData.get("xUsername") as string)?.trim() || null,
      websiteUrl: (formData.get("websiteUrl") as string)?.trim() || null,
    })
    .where(eq(users.id, session.user.id))

  revalidatePath(`/users/${session.user.id}`)
}
