import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { CourseBadge } from "@/components/course-badge"
import type { WorkWithUser } from "@/lib/types"

export function WorkCard({ work }: { work: WorkWithUser }) {
  return (
    <Link href={`/works/${work.id}`}>
      <Card className="group overflow-hidden transition-shadow hover:shadow-md">
        <div className="relative aspect-video overflow-hidden bg-muted">
          <Image
            src={work.imageKey}
            alt={work.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
        <div className="flex flex-col gap-3 p-4">
          <CourseBadge course={work.course} />
          <h3 className="line-clamp-1 leading-tight font-semibold">
            {work.title}
          </h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {work.description}
          </p>
          <p className="text-xs text-muted-foreground">{work.authorName}</p>
        </div>
      </Card>
    </Link>
  )
}
