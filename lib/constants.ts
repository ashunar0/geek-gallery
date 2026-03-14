export const COURSES = [
  "Web",
  "Web Expert",
  "Game",
  "AI",
  "Portfolio",
] as const

export type Course = (typeof COURSES)[number]
