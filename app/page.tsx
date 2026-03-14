import { Suspense } from "react"
import { WorkCard } from "@/components/work-card"
import { CourseFilter } from "@/components/course-filter"
import { mockWorks } from "@/lib/mock-data"

type Props = {
  searchParams: Promise<{ course?: string }>
}

export default async function HomePage({ searchParams }: Props) {
  const { course } = await searchParams

  // TODO: #15 でDB取得に切り替え
  const works = course
    ? mockWorks.filter((w) => w.course === course)
    : mockWorks

  return (
    <div className="flex flex-col gap-6">
      <Suspense>
        <CourseFilter />
      </Suspense>

      {works.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          作品がまだありません
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {works.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>
      )}
    </div>
  )
}
