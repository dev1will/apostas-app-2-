import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import dynamic from "next/dynamic"
import { ThemeProvider } from "@/components/theme-provider"
import { CurrencyProvider } from "@/components/currency-context"
import { AuthProvider } from "@/components/auth-context"
import { Toaster } from "@/components/ui/toaster"

// Carregamento dinâmico do BottomNav para melhorar a performance inicial
const BottomNav = dynamic(() => import("@/components/bottom-nav"), {
  ssr: false,
  loading: () => (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-sm dark:bg-theme-dark-card/95 h-16"></div>
  ),
})

export const metadata: Metadata = {
  title: "App de Apostas Esportivas",
  description: "Gerencie suas apostas e maximize seus lucros.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <CurrencyProvider>
            <AuthProvider>
              <div className="flex min-h-screen flex-col">
                <main className="flex-grow pb-20 pt-4 md:pb-16">{children}</main>
                <BottomNav />
              </div>
              <Toaster />
            </AuthProvider>
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
