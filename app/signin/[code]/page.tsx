import { redirect } from "next/navigation"
import { auth, signIn } from "@/auth"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"

export default async function SignInPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params

  if (code !== process.env.INVITE_CODE) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <p className="text-muted-foreground">無効なリンクです。</p>
      </div>
    )
  }

  const session = await auth()
  if (session) redirect("/")

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <Card className="w-full max-w-sm p-8">
        <div className="flex flex-col items-center gap-6">
          <Image src="/gallery.svg" alt="GeekGallery" width={48} height={48} />
          <div className="text-center">
            <h1 className="text-xl font-bold">GeekGallery</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              GeekSalon 受講生作品集
            </p>
          </div>
          <form
            action={async () => {
              "use server"
              await signIn("google", { redirectTo: "/" })
            }}
            className="w-full"
          >
            <Button type="submit" variant="outline" className="w-full" size="lg">
              <Image src="/google.svg" alt="" width={20} height={20} />
              Googleでログイン
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
