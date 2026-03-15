"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { DeleteWorkButton } from "@/components/delete-work-button"

export function WorkOwnerActions({
  workId,
  userId,
}: {
  workId: string
  userId: string
}) {
  const { data: session } = useSession()

  if (session?.user?.id !== userId) return null

  return (
    <div className="flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button asChild variant="ghost" size="sm">
            <Link href={`/works/${workId}/edit`}>
              <Pencil className="size-4" />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>編集する</TooltipContent>
      </Tooltip>
      <DeleteWorkButton workId={workId} />
    </div>
  )
}
