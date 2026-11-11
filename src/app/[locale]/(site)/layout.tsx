import { ScrollProgressProvider } from "@/components/brand/scroll-progress"
import { SkipLink } from "@/components/brand/skip-link"
import { Footer } from "@/components/site/footer"
import { Header } from "@/components/site/header"

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ScrollProgressProvider>
    <div className="public-canvas flex min-h-dvh flex-col bg-background text-foreground">
      <SkipLink />
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
    </ScrollProgressProvider>
  )
}
