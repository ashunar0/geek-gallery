import Link from "next/link"
import { notFound } from "next/navigation"
import { auth } from "@/auth"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { GitHubIcon } from "@/components/icons"
import { WorkCard } from "@/components/work-card"
import { getUserById } from "@/lib/queries/users"
import { getWorksByUserId } from "@/lib/queries/works"
import { Plus } from "lucide-react"

export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [{ id }, session] = await Promise.all([params, auth()])
  const user = await getUserById(id)

  if (!user) notFound()

  const works = await getWorksByUserId(id)
  const isOwner = session?.user?.id === id

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
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">作品（{works.length}）</h2>
          {isOwner && (
            <Button asChild size="sm">
              <Link href="/works/new">
                <Plus className="size-4" />
                投稿する
              </Link>
            </Button>
          )}
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
