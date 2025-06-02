"use client"

import { DollarSign, Calculator, Gift, Edit3, Percent, TrendingUp } from "lucide-react"
import { useCurrency } from "@/components/currency-context"
import { LazyCard } from "@/components/lazy-card"
import { memo, useState, useEffect } from "react"
import Link from "next/link"

// Componente de atalho otimizado
const ShortcutCard = memo(function ShortcutCard({
  title,
  icon: Icon,
  href,
  color,
  delay = 0,
}: {
  title: string
  icon: any
  href: string
  color: string
  delay?: number
}) {
  const [isVisible, setIsVisible] = useState(delay === 0)

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => setIsVisible(true), delay)
      return () => clearTimeout(timer)
    }
  }, [delay])

  if (!isVisible) {
    return <div className="block bg-card dark:bg-theme-dark-card h-[94px] animate-pulse rounded-lg" />
  }

  return (
    <Link href={href} legacyBehavior>
      <div className="block bg-card dark:bg-theme-dark-card hover:shadow-lg transition-shadow duration-200 cursor-pointer rounded-lg p-4">
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <Icon className={`h-8 w-8 mb-1 ${color}`} />
          <p className="text-sm font-medium text-foreground">{title}</p>
        </div>
      </div>
    </Link>
  )
})

// Dashboard principal
export default function DashboardPage() {
  const { formatCurrency } = useCurrency()
  const [isLoaded, setIsLoaded] = useState(false)

  // Simular carregamento progressivo
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Dados mockados - em produção viriam de uma API ou estado global
  const bankroll = 1250.75
  const todayProfit = 85.5
  const monthlyProfit = 1420.3

  const shortcuts = [
    { title: "Registrar Operação", icon: Edit3, href: "/registro", color: "text-blue-500 dark:text-blue-400" },
    {
      title: "Acompanhar Banca",
      icon: TrendingUp,
      href: "/acompanhamento",
      color: "text-green-500 dark:text-green-400",
    },
    {
      title: "Calculadora Matched Betting",
      icon: Calculator,
      href: "/calculadoras/surebet",
      color: "text-purple-500 dark:text-purple-400",
    },
    {
      title: "Calculadora Cashback",
      icon: Percent,
      href: "/calculadoras/cashback",
      color: "text-yellow-500 dark:text-yellow-400",
    },
    { title: "Gerenciar FreeBets", icon: Gift, href: "/freebets", color: "text-pink-500 dark:text-pink-400" },
  ]

  return (
    <div className="container mx-auto max-w-3xl space-y-6 p-4">
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <LazyCard
          className="bg-card dark:bg-theme-dark-card shadow-lg"
          header={
            <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
              <h3 className="text-sm font-medium">Saldo da Banca</h3>
              <DollarSign className="h-5 w-5 text-muted-foreground" />
            </div>
          }
        >
          <div className="text-2xl font-bold text-primary dark:text-theme-dark-primary">{formatCurrency(bankroll)}</div>
          <p className="text-xs text-muted-foreground pt-1">Atualizado recentemente</p>
        </LazyCard>

        <LazyCard
          className="bg-card dark:bg-theme-dark-card shadow-lg"
          delay={100}
          header={
            <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
              <h3 className="text-sm font-medium">Lucro Hoje</h3>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
          }
        >
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">+{formatCurrency(todayProfit)}</div>
          <p className="text-xs text-muted-foreground pt-1">Desde 00:00</p>
        </LazyCard>

        <LazyCard
          className="bg-card dark:bg-theme-dark-card shadow-lg"
          delay={200}
          header={
            <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
              <h3 className="text-sm font-medium">Lucro Mensal</h3>
              <TrendingUp className="h-5 w-5 text-blue-500" />
            </div>
          }
        >
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">+{formatCurrency(monthlyProfit)}</div>
          <p className="text-xs text-muted-foreground pt-1">Este mês</p>
        </LazyCard>
      </div>

      <div>
        <h2 className="mb-3 text-xl font-semibold tracking-tight text-foreground">Atalhos Rápidos</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shortcuts.map((shortcut, index) => (
            <ShortcutCard
              key={shortcut.title}
              title={shortcut.title}
              icon={shortcut.icon}
              href={shortcut.href}
              color={shortcut.color}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
