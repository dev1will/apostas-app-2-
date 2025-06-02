"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, Percent, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CalculadorasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Se estiver na página principal das calculadoras, não mostrar as tabs
  if (pathname === "/calculadoras") {
    return children
  }

  return (
    <div className="container mx-auto max-w-2xl space-y-6 p-4">
      {/* Botão de voltar */}
      <div className="flex items-center space-x-4">
        <Link href="/calculadoras">
          <Button variant="ghost" size="sm" className="dark:hover:bg-gray-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Calculadoras</h1>
      </div>

      {/* Tabs para navegação entre calculadoras */}
      <Tabs value={pathname} className="w-full">
        <TabsList className="grid w-full grid-cols-2 dark:bg-theme-dark-card">
          <TabsTrigger value="/calculadoras/surebet" asChild>
            <Link
              href="/calculadoras/surebet"
              className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary dark:data-[state=active]:bg-theme-dark-primary/20 dark:data-[state=active]:text-theme-dark-primary"
            >
              <Calculator className="h-4 w-4" /> Matched Betting
            </Link>
          </TabsTrigger>
          <TabsTrigger value="/calculadoras/cashback" asChild>
            <Link
              href="/calculadoras/cashback"
              className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary dark:data-[state=active]:bg-theme-dark-primary/20 dark:data-[state=active]:text-theme-dark-primary"
            >
              <Percent className="h-4 w-4" /> Cashback
            </Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-6">{children}</div>
    </div>
  )
}
