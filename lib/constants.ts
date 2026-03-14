export const COURSES = [
  "Web",
  "Web Expert",
  "Game",
  "AI",
  "Portfolio",
] as const

export type Course = (typeof COURSES)[number]

export const COURSE_COLORS: Record<Course, string> = {
  Web: "#E8606A",
  "Web Expert": "#B23B61",
  Game: "#52B1E8",
  AI: "#BCA820",
  Portfolio: "#1CD2AB",
}
