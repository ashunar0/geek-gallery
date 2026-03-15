"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProfileEditDialog } from "@/components/profile-edit-dialog"
import type { User } from "@/lib/types"

export function ProfileEditButton({ user }: { user: User }) {
  const { data: session } = useSession()

  if (session?.user?.id !== user.id) return null

  return <ProfileEditDialog user={user} />
}

export function NewWorkButton({ userId }: { userId: string }) {
  const { data: session } = useSession()

  if (session?.user?.id !== userId) return null

  return (
    <Button asChild size="sm">
      <Link href="/works/new">
        <Plus className="size-4" />
        投稿する
      </Link>
    </Button>
  )
}
