"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { COURSES } from "@/lib/constants"

export function CourseFilter() {
  const searchParams = useSearchParams()
  const current = searchParams.get("course")

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        asChild
        variant={current === null ? "primary" : "outline"}
        size="sm"
      >
        <Link href="/">すべて</Link>
      </Button>
      {COURSES.map((course) => (
        <Button
          key={course}
          asChild
          variant={current === course ? "primary" : "outline"}
          size="sm"
          className="font-medium"
        >
          <Link href={`/?course=${encodeURIComponent(course)}`}>{course}</Link>
        </Button>
      ))}
    </div>
  )
}
