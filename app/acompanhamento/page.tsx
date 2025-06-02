"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import {
  DollarSign,
  Target,
  TrendingUp,
  Calendar,
  BarChart3,
  PieChart,
  Save,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Dados mockados para demonstração
const dailyData = [
  { day: "Seg", profit: 45.5, entries: 3 },
  { day: "Ter", profit: -20.0, entries: 2 },
  { day: "Qua", profit: 85.0, entries: 5 },
  { day: "Qui", profit: 120.5, entries: 4 },
  { day: "Sex", profit: 65.0, entries: 3 },
  { day: "Sáb", profit: 95.5, entries: 6 },
  { day: "Dom", profit: 30.0, entries: 2 },
]

const monthlyData = [
  { month: "Jan", profit: 850.0, entries: 45 },
  { month: "Fev", profit: 1200.5, entries: 52 },
  { month: "Mar", profit: 950.0, entries: 48 },
  { month: "Abr", profit: 1420.3, entries: 58 },
  { month: "Mai", profit: 1100.0, entries: 50 },
]

const profitByType = [
  { type: "Surebet", value: 450.0, percentage: 35 },
  { type: "Extração de Freebet", value: 320.5, percentage: 25 },
  { type: "Super ODD", value: 280.0, percentage: 22 },
  { type: "Rodadas Grátis", value: 230.8, percentage: 18 },
]

export default function AcompanhamentoPage() {
  const [dailyProfitGoal, setDailyProfitGoal] = useState("100")
  const [dailyEntriesGoal, setDailyEntriesGoal] = useState("5")
  const [monthlyProfitGoal, setMonthlyProfitGoal] = useState("2000")
  const { toast } = useToast()

  const currentDailyProfit = 85.5
  const currentDailyEntries = 4
  const currentMonthlyProfit = 1420.3
  const currentMonthlyEntries = 58

  const dailyProfitProgress = (currentDailyProfit / Number.parseFloat(dailyProfitGoal)) * 100
  const dailyEntriesProgress = (currentDailyEntries / Number.parseFloat(dailyEntriesGoal)) * 100
  const monthlyProfitProgress = (currentMonthlyProfit / Number.parseFloat(monthlyProfitGoal)) * 100

  const totalProfit = profitByType.reduce((sum, item) => sum + item.value, 0)
  const maxDailyProfit = Math.max(...dailyData.map((d) => d.profit))
  const maxMonthlyProfit = Math.max(...monthlyData.map((d) => d.profit))

  const handleSaveGoals = () => {
    console.log({ dailyProfitGoal, dailyEntriesGoal, monthlyProfitGoal })
    toast({
      title: "Metas Salvas!",
      description: "Suas metas foram atualizadas com sucesso.",
    })
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-6 p-4">
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Acompanhamento da Banca</h1>

      <Tabs defaultValue="diario" className="w-full">
        <TabsList className="grid w-full grid-cols-2 dark:bg-theme-dark-card">
          <TabsTrigger
            value="diario"
            className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary dark:data-[state=active]:bg-theme-dark-primary/20 dark:data-[state=active]:text-theme-dark-primary"
          >
            <Calendar className="h-4 w-4" />
            Acompanhamento Diário
          </TabsTrigger>
          <TabsTrigger
            value="mensal"
            className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary dark:data-[state=active]:bg-theme-dark-primary/20 dark:data-[state=active]:text-theme-dark-primary"
          >
            <BarChart3 className="h-4 w-4" />
            Acompanhamento Mensal
          </TabsTrigger>
        </TabsList>

        <TabsContent value="diario" className="space-y-6">
          {/* Metas Diárias */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="dark:bg-theme-dark-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold flex items-center">
                  <Target className="mr-2 h-5 w-5 text-primary dark:text-theme-dark-primary" />
                  Meta de Lucro Diário
                </CardTitle>
                <CardDescription>
                  R$ {currentDailyProfit.toFixed(2)} / R$ {Number.parseFloat(dailyProfitGoal).toFixed(2)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress
                  value={Math.min(dailyProfitProgress, 100)}
                  aria-label={`${dailyProfitProgress.toFixed(0)}% da meta de lucro`}
                  className="h-3 [&>div]:bg-primary dark:[&>div]:bg-theme-dark-primary"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {dailyProfitProgress >= 100
                    ? "Meta atingida! 🎉"
                    : `Faltam R$ ${(Number.parseFloat(dailyProfitGoal) - currentDailyProfit).toFixed(2)}`}
                </p>
              </CardContent>
            </Card>

            <Card className="dark:bg-theme-dark-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-primary dark:text-theme-dark-primary" />
                  Entradas Diárias
                </CardTitle>
                <CardDescription>
                  {currentDailyEntries} / {Number.parseFloat(dailyEntriesGoal)} entradas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress
                  value={Math.min(dailyEntriesProgress, 100)}
                  aria-label={`${dailyEntriesProgress.toFixed(0)}% da meta de entradas`}
                  className="h-3 [&>div]:bg-primary dark:[&>div]:bg-theme-dark-primary"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {dailyEntriesProgress >= 100
                    ? "Meta atingida! 🎉"
                    : `Faltam ${Number.parseFloat(dailyEntriesGoal) - currentDailyEntries} entradas`}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico Semanal */}
          <Card className="dark:bg-theme-dark-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Performance Semanal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dailyData.map((day, index) => (
                  <div key={day.day} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="w-8 text-sm font-medium">{day.day}</span>
                      <div className="flex-1 bg-muted rounded-full h-6 min-w-[200px] relative overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-300",
                            day.profit >= 0 ? "bg-green-500 dark:bg-green-600" : "bg-red-500 dark:bg-red-600",
                          )}
                          style={{
                            width: `${Math.abs(day.profit / maxDailyProfit) * 100}%`,
                          }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                          R$ {day.profit.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>{day.entries} entradas</span>
                      {day.profit >= 0 ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mensal" className="space-y-6">
          {/* Meta Mensal */}
          <Card className="dark:bg-theme-dark-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold flex items-center">
                <Target className="mr-2 h-5 w-5 text-primary dark:text-theme-dark-primary" />
                Meta de Lucro Mensal
              </CardTitle>
              <CardDescription>
                R$ {currentMonthlyProfit.toFixed(2)} / R$ {Number.parseFloat(monthlyProfitGoal).toFixed(2)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress
                value={Math.min(monthlyProfitProgress, 100)}
                aria-label={`${monthlyProfitProgress.toFixed(0)}% da meta mensal`}
                className="h-3 [&>div]:bg-primary dark:[&>div]:bg-theme-dark-primary"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {monthlyProfitProgress >= 100
                  ? "Meta atingida! 🎉"
                  : `Faltam R$ ${(Number.parseFloat(monthlyProfitGoal) - currentMonthlyProfit).toFixed(2)}`}
              </p>
            </CardContent>
          </Card>

          {/* Gráfico Mensal */}
          <Card className="dark:bg-theme-dark-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Performance Mensal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyData.map((month, index) => (
                  <div key={month.month} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="w-8 text-sm font-medium">{month.month}</span>
                      <div className="flex-1 bg-muted rounded-full h-8 min-w-[250px] relative overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-primary/80 dark:from-theme-dark-primary dark:to-theme-dark-primary/80 rounded-full transition-all duration-300"
                          style={{
                            width: `${(month.profit / maxMonthlyProfit) * 100}%`,
                          }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white">
                          R$ {month.profit.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>{month.entries} entradas</span>
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Distribuição por Tipo de Lucro */}
          <Card className="dark:bg-theme-dark-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="mr-2 h-5 w-5" />
                Distribuição por Tipo de Lucro
              </CardTitle>
              <CardDescription>Total: R$ {totalProfit.toFixed(2)}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profitByType.map((item, index) => (
                  <div key={item.type} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{item.type}</span>
                      <span className="text-muted-foreground">
                        R$ {item.value.toFixed(2)} ({item.percentage}%)
                      </span>
                    </div>
                    <Progress
                      value={item.percentage}
                      className="h-2"
                      style={
                        {
                          "--progress-background": `hsl(${120 + index * 60}, 70%, 50%)`,
                        } as React.CSSProperties
                      }
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Configuração de Metas */}
      <Card className="dark:bg-theme-dark-card">
        <CardHeader>
          <CardTitle className="text-lg">Configurar Metas</CardTitle>
          <CardDescription>Defina suas metas diárias e mensais para acompanhar seu progresso.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="dailyProfitGoal" className="flex items-center">
                <Target className="mr-2 h-4 w-4 text-primary dark:text-theme-dark-primary" />
                Meta Lucro Diário (R$)
              </Label>
              <Input
                id="dailyProfitGoal"
                type="number"
                step="1"
                placeholder="Ex: 100"
                value={dailyProfitGoal}
                onChange={(e) => setDailyProfitGoal(e.target.value)}
                className="mt-1 dark:bg-background dark:border-gray-600"
              />
            </div>
            <div>
              <Label htmlFor="dailyEntriesGoal" className="flex items-center">
                <TrendingUp className="mr-2 h-4 w-4 text-primary dark:text-theme-dark-primary" />
                Entradas Diárias
              </Label>
              <Input
                id="dailyEntriesGoal"
                type="number"
                step="1"
                placeholder="Ex: 5"
                value={dailyEntriesGoal}
                onChange={(e) => setDailyEntriesGoal(e.target.value)}
                className="mt-1 dark:bg-background dark:border-gray-600"
              />
            </div>
            <div>
              <Label htmlFor="monthlyProfitGoal" className="flex items-center">
                <DollarSign className="mr-2 h-4 w-4 text-primary dark:text-theme-dark-primary" />
                Meta Lucro Mensal (R$)
              </Label>
              <Input
                id="monthlyProfitGoal"
                type="number"
                step="1"
                placeholder="Ex: 2000"
                value={monthlyProfitGoal}
                onChange={(e) => setMonthlyProfitGoal(e.target.value)}
                className="mt-1 dark:bg-background dark:border-gray-600"
              />
            </div>
          </div>
          <Button
            onClick={handleSaveGoals}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground dark:bg-theme-dark-primary dark:hover:bg-theme-dark-primary/90"
          >
            <Save className="mr-2 h-4 w-4" />
            Salvar Metas
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
