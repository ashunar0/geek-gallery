import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { GitHubIcon, XIcon } from "@/components/icons"
import { ProfileEditButton, NewWorkButton } from "@/components/user-owner-actions"
import { WorkCard } from "@/components/work-card"
import { getUserById } from "@/lib/queries/users"
import { getWorksByUserId } from "@/lib/queries/works"
import { Globe } from "lucide-react"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const user = await getUserById(id)

  if (!user) return { title: "ユーザーが見つかりません" }

  const name = user.name ?? "ユーザー"
  const description = user.bio ?? `${name}の作品一覧`

  return {
    title: `${name}の作品`,
    description,
    openGraph: {
      title: `${name}の作品`,
      description,
      type: "profile",
    },
  }
}

export const revalidate = 60

export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getUserById(id)

  if (!user) notFound()

  const works = await getWorksByUserId(id)

  return (
    <div className="space-y-8">
      {/* プロフィール */}
      <div className="flex items-center gap-8 py-8">
        <Avatar className="size-24">
          {user.image && <AvatarImage src={user.image} alt={user.name ?? ""} />}
        </Avatar>
        <div className="flex flex-1 flex-col gap-3">
          <h1 className="text-xl font-bold">{user.name}</h1>
          {user.bio && (
            <p className="text-sm text-muted-foreground">{user.bio}</p>
          )}
          <div className="flex items-center gap-3">
            {user.githubUsername && (
              <a
                href={`https://github.com/${user.githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <GitHubIcon className="size-5" />
              </a>
            )}
            {user.xUsername && (
              <a
                href={`https://x.com/${user.xUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <XIcon className="size-5" />
              </a>
            )}
            {user.websiteUrl && (
              <a
                href={user.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <Globe className="size-5" />
              </a>
            )}
          </div>
        </div>
        <ProfileEditButton user={user} />
      </div>

      {/* 作品一覧 */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">作品（{works.length}）</h2>
          <NewWorkButton userId={id} />
        </div>
        {works.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {works.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            まだ作品がありません。
          </p>
        )}
      </div>
    </div>
  )
}
