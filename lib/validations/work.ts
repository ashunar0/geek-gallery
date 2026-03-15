import { z } from "zod"
import { COURSES } from "@/lib/constants"

export const workSchema = z.object({
  title: z.string().min(1, "タイトルを入力してください"),
  url: z.string().url("有効なURLを入力してください"),
  githubUrl: z
    .string()
    .url("有効なURLを入力してください")
    .or(z.literal(""))
    .optional(),
  course: z.enum(COURSES, { required_error: "コースを選択してください" }),
  cohort: z
    .number({ invalid_type_error: "期数を入力してください" })
    .int()
    .positive("正の整数を入力してください"),
  duration: z.string().min(1, "制作期間を入力してください"),
  techStack: z.array(z.string()).min(1, "技術スタックを1つ以上追加してください"),
  description: z.string().min(1, "説明を入力してください"),
  highlight: z.string().optional(),
})

export type WorkFormValues = z.infer<typeof workSchema>
