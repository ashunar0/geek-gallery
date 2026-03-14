import { COURSE_COLORS, type Course } from "@/lib/constants"

export function CourseBadge({ course }: { course: string }) {
  const color = COURSE_COLORS[course as Course] ?? "#888"

  return (
    <span
      className="inline-flex w-fit items-center rounded-md px-2 py-0.5 text-xs font-medium"
      style={{
        color,
        backgroundColor: `${color}15`,
        border: `1px solid ${color}30`,
      }}
    >
      {course}
    </span>
  )
}
