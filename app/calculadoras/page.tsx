// Página principal das calculadoras
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Calculator, Percent, TrendingUp, ArrowRight } from "lucide-react"
import Link from "next/link"

const calculators = [
  {
    title: "Matched Betting",
    description: "Calcule apostas combinadas e extraia freebets com precisão",
    icon: Calculator,
    href: "/calculadoras/surebet",
    color: "text-blue-500 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    features: ["Cálculo de Surebet", "Extração de Freebet", "Gerenciamento de Risco", "Múltiplas Moedas"],
  },
  {
    title: "Cashback",
    description: "Calcule o valor de cashback baseado no valor apostado e porcentagem",
    icon: Percent,
    href: "/calculadoras/cashback",
    color: "text-green-500 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    features: ["Cálculo Automático", "Diferentes Moedas", "Histórico de Cálculos", "Interface Simples"],
  },
]

export default function CalculadorasPage() {
  return (
    <div className="container mx-auto max-w-4xl space-y-6 p-4">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Calculadoras</h1>
        <p className="text-muted-foreground">Ferramentas essenciais para maximizar seus lucros em apostas esportivas</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {calculators.map((calc) => (
          <Link key={calc.title} href={calc.href}>
            <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer group dark:bg-theme-dark-card">
              <CardHeader className="pb-4">
                <div
                  className={`w-12 h-12 rounded-lg ${calc.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
                >
                  <calc.icon className={`h-6 w-6 ${calc.color}`} />
                </div>
                <CardTitle className="text-xl flex items-center justify-between">
                  {calc.title}
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all duration-200" />
                </CardTitle>
                <CardDescription className="text-sm">{calc.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-foreground">Recursos:</h4>
                  <ul className="space-y-1">
                    {calc.features.map((feature, index) => (
                      <li key={index} className="text-xs text-muted-foreground flex items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-theme-dark-primary mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Seção de estatísticas rápidas */}
      <div className="mt-8">
        <Card className="dark:bg-theme-dark-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-primary dark:text-theme-dark-primary" />
              Estatísticas de Uso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-primary dark:text-theme-dark-primary">127</p>
                <p className="text-xs text-muted-foreground">Cálculos Realizados</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">R$ 2.847</p>
                <p className="text-xs text-muted-foreground">Lucro Calculado</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dicas rápidas */}
      <div className="mt-6">
        <Card className="border-yellow-200 dark:border-yellow-700/30 dark:bg-theme-dark-card">
          <CardHeader>
            <CardTitle className="text-lg text-yellow-700 dark:text-yellow-300">💡 Dicas Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              • Use a calculadora de Matched Betting para extrair freebets com segurança
            </p>
            <p className="text-sm text-muted-foreground">• Sempre verifique as odds antes de fazer os cálculos</p>
            <p className="text-sm text-muted-foreground">
              • Mantenha um registro de todos os cálculos para acompanhar seu progresso
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
