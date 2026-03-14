import Link from "next/link"
import { Plus } from "lucide-react"
import { auth, signIn, signOut } from "@/auth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export async function Header() {
  const session = await auth()
  const user = session?.user

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          GeekGallery
        </Link>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button asChild size="sm">
                <Link href="/works/new">
                  <Plus data-icon="inline-start" />
                  投稿する
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <Avatar className="size-8">
                      <AvatarImage
                        src={user.image ?? undefined}
                        alt={user.name ?? ""}
                      />
                      <AvatarFallback>
                        {user.name?.charAt(0) ?? "U"}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <form
                      action={async () => {
                        "use server"
                        await signOut()
                      }}
                    >
                      <button type="submit" className="w-full text-left">
                        ログアウト
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <form
              action={async () => {
                "use server"
                await signIn("google")
              }}
            >
              <Button type="submit">ログイン</Button>
            </form>
          )}
        </div>
      </div>
    </header>
  )
}
