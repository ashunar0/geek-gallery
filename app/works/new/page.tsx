import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { WorkForm } from "@/components/work-form"

export default async function NewWorkPage() {
  const session = await auth()
  if (!session) redirect("/")

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-xl font-bold">作品を投稿する</h1>
      <WorkForm />
    </div>
  )
}
