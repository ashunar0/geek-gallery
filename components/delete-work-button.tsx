"use client"

import { useTransition } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { deleteWork } from "@/lib/actions/work"

export function DeleteWorkButton({ workId }: { workId: string }) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm("本当にこの作品を削除しますか？この操作は取り消せません。")) return

    startTransition(() => {
      deleteWork(workId)
    })
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={isPending}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>削除する</TooltipContent>
    </Tooltip>
  )
}
