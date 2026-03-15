import { ExternalLink } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 text-sm text-muted-foreground">
        <p>&copy; GeekSalon</p>
        <a
          href="https://geek-salon.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
        >
          公式サイト
          <ExternalLink className="size-3.5" />
        </a>
      </div>
    </footer>
  )
}
