import Link from "next/link"
import { LogOut, Plus } from "lucide-react"
import { auth, signIn, signOut } from "@/auth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"

export async function Header() {
  const session = await auth()
  const user = session?.user

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Image src="/gallery.svg" alt="GeekGallery" width={36} height={36} />
          <Link href="/" className="text-2xl font-bold tracking-tight">
            GeekGallery
          </Link>
        </div>

        <div className="flex items-center gap-4">
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
                  <button className="size-8 cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
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
                      <button
                        type="submit"
                        className="flex w-full cursor-pointer items-center gap-2 text-left text-sm"
                      >
                        <LogOut className="size-4" />
                        ログアウト
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : null}
        </div>
      </div>
    </header>
  )
}
