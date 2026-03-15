import { Suspense } from "react"
import { WorkCard } from "@/components/work-card"
import { CourseFilter } from "@/components/course-filter"
import { getWorks } from "@/lib/queries/works"

export const revalidate = 60

type Props = {
  searchParams: Promise<{ course?: string }>
}

export default async function HomePage({ searchParams }: Props) {
  const { course } = await searchParams

  const works = await getWorks(course)

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
