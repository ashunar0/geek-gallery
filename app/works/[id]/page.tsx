import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { CourseBadge } from "@/components/course-badge"
import { getWorkById } from "@/lib/queries/works"
import { GitHubIcon } from "@/components/icons"
import { DeleteWorkButton } from "@/components/delete-work-button"
import { ArrowLeft, ExternalLink, Pencil } from "lucide-react"

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [{ id }, session] = await Promise.all([params, auth()])
  const work = await getWorkById(id)

  if (!work) notFound()

  const isOwner = session?.user?.id === work.userId

  return (
    <div className="space-y-4">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        一覧に戻る
      </Link>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* メインカード（左） */}
        <Card className="flex-1 overflow-hidden">
          {/* ヘッダー */}
          <div className="space-y-2 p-5 pb-0">
            <div className="flex flex-wrap items-center gap-3">
              <CourseBadge course={work.course} />
              <span className="text-sm text-muted-foreground">
                第{work.cohort}期 · {work.duration}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <h1 className="text-xl font-bold tracking-tight">{work.title}</h1>
              {isOwner && (
                <div className="flex items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/works/${work.id}/edit`}>
                          <Pencil className="size-4" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>編集する</TooltipContent>
                  </Tooltip>
                  <DeleteWorkButton workId={work.id} />
                </div>
              )}
            </div>
          </div>

          {/* サムネイル */}
          <div className="p-5">
            <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
              {work.imageKey ? (
                <Image
                  src={work.imageKey}
                  alt={work.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 700px"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  No Image
                </div>
              )}
            </div>
          </div>

          {/* コンテンツ */}
          <div className="space-y-5 px-5 pb-6">
            {/* リンク */}
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <a
                href={work.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <ExternalLink className="size-3.5" />
                {work.url}
              </a>
              {work.githubUrl && (
                <a
                  href={work.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <GitHubIcon className="size-3.5" />
                  GitHub
                </a>
              )}
            </div>

            {/* 説明 */}
            <p className="leading-relaxed">{work.description}</p>

            {/* こだわりポイント */}
            {work.highlight && (
              <div className="rounded-lg border bg-muted/30 p-4">
                <h2 className="mb-2 text-sm font-semibold">推しポイント</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {work.highlight}
                </p>
              </div>
            )}

            {/* 技術スタック */}
            <div>
              <h2 className="mb-2 text-sm font-semibold">技術スタック</h2>
              <div className="flex flex-wrap gap-2">
                {work.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border bg-muted/50 px-2.5 py-1 text-xs font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* サイドカード（右） — 作者情報 */}
        <Card className="w-full shrink-0 lg:w-64">
          <div className="flex flex-col items-center gap-3 p-6">
            <Link
              href={`/users/${work.user.id}`}
              className="flex flex-col items-center gap-3 transition-colors hover:opacity-80"
            >
              {work.user.image && (
                <Image
                  src={work.user.image}
                  alt={work.user.name ?? ""}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              )}
              <p className="font-semibold">{work.user.name}</p>
            </Link>
            {work.user.githubUsername && (
              <a
                href={`https://github.com/${work.user.githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
                title="GitHub"
              >
                <GitHubIcon className="size-5" />
              </a>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
