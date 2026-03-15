import { notFound } from "next/navigation"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { GitHubIcon } from "@/components/icons"
import { WorkCard } from "@/components/work-card"
import { mockUsers, mockWorks } from "@/lib/mock-data"

export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = mockUsers.find((u) => u.id === id)

  if (!user) notFound()

  const works = mockWorks.filter((w) => w.userId === user.id)

  return (
    <div className="space-y-8">
      {/* プロフィール */}
      <div className="flex items-center gap-8 py-8">
        <Avatar className="size-16">
          {user.image && <AvatarImage src={user.image} alt={user.name ?? ""} />}
        </Avatar>
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-bold">{user.name}</h1>
          {user.githubUrl && (
            <a
              href={user.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <GitHubIcon className="size-4" />
              GitHub
            </a>
          )}
        </div>
      </div>

      {/* 作品一覧 */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">作品（{works.length}）</h2>
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
