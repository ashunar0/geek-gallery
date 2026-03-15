import type { Metadata } from "next"
import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "GeekGallery | GeekSalon 受講生作品集",
  description: "GeekSalon 受講生の作品をギャラリー形式で閲覧できるサイト",
  icons: {
    icon: "/gallery.svg",
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
      <body suppressHydrationWarning>
        <ThemeProvider>
          <Header />
          <main className="min-h-[calc(100vh-4rem)] bg-muted/40">
            <div className="mx-auto max-w-7xl px-4 py-6">{children}</div>
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
