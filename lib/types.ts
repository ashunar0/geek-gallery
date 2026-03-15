import type { InferSelectModel } from "drizzle-orm"
import type { users, works } from "./db/schema"

export type User = InferSelectModel<typeof users>
export type Work = InferSelectModel<typeof works>

/** ユーザー情報付きの作品（一覧・詳細表示用） */
export type WorkWithUser = Work & {
  user: Pick<User, "id" | "name" | "image" | "bio" | "githubUsername" | "xUsername" | "websiteUrl">
}
