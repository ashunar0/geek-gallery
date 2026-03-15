import type { Metadata } from "next"
import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "@/components/session-provider"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: {
    default: "GeekGallery | GeekSalon 受講生作品集",
    template: "%s | GeekGallery",
  },
  description: "GeekSalon 受講生の作品をギャラリー形式で閲覧できるサイト",
  icons: {
    icon: "/gallery.svg",
  },
  openGraph: {
    title: "GeekGallery | GeekSalon 受講生作品集",
    description: "GeekSalon 受講生の作品をギャラリー形式で閲覧できるサイト",
    siteName: "GeekGallery",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ja"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body suppressHydrationWarning className="flex min-h-screen flex-col">
        <SessionProvider>
          <ThemeProvider>
            <TooltipProvider>
              <Header />
              <main className="flex-1 bg-muted/40">
                <div className="mx-auto max-w-7xl px-4 py-6">{children}</div>
              </main>
              <Footer />
            </TooltipProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
