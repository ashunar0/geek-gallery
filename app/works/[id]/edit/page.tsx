import { redirect, notFound } from "next/navigation"
import { auth } from "@/auth"
import { WorkForm } from "@/components/work-form"
import { mockWorks } from "@/lib/mock-data"

export default async function EditWorkPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session) redirect("/")

  const { id } = await params
  const work = mockWorks.find((w) => w.id === id)

  if (!work) notFound()

  // 自分の作品でなければトップに戻す
  if (work.userId !== session.user?.id) redirect("/")

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-xl font-bold">作品を編集する</h1>
      <WorkForm work={work} />
    </div>
  )
}
