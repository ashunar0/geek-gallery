"use client"

import { useTransition } from "react"
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { updateProfile } from "@/lib/actions/user"

type Props = {
  user: {
    name: string | null
    bio: string | null
    githubUsername: string | null
    xUsername: string | null
    websiteUrl: string | null
  }
}

export function ProfileEditDialog({ user }: Props) {
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      await updateProfile(formData)
      // Dialog を閉じるために close ボタンをクリック
      document.querySelector<HTMLButtonElement>("[data-profile-close]")?.click()
    })
  }

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <Pencil className="size-4" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>編集する</TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>プロフィール編集</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">表示名 *</Label>
            <Input
              id="name"
              name="name"
              defaultValue={user.name ?? ""}
              required
              placeholder="表示名"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="bio">自己紹介</Label>
            <Textarea
              id="bio"
              name="bio"
              defaultValue={user.bio ?? ""}
              placeholder="GeekSalon 10期生 / Webコース"
              rows={3}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="githubUsername">GitHub ユーザー名</Label>
            <Input
              id="githubUsername"
              name="githubUsername"
              defaultValue={user.githubUsername ?? ""}
              placeholder="username"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="xUsername">X ユーザー名</Label>
            <Input
              id="xUsername"
              name="xUsername"
              defaultValue={user.xUsername ?? ""}
              placeholder="username"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="websiteUrl">ウェブサイト</Label>
            <Input
              id="websiteUrl"
              name="websiteUrl"
              defaultValue={user.websiteUrl ?? ""}
              placeholder="https://example.com"
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" data-profile-close>
                キャンセル
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "保存中..." : "保存"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
